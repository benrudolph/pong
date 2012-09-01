window.Pong.Game = (function() {
  var FPS = 30;

  var KEY_UP = 38;
  var KEY_DOWN = 40;

  var Game = function() {
    this.socket = io.connect("/");
    this.canvas = document.getElementById("pong")
    this.paddles = [];
    document.addEventListener("keydown", this._onKeydown.bind(this));
    this.socket.on("assignId", this._onAssignId.bind(this));
    this.socket.on("update", this._onUpdate.bind(this));
  };

  Game.prototype._draw = function() {
    var context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (var i = 0; i < this.paddles.length; i++) {
      this.paddles[i].draw();
    }
  }

  Game.prototype._onAssignId = function(data) {
    this.playerId = data.playerId;
    this.socket.emit("newGame", { playerId: this.playerId });
  }

  Game.prototype._onUpdate = function(data) {
    this.paddles = this._resolvePaddleData(data.paddles);
    this.players = this._resolvePlayerData(data.players);
    this._draw();
  }

  Game.prototype._resolvePaddleData = function(paddleData) {
    var paddles = [], paddle;

    // TODO: Put this in a paddle.deserialize method
    for(var i = 0; i < paddleData.length; i++) {
      paddle = new Pong.Paddle(this.canvas);
      paddle.y = paddleData[i].y;
      paddle.color = paddleData[i].color;

      paddles.push(paddle);
    }

    return paddles;
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
    }
  }

  return Game;
})();