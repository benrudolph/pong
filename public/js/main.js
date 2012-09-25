window.Pong = {};
require([
    "/js/lib/jquery.min.js",
    "/js/game/game.js",
    "/js/game/player.js",
    "/js/game/ball.js",
    "/js/game/paddle.js",
    "/js/game/powerup.js",
    "/js/lib/image_library.js",
    ], function() {
  /*var images = new Array()
  var img = new Image()
  img.src = "images/extend_powerup.png"
  images.push()*/
  var imageLibrary = new ImageLibrary(["images/extend_powerup.png",
                                       "images/ball.png",
                                       "images/paddle_ends.png",
                                       "images/paddle_body.png"])
  imageLibrary.load()
  var game = new Pong.Game();
  game.imageLibrary = imageLibrary
});

