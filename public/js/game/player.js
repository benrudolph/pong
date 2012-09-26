window.Pong.Player = (function() {

  var Player = function(playerId) {
    this.playerId = playerId
    this.life = 5
    this.color = "FFFFFF"
    $("#scoreboard").append("<div id=\"" + this.playerId + "\"></div>")
    this.scoreCard = $("#" + this.playerId)
  }

  Player.prototype.draw = function() {
    $(this.scoreCard).text(this.playerId + ": " + this.life)
  }

  return Player
})()
