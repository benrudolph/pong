window.Pong.Ball = (function() {

  var Ball = function(canvas) {
    this.x = 0
    this.y = 0
    this.radius = 0
    this.canvas = canvas
    this.image = null
  }

  Ball.prototype.draw = function() {
    var context = this.canvas.getContext("2d")
    if (this.image && this.image.loaded) {
      context.drawImage(this.image, this.x - this.radius, this.y - this.radius, 2 * this.radius,
          2 * this.radius)
    } else {
      context.fillStyle = "000000"
      context.beginPath()
      context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true)
      context.closePath()
      context.fill()
    }
  }

  return Ball
})()
