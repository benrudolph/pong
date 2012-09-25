window.Pong.Game = (function() {
  var FPS = 30;

  var KEY_UP = 38;
  var KEY_DOWN = 40;
  var SPACE_BAR = 32;

  var Game = function() {
    this.socket = io.connect(window.location.hostname);
    this.canvas = document.getElementById("pong")
    this.paddles = [];
    this.players = [];
    this.powerups = [];
    this.ball = null;
    document.addEventListener("keydown", this._onKeydown.bind(this));
    this.socket.on("connect", this._onConnect.bind(this));
    this.socket.on("assignId", this._onAssignId.bind(this));
    this.socket.on("update", this._onUpdate.bind(this));
    this.socket.on("gameOver", this._onGameOver.bind(this));
    params = this.getParams()
    this.gameName = params["gameName"]
    this.imageLibrary = null
  };

  Game.prototype._onGameOver = function(playerData) {
    $("#winner").text("Congrats!" + playerData.playerId + " won!")
  }

  Game.prototype.getParams = function() {
    var urlParams = {};
    (function () {
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);

        while (match = search.exec(query))
           urlParams[decode(match[1])] = decode(match[2]);
    })();
    return urlParams
  }

  Game.prototype._onConnect = function() {
    this.socket.emit("game", { gameName: this.gameName, socketId: this.socket.socket.sessionid })
  }

  Game.prototype._draw = function() {
    var context = this.canvas.getContext("2d");
    context.fillStyle = "#FFFFFF"
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (var i = 0; i < this.paddles.length; i++) {
      this.paddles[i].draw();
    }
    for (var i = 0; i < this.players.length; i++) {
      this.players[i].draw();
    }
    for (var i = 0; i < this.powerups.length; i++) {
      this.powerups[i].draw();
    }
    this.ball.draw();
  }

  Game.prototype._onAssignId = function(data) {
    this.playerId = data.playerId;
    this.socket.emit("newGame", { playerId: this.playerId });
  }

  Game.prototype._onUpdate = function(data) {
    $("#scoreboard").html("")
    this.paddles = this._resolvePaddleData(data.paddles);
    this.players = this._resolvePlayerData(data.players);
    this.powerups = this._resolvePowerupData(data.powerups);
    this.ball = this._resolveBallData(data.ball);
    this._draw();
  }

  Game.prototype._resolvePowerupData = function(powerupData) {
    var powerups = []

    for (var i = 0; i < powerupData.length; i++) {
      powerup = new Pong.Powerup(this.canvas)
      powerup.x = powerupData[i].x
      powerup.y = powerupData[i].y
      powerup.width = powerupData[i].width
      powerup.height = powerupData[i].height
      powerup.type = powerupData[i].type
      powerup.image = this.imageLibrary.getImage("images/extend_powerup.png")

      powerups.push(powerup)
    }

    return powerups
  }

  Game.prototype._resolvePaddleData = function(paddleData) {
    var paddles = [], paddle;

    // TODO: Put this in a paddle.deserialize method
    for(var i = 0; i < paddleData.length; i++) {
      paddle = new Pong.Paddle(this.canvas);
      paddle.y = paddleData[i].y;
      paddle.x = paddleData[i].x
      paddle.side = paddleData[i].side
      paddle.color = paddleData[i].color;
      paddle.width = paddleData[i].width;
      paddle.height = paddleData[i].height;
      paddle.paddle_body = this.imageLibrary.getImage("images/paddle_body.png")
      paddle.paddle_ends = this.imageLibrary.getImage("images/paddle_ends.png")

      paddles.push(paddle);
    }

    return paddles;
  }

  Game.prototype._resolveBallData = function(ballData) {
    ball = new Pong.Ball(this.canvas)
    ball.x = ballData.x
    ball.y = ballData.y
    ball.radius = ballData.radius
    ball.image = this.imageLibrary.getImage("images/ball.png")
    return ball
  }

  Game.prototype._resolvePlayerData = function(playerData) {
    var players = [];

    // TODO: Put this in a player.deserialize method
    for (var i = 0; i < playerData.length; i++) {
      player = new Pong.Player(playerData[i].playerId);
      player.score = playerData[i].score;
      player.color = playerData[i].color;
      players.push(player);
    }

    return players;
  }

  Game.prototype._onKeydown = function(e) {
    //console.log("keydown: " + e.which);
    switch(e.which) {
      case KEY_UP:
        e.preventDefault();
        this.socket.emit("input", {
          playerId: this.playerId,
          direction: Pong.Paddle.DIRECTION.UP
        });
        break;
      case KEY_DOWN:
        e.preventDefault();
        this.socket.emit("input", {
          playerId: this.playerId,
          direction: Pong.Paddle.DIRECTION.DOWN
        });
        break;
      case SPACE_BAR:
        e.preventDefault();
        this.socket.emit("start", {})
        break;
    }
  }

  return Game;
})();
