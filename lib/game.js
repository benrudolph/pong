module.exports = (function(){
  var Player = require("./player.js")
  //var Ball = require("./ball.js")
  var Paddle = require("./paddle.js")

  var FPS = 30 //Frames per second

  var Game = function(io) {
    this.io = io
    this.players = []
    this.io.sockets.on("connection", this._onConnection.bind(this))
    this.grid = { width: 800, height: 500 }
    //this.ball = new Ball()
    this._run()
  }

  Game.prototype._run = function() {
    setInterval(function() { this._loop(); }.bind(this), 1000/FPS);
  };

  Game.prototype.serialize = function() {
    paddles = []
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].paddle !== null) {
        paddles.push(this.players[i].paddle.serialize());
      }
    }
    var state = {
      //ball: ball.serialize,
      paddles: paddles,
      players: this.players.map(function(player) { return player.serialize(); }),
    }
    return state
  };

  Game.prototype._loop = function() {
    //this.ball.move()

    this.io.sockets.emit("update", this.serialize());
  };

  Game.prototype._onConnection = function(socket) {
    socket.on("newGame", this._newGame.bind(this))
    socket.on("input", this._onInput.bind(this))

    var playerId = (new Date()).getTime()
    this.players.push(new Player(playerId))

    socket.on("disconnect", function() {
      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].playerId === playerId) {
          this.players.splice(i, 1);
        }
      }
    }.bind(this));

    socket.emit("assignId", { playerId: playerId })
  }

  Game.prototype._createPaddle = function(playerId) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].playerId === playerId) {
        this.players[i].paddle = new Paddle(this.players[i], this.grid);
      }
    }
  }

  Game.prototype._newGame = function(data) {
    this._createPaddle(data.playerId)
  }

  Game.prototype._onInput = function(data) {
    console.log(data)
    if ([Paddle.DIRECTION.UP, Paddle.DIRECTION.DOWN].indexOf(data.direction) != -1) {
      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].playerId === data.playerId) {
          this.players[i].paddle.move(data.direction);
        }
      }
    }
  }

  return Game; 
})()
