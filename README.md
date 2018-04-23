# DrawSketch - C09 Project Proposal

## Members: Bekzod Tursunov, Weiqiang Zhang, Shuyi Qiu

* Public URL: https://drawsketch.me/
* Demo URL: https://www.youtube.com/watch?v=B-lIrZije-k
* API URL: https://drawsketch.me/readme

# Description

A multi user drawing game where one person draws something, while the other players try to guess what is being drawn in realtime.

# Key Features by Beta

- Handle communications between connected users themselves and the backend (register, login, drawing portion)
- Be able to have multiple users connect and show correct information (who is currently connected, who is currently drawing, etc)
- Have a predefined generation set of guessable words by the users, which are set during game creation

# Additional features by Final
- setup rules for the game
- Handle the guessing portion by users
- Be able to connect with facebook/twitter
- Save your drawn work locally at the end of the game

# Technology used
- Socket.io for backend communication
- Framework like Angular/React for the frontend
- API for the drawable topics we can play with (Countries, Cities, Animals, etc)
- API for interacting with social media platforms to login etc.

# Top 5 Challenges
- Successfully deliver the drawing user's canvas to every other user connected while having the game synchronized in realtime
- Secure application against malicious intent (cheating on the game)
- Be able to incorporate the working backend with the frontend using a new framework like Angular/React
- Have a clean UI/UX on the frontend
- Be made to work cross platform, mobile and desktop

# SetUp Information
Create a file '-nogit.env' containing content for all keys:
* MONGO_URL=XXX
* JWT_SECRET=XXX
* CLIENT_ID=XXX
* CLIENT_SECRET=XXX
