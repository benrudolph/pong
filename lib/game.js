module.exports = (function(){
  var Player = require("./player.js")
  var Ball = require("./ball.js")
  var Paddle = require("./paddle.js")
  var Powerup = require("./powerup.js")
  var PowerupArray = require("./powerup_array.js")

  var FPS = 30 //Frames per second

  var Game = function(io) {
    this.io = io
    this.players = []
    this.powerups = new PowerupArray()
    this.io.sockets.on("connection", this._onConnection.bind(this))
    this.grid = { width: 800, height: 500 }
    this.ball = null
    this.running = false
    this._run()
  }

  Game.prototype._start = function() {
    console.log("Starting...")
    if (!this.running)
      this.running = true
  }

  Game.prototype._run = function() {
    setInterval(function() { this._loop(); }.bind(this), 1000 / FPS);
  };

  Game.prototype.serialize = function() {
    var paddles = []
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].paddle !== null) {
        paddles.push(this.players[i].paddle.serialize());
      }
    }
    var ball = this.ball === null ? null : this.ball.serialize()
    var onMapPowerups = this.powerups.getPowerupsOfCertainState(Powerup.STATE.ON_MAP)
    var state = {
      ball: ball,
      paddles: paddles,
      players: this.players.map(function(player) { return player.serialize(); }),
      powerups: onMapPowerups.map(function(powerup) { return powerup.serialize(); })
    }
    return state
  };

  Game.prototype.incrementScore = function() {
    var winnerSide;
    if (this.ball.x < this.grid.width / 2) {
      // The right side player has scored
      winnerSide = Paddle.SIDE.RIGHT
    }
    else {
      winnerSide = Paddle.SIDE.LEFT
    }

    for (var index in this.players) {
      if (this.players[index].paddle.side === winnerSide) {
        this.players[index].score += 1
        break
      }
    }
  }

  Game.prototype._loop = function() {
    var paddles = this.players.map(function(player) { return player.paddle })
    this.powerups.cleanDead()
    var onMapPowerups = this.powerups.getPowerupsOfCertainState(Powerup.STATE.ON_MAP)

    var success;
    if (this.ball != null && this.running) {
      success = this.ball.move(paddles.concat(onMapPowerups))
      if (!success)
        this.incrementScore()
    }

    if (onMapPowerups.length === 0) {
      this.powerups.push(new Powerup(this.grid))
    }

    this.io.sockets.emit("update", this.serialize());
  };

  Game.prototype._onConnection = function(socket) {
    socket.on("newGame", this._newGame.bind(this))
    socket.on("input", this._onInput.bind(this))
    socket.on("start", this._start.bind(this))

    var playerId = (new Date()).getTime()
    this.players.push(new Player(playerId))
    this.ball = new Ball(this.grid)

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
        side = this._determineSide()
        if (side !== null)
          this.players[i].paddle = new Paddle(this.players[i], this.grid, side);
      }
    }
  }

  /* Determines the side in which the paddle belongs on. Returns null if game is full */
  Game.prototype._determineSide = function() {
    if (this.players.length === 1)
      return Paddle.SIDE.LEFT
    else if (this.players.length === 2) {
      return this.players[0].paddle.side === Paddle.SIDE.LEFT ?
        Paddle.SIDE.RIGHT : Paddle.SIDE.LEFT
    }
    else
      return null
  }

  Game.prototype._newGame = function(data) {
    this._createPaddle(data.playerId)
  }

  Game.prototype._onInput = function(data) {
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
