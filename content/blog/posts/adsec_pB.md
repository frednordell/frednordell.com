---
author:
- Hanna Höjbert and Fred Nordell
date: September 2020
postedAt: 2021-02-08
title: Object Security proof of concept
description: This report was written for the EITN50 - Advanced Computer Security course by me and lab partner Hanna Höjbert. The report explores the concept of Object Security by describing a proof of concept implemented in python.
---

# Introduction

This report will explore Object Security by the implementation of a
proof of concept. In the report design choices will be discussed among
with improvements that can be made to the proof of concept to be secure.

With Object Security one treats a message like an object by encrypting
the message before it is passed down to the application layer and sent
to the other part. This gives an end to end security. Also it is
possible to send message to a server for storage and later access the
data. Therefore it makes Object Security suitable for IOT-devices which
has limited battery capacity and can not always be charged before
running out of battery because the device does not need to have a
connection established all the time. Furthermore IOT-devices has limited
storage capacity limiting the size of the data packages being sent. It
is possible to send these small packages with Object Security since it
does not use long encryption keys. In this project the limited size is
set to 64 bytes.

The key to encrypt the message is derived by using Ephemeral
Diffie-Hellman. The two parts negotiate a shared secret that they use as
the key to encrypt the message with. Even though it offers end to end
security it is vulnerable against man in the middle attacks if
authentication of the parties is not added.

With forward secrecy a session key won't be compromised if the private
key is compromised. This is ensured by generating an unique key for each
session that the user initiates. By using Ephemeral Diffie-Hellman the
server will generate a new set of key parameters for each session. Since
these key parameters never should be stored it offers protection going
forwards. If the private key is compromised it won't help the attacker
because the public key was never used to protect anything.

# Architecture

UDP is used to transport the data between actors. The Ephemeral
Diffie-Hellman key exchange is used to be able to securely derive a
common secret. We then used HKDF [1](#c1) to derive keys from the shared
secret. We chose Diffie-Hellman as it allowed us to use a symmetric key
encryption which does not require large key sizes which is favourable in
IOT-devices with constrained computing and battery. Moreover, the
Ephemeral form was used to ensure perfect forward secrecy as the shared
secret is re-negotiated with each handshake.

However, because we want to allow for caching a receiving party could in
theory save the session-key and receive the data-package at a later time
and then decrypt the data. A result of this is that the receiving party
does not send an acknowledgement message back to the sending party, and
consequently the sending party does not know if the data was received
successfully.

To prevent replay attacks we added a random 4 character string to the
header of the package that the receiving party can save and validate
that it has not retrieved the message before. However, the message
should also be verified with a MAC, this we have not implemented.

The header consist of three parts, the destination IP, the destination
port and the aforementioned nonce. The headers are organized as
key-value pairs delimited with colons and separated with commas and then
a semicolon is used to separate the data as follows:
"ip:127.0.0.1,port:8080,id:asdf;DATA". The total package size is max 64
bytes.

The sequence diagram in figure [1](#fig:seq_diag) describes the handshake and data transfer
process.

![Sequence Diagram#fig:seq_diag](Sequence.png)

# Evaluation

This proof of concept protocol is reasonably safe however it is not
perfectly secure. For example, the proof of concept does not
authenticate the sending and receiving part and as such is susceptible
to man in the middle attacks. Moreover, as mentioned in the
architectural section in this report there is no MAC on the headers and
as such replay-attacks are a possibility. The data portion of the
message cannot be altered however as the cryptography module checks the
cipher at decryption and if it has been altered it will throw an error.
An improvement to be made here can be to use the elliptic curve version
as it is not as computationally intensive which would benefit the
constrained IOT-devices.

In figure [2](#fig:client),
[3](#fig:proxy) and
[4](#fig:server) printouts
for the client, server and proxy are listed. One can see the message in
both the client and server as well as the individual packages printed by
the proxy.

![Console printouts for client#fig:client](client.png)

![Console printouts for proxy#fig:proxy](proxy.png)

![Console printouts for server#fig:server](server.png)

With Object security it is possible to send data to a cache or proxy to
later access it again using the same saved key for decryption. This is
suitable for IOT-devices as their battery tend to run out before having
the possibility to charge. Therefore they can send encrypted data to a
proxy and later get access to the data with the same key. With this key
the data can be decrypted again.

When wanting to broadcast data through a proxy object security works
well as it receives data, decrypts it and then broadcasts it to other
receiving parts. The proxy will negotiate new keys for each part and
encrypt the data with the key corresponding to the receiving part. It
makes it possible to easily reach many receiving parts with data with
end to end security.

The protocol, if implemented with current cryptographic modules and with
some improvements for example a MAC for the header and mutual
authentication in the handshake, would be secure enough to use in
production environments. Moreover, the protocol can be fast and
computationally inexpensive which is important for IOT-devices if
considerations are made regarding the algorithms used. For example AES
as it can be optimized in hardware and is, and RSA for signatures as it
is fast to check and sign.

A good thing about an Object security protocol like the proof of concept
is that it has a small network overhead, the data packages can be filled
to minimize the number of packages sent as we are sending chunks of the
encrypted object. However, a consequence of this is that the receiving
part has to receive all the data packages to ensure successful
decryption. In this proof of concept there is no acknowledgement or
error correcting but this should be taken into consideration.

# Conclusion

We conclude that the Object security model is a good fit for the IOT
space. It provides security but also some key features including
broadcastablility, proxying and low network overhead. The proof of
concept we developed shows how the concepts can be put into production
and make devices able to use the Object security model when sending
data. With Object security it is possible for IOT devices to send and
store data that is accessed later which is favorable since IOT devices
have small batteries.


# References:
### c1:
[https://en.wikipedia.org/wiki/HKDF](https://en.wikipedia.org/wiki/HKDF)

# Appendix A

## Server

```python
import socket
from cryptography.fernet import Fernet
import base64
import string
from cryptography.hazmat.backends.openssl.backend import backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
import os
kdf = HKDF(
     algorithm=hashes.SHA256(),
     length=32,
     salt=None,
     backend=backend,
     info=b"Handshake data"
)
import random

UDP_IP = "127.0.0.1"
UDP_RECIEVING_PORT = 8082
UDP_SENDING_PORT = 8081
SHARED_PRIME = 23
SHARED_BASE = 5
SERVER_SECRET = 15
SHARED_SECRET = None
BUFFSIZE = 64
KEY = None
used_id = set()

sock = socket.socket(socket.AF_INET, # Internet
                     socket.SOCK_DGRAM) # UDP
sock.bind((UDP_IP, UDP_RECIEVING_PORT))


# DH exchange is very inspired by:
# https://cryptography.io/en/latest/hazmat/primitives/asymmetric/dh/#exchange-algorithm
def listen():
    while True:
        data, addr = sock.recvfrom(BUFFSIZE)
        if data:
            print("Handshake initialized!")
            global SHARED_SECRET
            global SERVER_SECRET 
            SERVER_SECRET = random.randint(0, 128)
            B = (SHARED_BASE**SERVER_SECRET) % SHARED_PRIME
            data = data.split(b";")[1]
            SHARED_SECRET = (int.from_bytes(data, byteorder='big')**SERVER_SECRET) % SHARED_PRIME
            id = ''.join(random.choice(string.ascii_lowercase) for _ in range(4))
            headers = b"ip:" + bytes(UDP_IP, "utf8") + b",port:" + bytes(str(UDP_SENDING_PORT), "utf8") + b",id:" + bytes(id, "ascii") + b";"
            sock.sendto(headers + bytes(B), (UDP_IP, UDP_SENDING_PORT))
            print("Handshake complete")
            return True

def getData():
    global KEY
    KEY = base64.urlsafe_b64encode(kdf.derive(bytes(SHARED_SECRET)))
    fer = Fernet(KEY)
    chipher = b""
    print("Waiting for data")
    while True:
        data, addr = sock.recvfrom(BUFFSIZE)
        if data.split(b";")[1] == b'\xFF':
            break
        elif data[3:7] in used_id:
            raise Exception("MessageId already used")
        else:
            headers, body = data.split(b";")
            headers = str(headers)
            headers = headers.split(",")
            hmap = {}
            for header in  headers:
                f, s = header.split(":")
                hmap[f] = s
            used_id.add(hmap.get("id"))
            chipher += body
    print("All data recieved")
    message = fer.decrypt(chipher)
    print(message)


if __name__ == "__main__":
    if listen():
        getData()
```

## Client

```python
import socket
import random
from cryptography.fernet import Fernet
import base64
from cryptography.hazmat.backends.openssl.backend import backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
import os
import string
kdf = HKDF(
     algorithm=hashes.SHA256(),
     length=32,
     salt=None,
     backend=backend,
     info=b"Handshake data"
)


UDP_IP = "127.0.0.1"
UDP_SENDING_PORT = 8080
UDP_RECIEVING_PORT = 8081
MESSAGE = b"Cafe iDet ger ut mackor och dryck mellan kl 12 till kl 13 under vardagar."
SHARED_PRIME = 23
SHARED_BASE = 5
CLIENT_SECRET = None
SHARED_SECRET = None
BUFFSIZE = 64
KEY = None

print("UDP target IP: %s" % UDP_IP)
print("UDP target port: %s" % UDP_SENDING_PORT)
print("message: %s" % MESSAGE)
 
sock = socket.socket(socket.AF_INET, # Internet
                    socket.SOCK_DGRAM) # UDP
sock.bind((UDP_IP, UDP_RECIEVING_PORT))


# DH exchange is very inspired by:
# https://cryptography.io/en/latest/hazmat/primitives/asymmetric/dh/#exchange-algorithm
def connect():
    print("Handshake initiated")
    global CLIENT_SECRET 
    CLIENT_SECRET = random.randint(0, 128)
    A = (SHARED_BASE**CLIENT_SECRET) % SHARED_PRIME
    id = ''.join(random.choice(string.ascii_lowercase) for _ in range(4))
    headers = b"ip:" + bytes(UDP_IP, "utf8") + b",port:" + bytes(str(UDP_SENDING_PORT), "utf8") + b",id:" + bytes(id, "ascii") + b";"
    sock.sendto(headers + bytes(A), (UDP_IP, UDP_SENDING_PORT))
    while True:
        data, addr = sock.recvfrom(BUFFSIZE)
        if data:
            global SHARED_SECRET
            data = data.split(b";")[1]
            SHARED_SECRET = (int.from_bytes(data, byteorder='big')**CLIENT_SECRET) % SHARED_PRIME
            print("Handshake completed")
            return True


def sendData():
    print("Sending data....")
    global KEY
    KEY = base64.urlsafe_b64encode(kdf.derive(bytes(SHARED_SECRET)))
    f = Fernet(KEY)
    token = f.encrypt(MESSAGE)
    while token:
        id = ''.join(random.choice(string.ascii_lowercase) for _ in range(4))
        headers = b"ip:" + bytes(UDP_IP, "utf8") + b",port:" + bytes(str(UDP_SENDING_PORT), "utf8") + b",id:" + bytes(id, "ascii") + b";"
        token_slice = headers + token[:BUFFSIZE - len(headers)]
        sock.sendto(token_slice, (UDP_IP, UDP_SENDING_PORT))
        token = token[len(token_slice) - len(headers):]
    id = ''.join(random.choice(string.ascii_lowercase) for _ in range(4))
    headers = b"ip:" + bytes(UDP_IP, "utf8") + b",port:" + bytes(str(UDP_SENDING_PORT), "utf8") + b",id:" + bytes(id, "ascii") + b";"
    sock.sendto(headers + b'\xFF', (UDP_IP, UDP_SENDING_PORT))
    print("Data sent!")


if __name__ == "__main__":
    handshake = connect()
    if handshake:
        sendData()
```

## Proxy

```python
import socket

UDP_IP = "127.0.0.1"
UDP_RECIEVING_PORT = 8080
BUFFSIZE = 64

sock = socket.socket(socket.AF_INET, # Internet
                    socket.SOCK_DGRAM) # UDP
sock.bind((UDP_IP, UDP_RECIEVING_PORT))

while True:
    data, addr = sock.recvfrom(64)
    print(data)
    headers = data.split(b";")[0]
    headers = headers.split(b",")
    hmap = {}
    for header in  headers:
        f, s = header.split(b":")
        hmap[f] = s
    ip = str(hmap.get(b"ip"), "utf8")
    port = int(hmap.get(b"port")) + 2  
    # A broadcast message would have more modification to IP and ports
    sock.sendto(data, (ip, port))
```

## PlantUML

    @startuml
    Participant Client
    == Ephemeral DIffie-Hellman Handshake ==

    Client -> Proxy : (SharedBase**ClientSecret) % SharedPrime
    Proxy -> Server : Forward ClientHello
    |||
    Server -> Client : (SharedBase^ServerSecret) % SharedPrime
    rnote over Server: Server can save derived key \n for later use if proxy holds data \n for a long time


    == Encrypted Transfer ==

    |||

    Client -> Proxy : Encrypted Data
    Proxy -> Server : Forward Data
    @enduml
