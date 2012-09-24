$(document).ready(function() {

  $("#create").click(function() {
    var popup = renderPopup()
    $("body").append(popup)
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
    '<label for="gameName" />' +
    '<input type="text" name="gameName" id="gameName" />' +
    '<input type="radio" name="players" value="2" checked="checked">2</input>' +
    '<input type="submit">Let\'s do it!</input>' +
    '</form>' +
    '</div>'
    return html
  }
})

