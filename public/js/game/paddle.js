window.Pong.Paddle = (function() {

  var Paddle = function(canvas) {
    this.canvas = canvas
    this.y = 250
    this.color = "FFFFFF"
    this.width = 0
    this.height = 0
    this.x = 0
    this.paddle_body = null
    this.paddle_ends = null
  }

  Paddle.DIRECTION = { UP: 0, DOWN: 1 }

  Paddle.SIDE = { LEFT: 0, RIGHT: 1 }

  Paddle.BODY_IMG_HEIGHT = 10

  Paddle.BODY_IMG_WIDTH = 20

  Paddle.END_IMG_HEIGHT = 10

  Paddle.END_IMG_WIDTH = 20

  Paddle.prototype.draw = function() {
    var context = this.canvas.getContext("2d")
    if (this.paddle_body && this.paddle_body.loaded && this.paddle_ends && this.paddle_ends.loaded) {
      var paddleEndStartX, paddleEndStartY = 0;
      var paddleBodyStartX, paddleBodyStartY = 0;
      switch (this.x) {
        case 0:
          paddleEndStartX = 40;
          paddleBodyStartX = 40;
          break
        case 780:
          paddleEndStartX = 0;
          paddleBodyStartX = 0;
          break
      }
      context.drawImage(this.paddle_ends, paddleEndStartX, paddleEndStartY, 40, 20, this.x, this.y,
          Paddle.END_IMG_WIDTH, Paddle.END_IMG_HEIGHT)
      context.drawImage(this.paddle_ends, paddleEndStartX, paddleEndStartY + (2 * Paddle.END_IMG_HEIGHT), 40,
          20, this.x, this.y + this.height - Paddle.END_IMG_HEIGHT, Paddle.END_IMG_WIDTH,
          Paddle.END_IMG_HEIGHT)
      this.drawBody(context, this.height - (2 * Paddle.END_IMG_HEIGHT), paddleBodyStartX, paddleBodyStartY)
    } else {
      context.fillStyle = this.color;
      context.strokeStyle = this.color;
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  Paddle.prototype.drawBody = function(context, bodyLength, startx, starty) {
    var remainingLength = bodyLength
    while (remainingLength > 0) {
      context.drawImage(this.paddle_body, startx, starty, 40, 20, this.x,
          this.y + this.height - remainingLength - Paddle.END_IMG_HEIGHT,
          Paddle.BODY_IMG_WIDTH, Paddle.BODY_IMG_HEIGHT)
      remainingLength -= Paddle.BODY_IMG_HEIGHT
    }
  }

  return Paddle;
})()
