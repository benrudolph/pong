module.exports = (function() {


  var Collideable = require("./collideable.js")

  var Paddle = function(player, grid, side) {
    this.player = player
    this.grid = grid
    this.side = side
    this.width = this.calculateStartWidth()
    this.height = this.calculateStartHeight()
    this.x = this.calculateStartX()
    this.y = this.calculateStartY()
    this.velocity = 14
    this.activePowerup = null
  };

  Paddle.START_WIDTH = 20

  Paddle.START_HEIGHT = 50

  Paddle.prototype = new Collideable(0, 0, Paddle.START_WIDTH, Paddle.START_HEIGHT)

  Paddle.DIRECTION = { LEFT: 0, RIGHT: 1, UP: 2, DOWN: 3 };

  Paddle.SIDE = { LEFT: 0, RIGHT: 1, UP: 2, DOWN: 3 };

  Paddle.prototype.calculateStartHeight = function(side) {
    switch (this.side) {
      case Paddle.SIDE.LEFT:
      case Paddle.SIDE.RIGHT:
        return Paddle.START_HEIGHT
      case Paddle.SIDE.UP:
      case Paddle.SIDE.DOWN:
        return Paddle.START_WIDTH
    }
    return 0
  }

  Paddle.prototype.calculateStartWidth = function() {
    switch (this.side) {
      case Paddle.SIDE.LEFT:
      case Paddle.SIDE.RIGHT:
        return Paddle.START_WIDTH
      case Paddle.SIDE.UP:
      case Paddle.SIDE.DOWN:
        return Paddle.START_HEIGHT
    }
    return 0
  }

  Paddle.prototype.calculateStartX = function() {
    switch (this.side) {
      case Paddle.SIDE.LEFT:
        return 0
      case Paddle.SIDE.RIGHT:
        return this.grid.width - Paddle.START_WIDTH
      case Paddle.SIDE.UP:
      case Paddle.SIDE.DOWN:
        return this.grid.width / 2 - this.width / 2
    }
    return 0
  }

  Paddle.prototype.calculateStartY = function() {
    switch (this.side) {
      case Paddle.SIDE.LEFT:
      case Paddle.SIDE.RIGHT:
        return this.grid.height / 2 - this.height / 2
      case Paddle.SIDE.UP:
        return 0
      case Paddle.SIDE.DOWN:
        return this.grid.height - Paddle.START_WIDTH
    }
    return 0
  }

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
        if (this.side !== Paddle.SIDE.LEFT && this.side !== Paddle.SIDE.RIGHT)
          return
        if (this.y - this.velocity < 0)
          this.y = 0
        else
          this.y -= this.velocity
        break
      case Paddle.DIRECTION.DOWN:
        if (this.side !== Paddle.SIDE.LEFT && this.side !== Paddle.SIDE.RIGHT)
          return
        if (this.y + this.velocity > this.grid.height - this.height)
          this.y = this.grid.height - this.height
        else
          this.y += this.velocity
        break
      case Paddle.DIRECTION.RIGHT:
        if (this.side !== Paddle.SIDE.UP && this.side !== Paddle.SIDE.DOWN)
          return
        if (this.x + this.velocity > this.grid.width - this.width)
          this.x = this.grid.width - this.width
        else
          this.x += this.velocity
        break
      case Paddle.DIRECTION.LEFT:
        console.log("DIRECTION LEFT")
        if (this.side !== Paddle.SIDE.UP && this.side !== Paddle.SIDE.DOWN)
          return
        if (this.x - this.velocity < 0)
          this.x = 0
        else
          this.x -= this.velocity
        break

    }
  }

  Paddle.prototype.serialize = function() {
    var data = {
      height: this.height,
      width: this.width,
      y: this.y,
      velocity: this.velocity,
      side: this.side,
      x: this.x,
      color: "000000"
    }
    return data
  }

  return Paddle
})()
