$(function () {
  $("form").on("submit", function (e) {
    e.preventDefault();
  });
  $("#send").click(function () {
    performMessageSending();
  });
  $('#messageInput').keypress(function (e) {
    if (e.which == 13) {
      performMessageSending();
      return false;
    }
  });

  setInterval(function () {
    refreshJwtIfAboutToExpire();
  }, 10000);

  askForNotificationPermission();

});


function refreshJwtIfAboutToExpire() {
  var jwt = window.localStorage.getItem('jwt');
  if (jwt != null) {

    var decoded = decodeJWT(jwt);
    if (isTokenAboutToExpire(decoded.exp)) {
      // console.log(' will refresh ', jwt);
      var chatulaService = new ChatulaService(jwt);
      chatulaService.refreshToken(jwt);
    }

  }
  // console.log('deck: ', decoded);
}

function isTokenAboutToExpire(expiration) {
  var now = new Date().getTime();
  return expiration * 1000 - 60000 < now;
}

function askForNotificationPermission() {
  if (!Notification) {
    console.log('notifications not supported');
    return;
  }
  Notification.requestPermission().then(function (result) {
    console.log(result);
  });


}
