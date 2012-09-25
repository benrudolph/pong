module.exports = (function() {


  var Collideable = require("./collideable.js")

  var Paddle = function(player, grid, side) {
    this.player = player
    this.grid = grid
    this.y = this.grid.height / 2 - this.height / 2
    this.side = side
    this.x = this.side == Paddle.SIDE.LEFT ? 0 : this.grid.width - Paddle.START_WIDTH
    this.velocity = 8
    this.activePowerup = null
  };

  Paddle.START_WIDTH = 20

  Paddle.START_HEIGHT = 50

  Paddle.prototype = new Collideable(0, 0, Paddle.START_WIDTH, Paddle.START_HEIGHT)

  Paddle.DIRECTION = { UP: 0, DOWN: 1 };

  Paddle.SIDE = { LEFT: 0, RIGHT: 1 };

  Paddle.prototype.onCollision = function(ball) {
    switch (this.side) {
      case Paddle.SIDE.LEFT:
        ball.x_velocity = Math.abs(ball.x_velocity)
        break
      case Paddle.SIDE.RIGHT:
        ball.x_velocity = -Math.abs(ball.x_velocity)
        break
      default:
        console.log("Invalid Side")
        break
    }
    if (ball.y < this.y - (this.height / 2))
      ball.y_velocity = Math.abs(ball.y_velocity)
    else
      ball.y_velocity = -Math.abs(ball.y_velocity)
    ball.lastHitPaddle = this
  }

  Paddle.prototype.move = function(direction) {
    console.log(this.y)
    switch (direction) {
      case Paddle.DIRECTION.UP:
        if (this.y - this.velocity < 0)
          this.y = 0
        else
          this.y -= this.velocity
        break
      case Paddle.DIRECTION.DOWN:
        if (this.y + this.velocity > this.grid.height - this.height)
          this.y = this.grid.height - this.height
        else
          this.y += this.velocity
        break
    }
  }

  Paddle.prototype.serialize = function() {
    var data = {
      height: this.height,
      width: this.width,
      y: this.y,
      velocity: this.velocity,
      x: this.x,
      color: "000000"
    }
    return data
  }

  return Paddle
})()
