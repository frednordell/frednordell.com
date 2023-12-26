package main

import (
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "OK!",
		})
	})

	r.Use(static.Serve("/", static.LocalFile("./frontend/dist", false)))
	r.Run() // listen and serve on 0.0.0.0:8080
}
