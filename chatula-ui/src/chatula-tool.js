var chatulaTools = {
  decodeJWT: function (jwt) {
    var base64Url = jwt.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    var decodedToken = JSON.parse(window.atob(base64));
    return {
      username: decodedToken.sub,
      userId: decodedToken.userId,
      exp: decodedToken.exp
    }
  },

  playSound: function playSound() {
    var audio = new Audio('/chatula/message.mp3');
    audio.play();
  }
};


