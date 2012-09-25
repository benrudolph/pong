window.Pong.Powerup = (function() {

  var Powerup = function(canvas) {
    this.canvas = canvas
    this.y = 0
    this.x = 0
    this.width = 0
    this.height = 0
    this.color = "FF00FF"
    this.image = null
  }

  Powerup.TYPE = {
    ELONGATE: 1
  }

  Powerup.prototype.draw = function() {
    var context = this.canvas.getContext("2d")
    if (this.image && this.image.loaded) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height)
    } else {
      context.fillStyle = this.color
      context.strokeStyle = "FFFFFF"
      context.fillRect(this.x, this.y, this.width, this.height)
    }
  }

  return Powerup;
})()
