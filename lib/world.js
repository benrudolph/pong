module.exports = (function() {

  var Game = require("./game.js")

  var World = function(io) {
    this.io = io
    this.io.sockets.on("connection", this._onConnection.bind(this))
    this.games = []
    this.clients = {}
  }

  World.prototype._onConnection = function(socket) {
    console.log("connecting backend")
    this.clients[socket.id] = socket
    socket.on("game", this.game.bind(this))
  }

  World.prototype.game = function(data) {
    var socket = this.clients[data.socketId]
    socket.join(data.gameName)
    var game = this.addGame(data.gameName)
    game.connect(socket)
  }

  /* Adds game to the world and returns the game. If the game already exists, it will return the existing
   * game. */
  World.prototype.addGame = function(gameName){
    var gameNames = this.games.map(function(game){ return game.gameName})
    var game = null
    var index = gameNames.indexOf(gameName)
    if (index === -1) {
      game = new Game(this.io, gameName)
      this.games.push(game)
    } else {
      game = this.games[index]
    }
    return game
  }
  return World
})()
