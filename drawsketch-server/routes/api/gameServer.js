const socketIO = require('socket.io');
const short = require('short-uuid');
const server = require('./lobby.js');

function Begin(game) {
    //map socketid to player
    const players = []
    const newGame = new Game();
}
class Game {
    constructor(id) {
        this.id = id;
        this.roundsPlayed = 0;
        this.totalRounds = 5;
        this.players = [];
        this.drawer = "";
        this.state = {
            isPainting: false,
            xPos: [],
            yPos: [],
            width: [],
            dragging: [],
            paintColor: [],
            curWidth: 2,
            curColor: "black",
        }
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
    playerJoin(player){
        this.players.push(player);
    }

    setState(gameState){
        this.state = gameState;
    }
}
class GameServer {
    constructor(server){
        this.games = [new Game(1)];
    }
    findGame(id){
        var game = this.games.find((game) => game.id === id);
        if(!game){
            return null
        }
        return game

    }
    createGame(id){
        games.push(new Game(id))
    }
    joinGame(player,id){
        var game = this.findGame(id);

        game.playerJoin(player);
    }
    setGameState(id,state){
        var game = this.findGame(id);
        var gameIndex = this.games.indexOf(game);
        this.games[gameIndex].setState(state);
        return this.games[gameIndex];

    }
}
module.exports =
    GameServer
