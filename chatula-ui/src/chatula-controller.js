var chatulaController = {

  chatulaService: null,

  init: function (param) {
    chatulaController.wireEvents();
    setInterval(function () {
      chatulaController.refreshJwtIfAboutToExpire();
    }, 10000);
    chatulaController.askForNotification();

  },

  postMessage: function (message, data) {
    if (message === 'GET_CHANNELS') {
      chatulaService.getChannelList(chatulaController.channelsRetrieved);
    } else if (message === 'GET_USERS') {
      chatulaService.getUserList(chatulaController.usersRetrieved);
    } else if (message === 'LOG_IN') {
      window.localStorage.setItem('jwt', data.token);
      chatulaModel.user = chatulaTools.decodeJWT(data.token);
      chatulaService = new ChatulaService(data.token);
      chatulaService.connect(chatulaController.addUserSubscriber);
      chatulaView.maximize();
    } else if (message === 'LOG_OUT') {
      chatulaService.disconnect(chatulaView.resetView);
      chatulaView.minimize();
    }
  },


  askForNotification: function () {
    if (!Notification) {
      console.log('notifications not supported');
      return;
    }
    Notification.requestPermission().then(function (result) {
      console.log(result);
    });
  },

  wireEvents: function () {
    // Wire up page events
    $("form").on("submit", function (e) {
      e.preventDefault();
    });
    $("#send").click(function () {
      chatulaController.performMessageSending();
    });
    $('#messageInput').keypress(function (e) {
      if (e.which === 13) {
        chatulaController.performMessageSending();
        return false;
      }
    });
  },

  // Reactive methods from page events
  // Callbacks, etc
  refreshJwtIfAboutToExpire: function () {
    var jwt = window.localStorage.getItem('jwt');
    if (jwt !== null) {
      var decoded = chatulaTools.decodeJWT(jwt);
      if (chatulaController.isTokenAboutToExpire(decoded.exp)) {
        // console.log(' will refresh ', jwt);
        chatulaService = new ChatulaService(jwt);
        chatulaService.refreshToken(jwt);
      }
    }
  },

  isTokenAboutToExpire: function (expiration) {
    var now = new Date().getTime();
    return expiration * 1000 - 60000 < now;
  },

  performMessageSending: function () {
    var content = chatulaView.getMessageInputValue();
    if (!chatulaValidation.shouldSendMessage(content, chatulaModel.selectedChannelId)) {
      return;
    }
    chatulaService.sendMessage(chatulaModel.selectedChannelId, chatulaModel.prepareMessage(content));
    console.log('should send direct message:' + chatulaModel.directMessage);
    if (chatulaModel.directMessage) {
      chatulaService.sendInvitationToUser(chatulaModel.user.userId, chatulaModel.selectedUserlId);
    }
    chatulaView.clearMessageInput();
  },

  selectChannel: function (channelId, offset, limit, direct) {
    chatulaView.unselectChannel();
    chatulaView.unhighlightChannel(channelId);
    chatulaModel.directMessage = direct;
    chatulaModel.selectedChannelId = channelId;
    chatulaModel.lastMessageFrom = '';
    chatulaView.markAsSelected(channelId);
    chatulaView.focusOnMessageInput();
    chatulaService.updateLastUserActionOnChannel(channelId);
    chatulaService.getChannelMessages(channelId, offset, limit, chatulaController.messagesRetrieved);
  },

  selectUser: function (userId) {
    chatulaView.unselectChannel();
    chatulaModel.selectedUserlId = userId;
    chatulaView.toggleUsers();
    chatulaService.createChannel([chatulaModel.user.userId, userId], chatulaController.channelCreated);
  },


  channelsRetrieved: function (channels) {
    chatulaView.clearChannelsList();
    for (var i = 0; i < channels.length; i++) {
      chatulaView.appendChannelToList(channels[i]);
      chatulaController.addSubscriberToChannel(channels[i].id);
    }
    chatulaService.getMyChannelsWithUnreadMessages(chatulaView.highlightChannels);
  },

  messagesRetrieved: function (msgs) {
    chatulaView.clearMessages();
    for (var i = 0; i < msgs.length; i++) {
      chatulaView.appendMessage(msgs[i], false);
    }
  },

  usersRetrieved: function (users) {
    $("#users").empty();
    for (var i = 0; i < users.length; i++) {
      var usersDIV = document.createElement("div");
      $(usersDIV).html(users[i].username);
      $(usersDIV).addClass("chatula-user-item");
      usersDIV.id = "user-item-id-" + users[i].id;
      usersDIV.user = users[i];
      $(usersDIV).click(function (event) {
        var user = event.target.user;
        chatulaController.selectUser(user.id);
      });
      $("#users").append(usersDIV);
    }
  },

  channelCreated: function (channelId) {
    if (chatulaView.isChannelOnList(channelId)) {
      chatulaService.getChannel(channelId, chatulaController.channelFetchedAndSelected);
    } else {
      chatulaController.selectChannel(channelId, 0, 50, false);
    }
  },

  channelFetched: function (channel) {
    chatulaView.appendChannelToList(channel);
    chatulaController.addSubscriberToChannel(channel.id);
  },

  channelFetchedAndSelected: function (channel) {
    chatulaController.channelFetched(channel);
    chatulaController.selectChannel(channel.id, 0, 50, true);
  },

  channelFetchedAndHighlighted: function (channel) {
    chatulaController.channelFetched(channel);
    chatulaView.highlightChannel(channel.id);
    chatulaTools.playSound();
  },

  addSubscriberToChannel: function (channelId) {
    chatulaService.getStompClient().subscribe("/channel/" + channelId, function (message) {
      var destination = message.headers.destination;
      var destinationChannelId = Number(destination.substr(destination.lastIndexOf('/') + 1));
      if (chatulaModel.selectedChannelId === destinationChannelId) {
        var messageContent = JSON.parse(message.body);
        chatulaView.appendMessage(messageContent);
      } else {
        chatulaView.highlightChannel(destinationChannelId);
        chatulaTools.playSound();
      }
      chatulaView.sendDesktopNotification(message);
      chatulaView.scrollToMessageBoxBottom();
    }, {id: 'channel=' + channelId});

    chatulaService.getStompClient().subscribe("/channel/" + channelId + "/errors", function (error) {
      chatulaView.alertError(error.body);
    }, {id: 'error=' + channelId});
  },

  addUserSubscriber: function () {
    chatulaService.getStompClient().subscribe("/direct/" + chatulaModel.user.userId, function (message) {
      var inviterUserId = message.body;
      chatulaService.createChannel([chatulaModel.user.userId, inviterUserId], function (channelId) {
        if (!chatulaView.isChannelOnList()) {
          chatulaService.getChannel(channelId, chatulaController.channelFetchedAndHighlighted);
        } else {
          chatulaView.highlightChannel(channelId);
          chatulaTools.playSound();
        }
      });
    });
  }
};
