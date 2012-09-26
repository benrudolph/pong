module.exports = (function() {

  var Ball = function(grid) {
    this.radius = 5
    this.grid = grid
    this.x = this.grid.width / 2 - this.radius / 2
    this.y = this.grid.height / 2 - this.radius / 2
    this.x_velocity = ((Math.random() * 5) + 3)
    if (Math.random() - 0.5 < 0)
      this.x_velocity = -this.x_velocity
    this.y_velocity = ((Math.random() * 5) + 3)
    if (Math.random() - 0.5 < 0)
      this.y_velocity = -this.y_velocity
    this.lastHitPaddle = null
  }
  /* Moves ball x_velcoity number of pixels and detects ball collisions with other objects called collideables
   * . This will return false if ball goes out of bounds */
  Ball.prototype.move = function(collideables, openSides) {
    this.detectCollisions(collideables)

    if (this.x + this.radius + this.x_velocity > this.grid.width) {
      this.x = this.grid.width - this.radius
      this.x_velocity = -this.x_velocity
      if (!openSides["1"])
        return false
    }
    else if (this.x - this.radius + this.x_velocity < 0) {
      this.x = 0 + this.radius
      this.x_velocity = -this.x_velocity
      if (!openSides["0"])
        return false
    }
    else {
      this.x += this.x_velocity
    }

    if (this.y + this.radius + this.y_velocity > this.grid.height) {
      this.y = this.grid.height - this.radius
      this.y_velocity = -this.y_velocity
      if (!openSides["3"])
        return false
    }
    else if (this.y - this.radius + this.y_velocity < 0) {
      this.y = 0 + this.radius
      this.y_velocity = -this.y_velocity
      if (!openSides["2"])
        return false
    }
    else {
      this.y += this.y_velocity
    }
    return true
  }

  Ball.prototype.detectCollisions = function(collideables) {
    for (index in collideables) {
      this.detectCollision(collideables[index])
    }
  }

  Ball.prototype.detectCollision = function(collideable) {
    if (collideable === null) {
      console.log("Collision Failure")
      return
    }

    var collided = false

    if (collideable.x + collideable.width >= this.x - this.radius &&
        collideable.x <= this.x - this.radius &&
        collideable.y <= this.y - this.radius &&
        collideable.y + collideable.height >= this.y - this.radius) {
      collided = true
    }
    else if (collideable.x + collideable.width >= this.x + this.radius &&
        collideable.x <= this.x + this.radius &&
        collideable.y <= this.y + this.radius &&
        collideable.y + collideable.height >= this.y + this.radius) {
      collided = true
    }
    else if (collideable.x + collideable.width >= this.x + this.radius &&
        collideable.x <= this.x + this.radius &&
        collideable.y <= this.y - this.radius &&
        collideable.y + collideable.height >= this.y - this.radius) {
      collided = true
    }
    else if (collideable.x + collideable.width >= this.x - this.radius &&
        collideable.x <= this.x - this.radius &&
        collideable.y <= this.y + this.radius &&
        collideable.y + collideable.height >= this.y + this.radius) {
      collided = true
    }

    if (collided) {
      collideable.onCollision(this)
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
