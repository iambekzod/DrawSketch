const socketIO = require('socket.io');
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
    inGame(player){
        const found = this.players.find( (e) => e.username == player.username)
        if(!found){
            return false
        }
        return true
    }
}
class GameServer {
    constructor(server){
        this.games = [];
    }
    findGame(id){
        var game = this.games.find((game) => game.id === id);
        if(!game){
            return null
        }
        const index = this.games.indexOf(game);
        return index

    }
    createGame(id){
        const newGame = new Game(id)
        this.games.push(newGame)
        return  newGame
    }
    joinGame(player,id){
        var game = this.findGame(id);
        this.games[game].playerJoin(player);
        return this.games[game];
    }
    setGameState(id,state){
        var game = this.findGame(id);
        this.games[game].setState(state);
        return this.games[game];

    }
}
module.exports =
    GameServer
