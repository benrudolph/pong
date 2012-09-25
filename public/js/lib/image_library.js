window.ImageLibrary = (function() {
  var ImageLibrary = function(sources) {
    this.sources = sources
    this.images = []
    this.loaded = false
  }

  ImageLibrary.prototype.getImage = function(name) {
    var index = this.sources.indexOf(name)
    return this.images[index]
  }

  ImageLibrary.prototype.load = function() {
    var img;
    for (var i = 0; i < this.sources.length; i++) {
      img = new Image()
      img.src = this.sources[i]
      img.loaded = false
      img.onload = function() {
        this.loaded = true
      }
      this.images.push(img)
    }
  }
  return ImageLibrary
})()
