window.Pong.Paddle = (function() {

  var Paddle = function(canvas) {
    this.canvas = canvas
    this.y = 250
    this.color = "FFFFFF"
    this.width = 0
    this.height = 0
    this.x = 0
  }

  Paddle.DIRECTION = { UP: 0, DOWN: 1 }

  Paddle.SIDE = { LEFT: 0, RIGHT: 1 }

  Paddle.prototype.draw = function() {
    var context = this.canvas.getContext("2d")
    context.fillStyle = this.color;
    context.strokeStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  };

  return Paddle;
})()
