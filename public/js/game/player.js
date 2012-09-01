window.Pong.Player = (function() {
  var Player = function(playerId) {
    this.playerId = playerId
    this.score = 0
    this.color = "FFFFFF"
  }

  return Player
})
