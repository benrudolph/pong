module.exports = (function() {

  var Collideable = require("./collideable.js")

  var Powerup = function(grid) {
    this.grid = grid
    this.y = (Math.random() * (this.grid.height - Powerup.LENGTH)) + Powerup.LENGTH
    this.x = (Math.random() * (this.grid.width - (4 * Powerup.LENGTH))) + (2 * Powerup.LENGTH)
    this.type = Powerup.TYPE.ELONGATE
    this.state = Powerup.STATE.ON_MAP //an active powerup is one that is currently being enacted on a paddle
    this.duration = 10 //seconds
    this.paddle = null
  }

  Powerup.LENGTH = 25

  Powerup.STATE = {
    ON_MAP: 0,
    ACTIVE: 1,
    DEAD: 2
  }

  Powerup.TYPE = {
    ELONGATE: 0
  }

  Powerup.prototype = new Collideable(0, 0, Powerup.LENGTH, Powerup.LENGTH)

  Powerup.prototype.onCollision = function(ball) {
    console.log("Powerup Collision")
    switch (this.type) {
      case Powerup.TYPE.ELONGATE:
        if (ball.lastHitPaddle && this.state === Powerup.STATE.ON_MAP) {
          this.paddle = ball.lastHitPaddle
          this.paddle.height = 2 * this.paddle.height
          this.state = Powerup.STATE.ACTIVE
          setTimeout(function(powerup) { powerup.deactivate() }, 100000 / this.duration, this)
        }
        break
    }
  }

  Powerup.prototype.deactivate = function() {
    console.log("Deactivating Powerup")
    switch (this.type) {
      case Powerup.TYPE.ELONGATE:
        if (this.state === Powerup.STATE.ACTIVE) {
          this.state = Powerup.STATE.DEAD
          this.paddle.height = this.paddle.height/2
        }
        break
    }

  }

  Powerup.prototype.serialize = function() {
    var data = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      type: this.type
    }
    return data
  }

  return Powerup
})()
