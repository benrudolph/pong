module.exports = (function(){

  var Collideable = function(x, y, width, height) {
    this.x = x || 0
    this.y = y || 0
    this.width = width
    this.height = height
  }

  Collideable.prototype.onCollision = function() {
    console.log("Boom!")
  }

  return Collideable

})()
