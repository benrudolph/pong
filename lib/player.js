module.exports = (function() {

  var Player = function(playerId) {
    this.playerId = playerId
    this.paddle = null
    this.life = 5
    this.color = Math.floor(Math.random()*16777215).toString(16); // TODO(dmac): This might need padding 0s.
  }

  Player.prototype.serialize = function() {
    return {
      playerId: this.playerId,
      life: this.life,
      color: this.color
    }
  }

  return Player;
})()
