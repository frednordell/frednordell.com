FROM node:20 as build-frontend

WORKDIR /frontend
COPY frontend/ /frontend/
RUN npm install --production
RUN npm run build

FROM golang:1.12 as build-backend

WORKDIR /backend
COPY backend/go.mod backend/go.sum /backend/
RUN go mod download 

COPY /backend/*.go /backend/
RUN CGO_ENABLED=0 GOOS=linux go build -o /webserver

FROM alpine:latest

WORKDIR /
COPY --from=build-frontend /frontend/ /frontend/
COPY --from=build-backend /backend/webserver /webserver

RUN adduser -D server
USER server

EXPOSE 8080
CMD ["/webserver"]