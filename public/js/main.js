window.Pong = {};
require([
    "/js/lib/jquery.min.js",
    "/js/game/game.js",
    "/js/game/player.js",
    "/js/game/ball.js",
    "/js/game/paddle.js",
    ], function() {
  var game = new Pong.Game();
  //game.run();
});
