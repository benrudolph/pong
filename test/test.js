var assert = require("assert")
var should = require("should")
var PowerupArray = require("../lib/powerup_array.js")
var Powerup = require("../lib/powerup.js")
var Ball = require("../lib/ball.js")
var Player = require("../lib/player.js")
var Paddle = require("../lib/paddle.js")

describe("PowerupArray", function() {

  var grid = { width: 500, height: 500 }
  var powerupArray = new PowerupArray()
  var powerup1 = new Powerup(grid)
  var powerup2 = new Powerup(grid)
  var powerup3 = new Powerup(grid)
  var powerup4 = new Powerup(grid)

  powerup1.state = Powerup.STATE.ACTIVE
  powerup2.state = Powerup.STATE.DEAD
  powerup4.state = Powerup.STATE.DEAD

  powerupArray.push(powerup1, powerup2, powerup3)

  describe("#getPowerupsOfCertainState()", function() {
    it("should return all active powerups", function() {
      var activePowerups = powerupArray.getPowerupsOfCertainState(Powerup.STATE.ACTIVE)
      should.equal(1, activePowerups.length);
      should.equal(activePowerups[0].state, Powerup.STATE.ACTIVE);
    })
  })

  describe("#cleanDead()", function() {
    it("should clean all dead powerups", function() {
      powerupArray.cleanDead()

      should.equal(2, powerupArray.length)
      for (var i = 0; i < powerupArray.length; i++) {
        should.notEqual(Powerup.STATE.DEAD, powerupArray[i].state)
      }
    })

  })
})

describe("Ball", function() {
  var grid = { width: 500, height: 500 }
  var ball = new Ball(grid)

  ball.x = 10
  ball.y = 10
  ball.x_velocity = 5
  ball.y_velocity = 0

  describe("#move", function() {
    it("should move ball", function() {
      ball.move()
      should.equal(ball.x, 15)
      should.equal(ball.y, 10)
    })
  })
})

describe("Paddle", function() {
  var grid = { width: 500, height: 500 }
  var player = new Player(1)
  var paddle = new Paddle(player, grid, Paddle.SIDE.UP)

  describe("#calculatePertubation", function() {
    it("should calculate how much to offset velocity by on hit", function() {
      var pert = paddle.calculatePertubation(10, 15, 40)
      should.equal(1.25, pert)
      pert = paddle.calculatePertubation(10, 5, 40)
      should.equal(-1.25, pert)
    })
  })
})
