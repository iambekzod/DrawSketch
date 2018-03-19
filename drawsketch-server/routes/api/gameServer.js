const socketIO = require('socket.io');
const short = require('short-uuid');
function Begin(game) {
    const io = socketIO(server);
    //map socketid to player
    const players = []
    const newGame = new Game();
    io.on('connection', function (socket) {
        socket.on("gameState", (state) => {
            io.emit('return', state)
        })
        socket.on("beginRound", (player) => {
            console.log("BEGINING");
            socket.emit('getWord', "Cat");
            socket
                .broadcast
                .emit('startRound', JSON.stringify(newGame));
        })
        socket.on("guess", (player, guess) => {
            if (guess == "cat") {
                var cur = players.find((e) => e.player._id == player._id)
                newGame.points++;
                newGame.roundsPlayed++;
                if (newGame.roundsPlayed == newGame.totalRounds) {
                    io.emit('endRound', JSON.stringify(newGame));
                } else {
                    io.emit('roundOver', JSON.stringify(newGame));
                }

            }

        })
        socket.on("join", (player) => {
            players.push({id: socket.id, player: player, points: 0})
        })
    })
}
class Game {
    constructor() {
        this.id = short.uuid();
        this.roundsPlayed = 0;
        this.totalRounds = 5;
        this.drawer = "";
        // will change -> create new file with lists of words
        this.words = [
            "cat",
            "dog",
            "boat",
            "chair",
            "video game",
            "baseball",
            "book"
        ]

    }
}
module.exports = {
    Game,
    Begin
}
