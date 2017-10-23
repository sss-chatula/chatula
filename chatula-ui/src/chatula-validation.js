var chatulaValidation = {
  shouldSendMessage: function (content, selectedChannelId) {
    if (selectedChannelId == null) {
      chatulaView.showError('You need to choose a channel');
      return false;
    }
    if (content == null || content.length < 1 || content.length > 2048) {
      chatulaView.showError('Message must be between 1 and 2048 characters long');
      return false;
    }
    return true;
  },

  canSendNotification: function () {
    if (!("Notification" in window)) {
      alert("This browser does not support system notifications");
      return false;
    }
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      return true;
    }

    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if (permission === "granted") {
          return true;
        }
      });
    }
    return false;
  }
};
