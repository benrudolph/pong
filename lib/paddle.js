module.exports = (function(){
  
  var Paddle = function(player, grid) {
    this.player = player
    this.grid = grid
    this.height = 50
    this.width = 20
    this.y = this.grid.width / 2 - this.height / 2
    this.velocity = 8
  };

  Paddle.DIRECTION = { UP: 0, DOWN: 1 };

  Paddle.prototype.move = function(direction) {
    switch(direction) {
      case Paddle.DIRECTION.UP:
        if (this.y - this.velocity < 0)
          this.y = 0
        else
          this.y -= this.velocity
        break
      case Paddle.DIRECTION.DOWN:
        if (this.y + this.velocity > this.grid.height - this.height)
          this.y = this.grid.height - this.height
        else
          this.y += this.velocity
        break
    }
  }

  Paddle.prototype.serialize = function() {
    var data = { 
      height: this.height,
      width: this.width,
      y: this.y,
      velocity: this.velocity
    }
    return data
  }

  return Paddle
})()
