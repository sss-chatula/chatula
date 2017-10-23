// var host = 'http://192.168.0.16:8080/chat/api/v1';
// var host = 'http://192.168.204.107:8080/chat/api/v1';
var host = 'https://cula.io/chat/api/v1';

// var host = 'http://localhost:8080/chat/api/v1';

function ChatulaService(authenticationToken) {
  var token = authenticationToken;
  var stompClient;

  this.getStompClient = function () {
    return stompClient;
  };

  this.connect = function (callback) {
    var socket = new SockJS(host + "/chat?token=" + token);
    stompClient = Stomp.over(socket);
    stompClient.debug = null;
    stompClient.connect({}, function (frame) {
      callback();
    });
  };

  this.disconnect = function (callback) {
    if (stompClient !== null) {
      stompClient.disconnect();
    }
    callback();
  };

  this.getChannelMessages = function (selectedChannelId, offset, limit, callback) {
    $.ajax({
      beforeSend: function (request) {
        request.setRequestHeader('Authorization', token);
      },
      type: 'GET',
      url: host + "/channels/" + selectedChannelId + "/messages?limit=" + limit + "&offset=" + offset,
      success: function (res) {
        callback(res);
      }
    });
  };

  this.sendMessage = function (channelId, message) {
    stompClient.send("/chat/channel/" + channelId + "/message", {}, JSON.stringify(message));
  };

  this.sendInvitationToUser = function (loggedUserId, invitedUserId) {
    stompClient.send("/chat/user/" + invitedUserId, {}, JSON.stringify(loggedUserId));
  };

  this.getChannel = function (channelId, callback) {
    $.ajax({
      beforeSend: function (request) {
        request.setRequestHeader('Authorization', token);
      },
      type: 'GET',
      url: host + '/channels/' + channelId,
      success: function (channel) {
        callback(channel);
      }
    });
  };

  this.getChannelList = function (callback) {
    $.ajax({
      beforeSend: function (request) {
        request.setRequestHeader('Authorization', token);
      },
      type: 'GET',
      url: host + '/users/me/channels',
      success: function (channels) {
        callback(channels);
      }
    });
  };

  this.getUserList = function (callback) {
    $.ajax({
      beforeSend: function (request) {
        request.setRequestHeader('Authorization', token);
      },
      type: 'GET',
      url: host + "/users",
      success: function (users) {
        callback(users);
      }
    });
  };

  this.createChannel = function (userIds, callback) {
    $.ajax({
      beforeSend: function (request) {
        request.setRequestHeader('Authorization', token);
      },
      type: 'POST',
      url: host + "/channels",
      data: JSON.stringify(userIds),
      contentType: "application/json",
      success: function (channelId) {
        callback(channelId);
      },
    });
  };

  this.refreshToken = function (jwt) {
    $.ajax({
      beforeSend: function (request) {
        request.setRequestHeader('Authorization', jwt);
      },
      type: 'POST',
      data: jwt,
      contentType: 'application/json',
      url: host + "/tokens/refresh",
      success: function (response) {
        window.localStorage.setItem('jwt', response);
      },
    });
  };

  this.updateLastUserActionOnChannel = function (channelId) {
    $.ajax({
      beforeSend: function (request) {
        request.setRequestHeader('Authorization', token);
      },
      type: 'PUT',
      data: {},
      contentType: 'application/json',
      url: host + "/users/me/channels/" + channelId + "/lastAction",
      success: function (response) {
        console.debug('Last action on channel timestamp logged!');
      },
    });
  };

  this.getMyChannelsWithUnreadMessages = function (callback) {
    $.ajax({
      beforeSend: function (request) {
        request.setRequestHeader('Authorization', token);
      },
      type: 'GET',
      url: host + "/users/me/channels/unread",
      success: function (channels) {
        callback(channels);
      }
    });
  }

}
