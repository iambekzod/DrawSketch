---
# DrawSketch API Documentation

## DrawSketch API

- description: sign into google
- request: `POST api/user/signin/google`
    - content-type: `application/json`
    - body: object
      - token: (string) the jwt of the authenticated user
- response: 422
	- body: no token
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the id created by mongoose,
      - username: (string) username,
      - email: (string) gmail,
      - wins: (int) number of wins,
      - room: (object) a lobby created by the user 
      - token: (string) the jwt
- response: 200
    - content-type: `application/json`
    - body: object 
      -redirect: (boolean) does the user need to be redirected to pick a username
      -token: (string) the jwt

``` 
$ curl -X POST 
       -H "Content-Type: application/json" 
       -d '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTcyYzk1MDkwMzk3MjA0ZDVkY
       TE2ZCIsInVzZXJuYW1lIjoiYXNkIiwiZXhwIjoxNTI2MDk4MDg2LCJpYXQiOjE1MjA5MTQwODZ9.eZXx6suP49sHk
       vNyA-spux80Kj8S1hUsoL0QABOixBA"}' 
  	   -k https://www.drawsketch.me/api/user/signin/google/
```

- description: get the current user using the jwt attached in header
- request: `GET /api/user/`
- response: 401
  - body: user doesn't exist
- response: 200
  - content-type: `application/json`
  - body: object
  - _id: (string) the id created by mongoose,
  - username: (string) username,
  - email: (string) the email user signed up with,
  - wins: (int) number of wins,
  - room: (object) a lobby created by the user  
  - token: (string) the jwt

``` 
$ curl -X GET 
       -H "Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJp
       ZCI6IjVhYTcyYzk1MDkwMzk3MjA0ZDVkYTE2ZCIsInVzZXJuYW1lIjoiYXNkIiwiZX
       hwIjoxNTI2MDk4MDg2LCJpYXQiOjE1MjA5MTQwODZ9.eZXx6suP49sHkvNyA-spux8
       0Kj8S1hUsoL0QABOixBA"
       -H "Content-Type: application/json" 
       -k https://www.drawsketch.me/api/user/
```


- description: give the user a username
- request: `PUT /api/user/update/username`
  - content-type: `application/json`
      - body: object
        - token: (string) the jwt of the user
        - username: (string) the username to store for the user
- response: 422
    -body: username not alphanumeric, username already taken, email already taken, and fallback error response  
- response: 200
  - content-type: `application/json`
  - body: object
    - _id: (string) the id created by mongoose,
    - username: (string) username,
    - email: (string) the email user signed up with,
    - wins: (int) number of wins,
    - room: (object) a lobby created by the user 
    - token: (string) the jwt
 
``` 
$ curl -X PUT
       -H "Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJp
       ZCI6IjVhYTcyYzk1MDkwMzk3MjA0ZDVkYTE2ZCIsInVzZXJuYW1lIjoiYXNkIiwiZX
       hwIjoxNTI2MDk4MDg2LCJpYXQiOjE1MjA5MTQwODZ9.eZXx6suP49sHkvNyA-spux8
       0Kj8S1hUsoL0QABOixBA"
       -H "Content-Type: application/json" 
       -d '{"username":"player123"}' 
       -k https://www.drawsketch.me/api/user/update/username
``` 

- description: signup using local passport strategy
- request: `POST /api/user/signup`
- content-type: `application/json`
    - body: object
      - username: (string) the username of the user
      - firstname: (string) the firstname of the user
      - lastname: (string) the lastname of the user
      - email: (string) the email of the user
      - password: (string) the password for the user
      - confirmPassword: (string) repeat of the password
- response: 422
    - body: username is already taken, username is not alphanumeric, email is already taken, first name contains non-letters, lastname contains non-letters, email not correct format, password does not equal to confirm password, and fallback error response
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the id created by mongoose,
      - username: (string) username,
      - email: (string) the email user signed up with,
      - wins: (int) number of wins,
      - room: (object) a lobby created by the user 
      - token: (string) the jwt 

``` 
$ curl -X POST
       -H "Content-Type: application/json" 
       -d '{"username":"player123", "firstname":"player", "lastname":"only", 
       "email":"player@live.ca", "password":"pw", "confirmPassword":"pw"}' 
       -k https://www.drawsketch.me/api/user/signup
``` 

- description: signin a user given a username and password using local passport strategy
- request: `POST /api/user/signin`
- content-type: `application/json`
    - body: object
      - username: (string) the username of the user
      - password: (string) the password for the user
- response: 422
    - body: username is not alphanumeric, and fallback error response
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the id created by mongoose,
      - username: (string) username,
      - email: (string) the email user signed up with,
      - wins: (int) number of wins,
      - room: (object) a lobby created by the user 
      - token: (string) the jwt 
 
``` 
$ curl -X POST
       -H "Content-Type: application/json" 
       -d '{"username":"player123", "password":"pw"}' 
       -k https://www.drawsketch.me/api/user/signin
``` 
  
- description: get the list of all the rooms, must be authenticated user
- request: `GET /api/lobby`
- response: 200
    - content-type: `application/json`
    - body: list of objects
      - id: (string) id of the room,
      - name: (string) name of the room,
      - author: (string) the username of the author that created the room,
      - password: (string) password of the room,
      - locked: (boolean) does the room have a password,
      - players: (int) number of players in the room out of total number of players allowed in the room,
      - rounds: (int) total number of rounds of the room

``` 
$ curl -X GET 
       -H "Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJp
       ZCI6IjVhYTcyYzk1MDkwMzk3MjA0ZDVkYTE2ZCIsInVzZXJuYW1lIjoiYXNkIiwiZX
       hwIjoxNTI2MDk4MDg2LCJpYXQiOjE1MjA5MTQwODZ9.eZXx6suP49sHkvNyA-spux8
       0Kj8S1hUsoL0QABOixBA"
       -k https://www.drawsketch.me/api/lobby/
``` 
  
- description: get the room with the specified id, must be authenticated
- request: `GET /api/lobby/:id`
- response: 200
  - content-type: `application/json`
  - body: object
    - name: (string) name of the room,
    - author: (string) the username of the author that created the room,
    - password: (string) password of the room,
    - locked: (string) does the room have a password,
    - timeLimit: (integer) number of seconds per round,
    - maxPlayers: (integer) max number of players allowed in the room,
    - rounds: (integer) total number of rounds in the room,
    - players: (list) a list of players in the room,
    - started: (boolean) did the round start,
    - gameState: (object) the state of the drawing board,
    - timeElapsed: (string) time elapsed,
    - roundsPlayed: (string) rounds played so far,
- response: 409
    - body: room id doesn't exist

``` 
$ curl -X GET 
       -H "Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJp
       ZCI6IjVhYTcyYzk1MDkwMzk3MjA0ZDVkYTE2ZCIsInVzZXJuYW1lIjoiYXNkIiwiZX
       hwIjoxNTI2MDk4MDg2LCJpYXQiOjE1MjA5MTQwODZ9.eZXx6suP49sHkvNyA-spux8
       0Kj8S1hUsoL0QABOixBA"
       -k https://www.drawsketch.me/api/lobby/J7r3sBOFn1mH076b
``` 

- description: create a room with the given settings
- request: `POST /api/lobby/`
- content-type: `application/json`
    - body: object
      - name: (string) name of the room,
      - maxPlayers: (string) max number of players,
      - rounds: (string) max number of rounds,
      - timeLimit: (string) time limit of each round,
      - password: (string) password of the room,
      - locked: (boolean) does the room have a password,
      - joinId: (string) id of the room,
      - joinPassword: (string) password used to join the room,
- response: 200
  - content-type: `application/json`
  - body: object
    - name: (string) name of the room,
    - author: (string) the username of the author that created the room,
    - password: (string) password of the room,
    - locked: (string) does the room have a password,
    - timeLimit: (integer) number of seconds per round,
    - maxPlayers: (integer) max number of players allowed in the room,
    - rounds: (integer) total number of rounds in the room,
    - players: (list) a list of players in the room,
    - started: (boolean) did the round start,
    - gameState: (object) the state of the drawing board,
    - timeElapsed: (string) time elapsed,
    - roundsPlayed: (string) rounds played so far,
- response: 401
  - body: user doesn't exist
- response: 409
  - body: room name already exists
- response: 422
  - body: invalid room id

``` 
$ curl -X POST 
       -H "Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJp
       ZCI6IjVhYTcyYzk1MDkwMzk3MjA0ZDVkYTE2ZCIsInVzZXJuYW1lIjoiYXNkIiwiZX
       hwIjoxNTI2MDk4MDg2LCJpYXQiOjE1MjA5MTQwODZ9.eZXx6suP49sHkvNyA-spux8
       0Kj8S1hUsoL0QABOixBA"
       -H "Content-Type: application/json" 
       -d '{"name":"join this lobby", "maxPlayers": "10", "rounds": "4", "timeLimit": "0.30", 
       "password": "", "locked": false, "joinId": "", "joinPassword": ""}' 
       -k https://www.drawsketch.me/api/lobby/
``` 

- description: join a room 
- request: `POST /api/lobby/join/:id`
- content-type: `application/json`
    - body: object
      - password: password of the room
- response: 200
  - content-type: `application/json`
  - body: object
    - name: (string) name of the room,
    - author: (string) the username of the author that created the room,
    - password: (string) password of the room,
    - locked: (string) does the room have a password,
    - timeLimit: (integer) number of seconds per round,
    - maxPlayers: (integer) max number of players allowed in the room,
    - rounds: (integer) total number of rounds in the room,
    - players: (list) a list of players in the room,
    - started: (boolean) did the round start,
    - gameState: (object) the state of the drawing board,
    - timeElapsed: (string) time elapsed,
    - roundsPlayed: (string) rounds played so far,
- response: 401
  - body: user doesn't exist
- response: 409
  - body: room doesn't exist, user already joined a lobby, room is full, did not enter password when room is locked, invalid password
- response: 422
  - body: invalid room id

``` 
$ curl -X POST 
       -H "Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJp
       ZCI6IjVhYTcyYzk1MDkwMzk3MjA0ZDVkYTE2ZCIsInVzZXJuYW1lIjoiYXNkIiwiZX
       hwIjoxNTI2MDk4MDg2LCJpYXQiOjE1MjA5MTQwODZ9.eZXx6suP49sHkvNyA-spux8
       0Kj8S1hUsoL0QABOixBA"
       -H "Content-Type: application/json" 
       -d '{"password": "secret"}' 
       -k https://www.drawsketch.me/api/lobby/J7r3sBOFn1mH076b
``` 

- description: leave a room 
- request: `POST /api/lobby/leave/:id`
- response: 200
  - content-type: `application/json`
  - body: object
    - name: (string) name of the room,
    - author: (string) the username of the author that created the room,
    - password: (string) password of the room,
    - locked: (string) does the room have a password,
    - timeLimit: (integer) number of seconds per round,
    - maxPlayers: (integer) max number of players allowed in the room,
    - rounds: (integer) total number of rounds in the room,
    - players: (list) a list of players in the room,
    - started: (boolean) did the round start,
    - gameState: (object) the state of the drawing board,
    - timeElapsed: (string) time elapsed,
    - roundsPlayed: (string) rounds played so far,
- response: 401
  - body: user doesn't exist
- response: 409
  - body: room doesn't exist, user already not in room
- response: 422
  - body: invalid room id

``` 
$ curl -X POST 
       -H "Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJp
       ZCI6IjVhYTcyYzk1MDkwMzk3MjA0ZDVkYTE2ZCIsInVzZXJuYW1lIjoiYXNkIiwiZX
       hwIjoxNTI2MDk4MDg2LCJpYXQiOjE1MjA5MTQwODZ9.eZXx6suP49sHkvNyA-spux8
       0Kj8S1hUsoL0QABOixBA"
       -k https://www.drawsketch.me/api/lobby/leave/J7r3sBOFn1mH076b
``` 
