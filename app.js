var express = require("express")
  , less = require("less")
  , fs = require("fs")
  , io = require("socket.io")
  , World = require("./lib/world.js")

var app = express(),
    server = require("http").createServer(app),
    io = io.listen(server);

var world = new World(io)

app.configure(function() {
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/public'));
});

app.get("/", function(req, res) {
  res.render("home", { games: world.games.map(function(game){ return game.gameName }) })
});

app.get("/game", function(req, res) {
  res.render("index");
  gameName = req.query["gameName"]
});

app.get(/\/css\/(\w+).css/, function(req, res) {
  fs.readFile("public/css/" + req.params[0] + ".less", function(e, data) {
    less.render(data.toString("utf8"), function(e, css) {
      res.write(css);
      res.end();
    });
  });
});

var port = process.env.PORT || 3000;
server.listen(port);
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
