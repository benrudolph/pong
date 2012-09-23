var assert = require("assert")
var PowerupArray = require("../lib/powerup_array.js")
var Powerup = require("../lib/powerup.js")

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
      assert.equal(1, activePowerups.length);
      assert.equal(activePowerups[0].state, Powerup.STATE.ACTIVE);
    })
  })

  describe("#cleanDead()", function() {
    it("should clean all dead powerups", function() {
      powerupArray.cleanDead()

      assert.equal(2, powerupArray.length)
      for (var i = 0; i < powerupArray.length; i++) {
        assert.notEqual(Powerup.STATE.DEAD, powerupArray[i].state)
      }
    })

  })
})
