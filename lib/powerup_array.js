module.exports = (function() {

  var PowerupArray = function() {}

  PowerupArray.prototype = new Array()

  PowerupArray.prototype.getPowerupsOfCertainState = function(state) {
    var powerups = []
    for (var index in this) {
      if (this[index].state === state)
        powerups.push(this[index])
    }
    return powerups
  }

  PowerupArray.prototype.cleanDead = function() {
    var length = this.length
    for (var index = length - 1; index >= 0; index--) {
      if (this[index].state === 2)
        this.splice(index, 1)
    }
  }

  return PowerupArray
})()
