module.exports = (function(){
  var Player = require("./player.js")
  var Ball = require("./ball.js")
  var Paddle = require("./paddle.js")
  var Powerup = require("./powerup.js")
  var PowerupArray = require("./powerup_array.js")

  var FPS = 30 //Frames per second

  var Game = function(io, gameName) {
    this.io = io
    this.players = []
    this.powerups = new PowerupArray()
    this.grid = { width: 600, height: 600 }
    console.log(Paddle.SIDE.UP)
    this.openSides = {
      0: true,
      1: true,
      2: true,
      3: true
    }
    this.ball = null
    this.running = false
    this.gameOver = false
    this.gameName = gameName
    this._run()
    this.winningScore = 5
    this.loopIntervalId = -1
  }

  Game.prototype._start = function() {
    console.log("Starting...")
    if (!this.running)
      this.running = true
  }

  Game.prototype._run = function() {
    this.loopIntervalId = setInterval(function() { this._loop(); }.bind(this), 1000 / FPS);
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

  Game.prototype.decrementLife = function() {
    var loserSide;
    if (this.ball.y + this.ball.radius >= this.grid.height) {
      loserSide = Paddle.SIDE.DOWN
    } else if (this.ball.y - this.ball.radius <= 0) {
      loserSide = Paddle.SIDE.UP
    } else if (this.ball.x + this.ball.radius >= this.grid.width) {
      loserSide = Paddle.SIDE.RIGHT
    } else {
      loserSide = Paddle.SIDE.LEFT
    }

    for (var index in this.players) {
      if (this.players[index].paddle.side === loserSide) {
        this.players[index].life -= 1
        if (this.players[index].life > 0) {
          this.ball.x = this.grid.width / 2 - this.ball.radius
          this.ball.y = this.grid.height / 2 - this.ball.radius
        } else if (this.players[index].life === 0 && !this.isGameOver()) {
          this.players[index].width = 0
          this.players[index].height = 0
        }
        else if (this.players[index].life === 0 && this.isGameOver()) {
          clearInterval(this.loopIntervalId)
          this.gameOver = true
          this.io.sockets.in(this.gameName).emit("gameOver", this.getWinningPlayer().serialize());
        }
        this.running = false
        break
      }
    }
  }

  Game.prototype.getWinningPlayer = function() {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].life > 0)
        return this.players[i]
    }
    return null
  }

  Game.prototype.isGameOver = function() {
    var numLivePlayers = 0
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].life > 0)
        numLivePlayers += 1
    }
    return numLivePlayers >= 2
  }

  Game.prototype._loop = function() {
    var paddles = this.players.map(function(player) { return player.paddle })
    this.powerups.cleanDead()
    var onMapPowerups = this.powerups.getPowerupsOfCertainState(Powerup.STATE.ON_MAP)

    var success;
    if (this.ball != null && this.running && !this.gameOver) {
      success = this.ball.move(paddles.concat(onMapPowerups), this.openSides)
      if (!success)
        this.decrementLife()
    }

    if (onMapPowerups.length === 0) {
      this.powerups.push(new Powerup(this.grid))
    }

    this.io.sockets.in(this.gameName).emit("update", this.serialize());
  };

  Game.prototype.connect = function(socket) {
    console.log("Connecting")
    socket.on("newGame", this._newGame.bind(this))
    socket.on("input", this._onInput.bind(this))
    socket.on("start", this._start.bind(this))

    var playerId = (new Date()).getTime()
    this.players.push(new Player(playerId))
    this.ball = new Ball(this.grid)

    socket.on("disconnect", function() {
      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].playerId === playerId) {
          this.openSides[this.players[i].side] = true
          this.players.splice(i, 1);
        }
      }
    }.bind(this));

    socket.emit("assignId", { playerId: playerId })
  }

  Game.prototype._createPaddle = function(playerId) {
    var side;
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

    for (var side in this.openSides) {
      if (this.openSides.hasOwnProperty(side) && this.openSides[side]) {
        this.openSides[side] = false
        return parseInt(side)
      }
    }
    return null
  }

  Game.prototype._newGame = function(data) {
    this._createPaddle(data.playerId)
  }

  Game.prototype._onInput = function(data) {
    if ([Paddle.DIRECTION.UP, Paddle.DIRECTION.DOWN,
         Paddle.DIRECTION.LEFT, Paddle.DIRECTION.RIGHT].indexOf(data.direction) != -1) {
      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].playerId === data.playerId) {
          this.players[i].paddle.move(data.direction);
        }
      }
    }
  }

  return Game;
})()
