$(document).ready(function() {

  $("#create").click(function() {
    var popup = renderPopup()
    $("body").append(popup)
    $("#popup").css({ "left": ($(document).outerWidth() / 2) - ($("#popup").outerWidth() / 2),
                      "display": "block" })
  })

  $("#join").click(function() {
    var game = $(".selected").first()
    if (game.length === 0)
      return

    window.location.href = "http://" + window.location.host + "/game?gameName=" + game.text()
  })

  $(".game").click(function() {
    if ($(this).hasClass(".selected"))
      return

    $(".selected").removeClass("selected")
    $(this).addClass("selected")
  })

  var renderPopup = function() {
    html = '<div id="popup">' +
    '<form action="/game" method="GET">' +
    '<div class="input"><label for="gameName">Name:&nbsp;</label>' +
    '<input type="text" name="gameName" id="gameName" /></div>' +
    '<div class="input"><input type="radio" name="players" value="2" checked="checked">2</input></div>' +
    '<div class="input"><input type="submit" value="Let\'s do it!" /></div>' +
    '</form>' +
    '</div>'
    return html
  }
})

