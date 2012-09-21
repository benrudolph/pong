module.exports = (function() {

  var Ball = function(grid) {
    this.radius = 10
    this.grid = grid
    this.x = this.grid.width / 2 - this.radius / 2
    this.y = this.grid.height / 2 - this.radius / 2
    this.x_velocity = 10
    this.y_velocity = 6
  }

  Ball.prototype.move = function(collideables) {
    this.detectCollisions(collideables)

    if (this.x + this.radius + this.x_velocity > this.grid.width) {
      this.x = this.grid.width - this.radius
      this.x_velocity = -this.x_velocity
    }
    else if (this.x - this.radius + this.x_velocity < 0) {
      this.x = 0 + this.radius
      this.x_velocity = -this.x_velocity
    }
    else {
      this.x += this.x_velocity
    }

    if (this.y + this.radius + this.y_velocity > this.grid.height) {
      this.y = this.grid.height - this.radius
      this.y_velocity = -this.y_velocity
    }
    else if (this.y - this.radius + this.y_velocity < 0) {
      this.y = 0 + this.radius
      this.y_velocity = -this.y_velocity
    }
    else {
      this.y += this.y_velocity
    }
  }

  Ball.prototype.detectCollisions = function(collideables) {
    for (index in collideables) {
      this.detectCollision(collideables[index])
    }
  }

  Ball.prototype.detectCollision = function(collideable) {
    if (collideable.x === undefined || collideable.y === undefined) {
      console.log("FAIL")
      console.log(collideable.x)
      console.log(collideable.y)
      return
    }

    console.log("X:" + collideable.x)
    console.log("BALLX:" + this.x)

    if (collideable.x + collideable.width >= this.x - this.radius &&
        collideable.x < this.x &&
        collideable.y < this.y &&
        collideable.y + collideable.height > this.y) {
      this.x_velocity = -this.x_velocity
      collideable.onCollision()
      return true
    }
    else if (collideable.x <= this.x + this.radius &&
        collideable.x + collideable.width >= this.x + this.radius &&
        collideable.y < this.y &&
        collideable.y + collideable.height > this.y) {
      this.x_velocity = -this.x_velocity
      collideable.onCollision()
      return true
    }
  }

  Ball.prototype.serialize = function() {
    var data = {
      x: this.x,
      y: this.y,
      radius: this.radius
    }
    return data
  }
  return Ball
})()
