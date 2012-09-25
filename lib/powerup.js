module.exports = (function() {

  var Collideable = require("./collideable.js")

  var Powerup = function(grid) {
    this.grid = grid
    this.y = (Math.random() * (this.grid.height - Powerup.LENGTH)) + Powerup.LENGTH
    this.x = (Math.random() * (this.grid.width - (4 * Powerup.LENGTH))) + (2 * Powerup.LENGTH)
    this.type = this.chooseType()
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
    ELONGATE: 0,
    SHORTEN: 1,
    SPEED: 2
  }

  Powerup.prototype = new Collideable(0, 0, Powerup.LENGTH, Powerup.LENGTH)

  Powerup.prototype.chooseType = function() {
    var num = Math.floor(Math.random() * 3)
    num = 2
    switch(num) {
      case 0:
        return Powerup.TYPE.ELONGATE
      case 1:
        return Powerup.TYPE.SHORTEN
      case 2:
        return Powerup.TYPE.SPEED
    }

  }

  Powerup.prototype.onCollision = function(ball) {
    console.log("Powerup Collision")
    if (ball.lastHitPaddle && ball.lastHitPaddle.activePowerup)
      ball.lastHitPaddle.activePowerup.deactivate()
    switch (this.type) {
      case Powerup.TYPE.ELONGATE:
        if (ball.lastHitPaddle && this.state === Powerup.STATE.ON_MAP) {
          this.paddle = ball.lastHitPaddle
          this.paddle.height = 2 * this.paddle.height
          this.state = Powerup.STATE.ACTIVE
          this.paddle.activePowerup = this
        }
        break
      case Powerup.TYPE.SHORTEN:
        if (ball.lastHitPaddle && this.state === Powerup.STATE.ON_MAP) {
          this.paddle = ball.lastHitPaddle
          this.paddle.height = this.paddle.height / 2
          this.state = Powerup.STATE.ACTIVE
          this.paddle.activePowerup = this
        }
        break
      case Powerup.TYPE.SPEED:
        if (ball.lastHitPaddle && this.state === Powerup.STATE.ON_MAP) {
          this.paddle = ball.lastHitPaddle
          this.paddle.velocity = this.paddle.velocity * 2
          this.state = Powerup.STATE.ACTIVE
          this.paddle.activePowerup = this
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
          this.paddle.height = this.paddle.height / 2
        }
        break
      case Powerup.TYPE.SHORTEN:
       if (this.state === Powerup.STATE.ACTIVE) {
         this.state = Powerup.STATE.DEAD
         this.paddle.height = this.paddle.height * 2
       }
       break
      case Powerup.TYPE.SPEED:
       if (this.state === Powerup.STATE.ACTIVE) {
         this.state = Powerup.STATE.DEAD
         this.paddle.velocity = this.paddle.velocity / 2
       }
       break

    }

  }

  Powerup.prototype.getSource = function() {
    switch(this.type) {
      case Powerup.TYPE.ELONGATE:
        return "images/extend_powerup.png"
      case Powerup.TYPE.SHORTEN:
        return "images/shorten_powerup.png"
      case Powerup.TYPE.SPEED:
        return "images/speed_powerup.png"
    }
  }

  Powerup.prototype.serialize = function() {
    var data = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      type: this.type,
      source: this.getSource()
    }
    return data
  }

  return Powerup
})()
