var express = require("express")
  , less = require("less")
  , fs = require("fs")
  , io = require("socket.io")
  , Game = require("./lib/game")

var app = express(),
    server = require("http").createServer(app),
    io = io.listen(server);

var game = new Game(io);

app.configure(function() {
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/public'));
});

app.get("/", function(req, res) {
  res.render("home")
});

app.get("/game", function(req, res) {
  res.render("index");
});

/*app.get(/\/css\/(\w+).css/, function(req, res) {
  fs.readFile("public/css/" + req.params[0] + ".less", function(e, data) {
    less.render(data.toString("utf8"), function(e, css) {
      res.write(css);
      res.end();
    });
  });
});*/

var port = process.env.PORT || 3000;
server.listen(port);
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
