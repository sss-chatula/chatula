var chatulaView = {

  highlightChannels: function (channels) {
    for (var i = 0; i < channels.length; i++) {
      chatulaView.highlightChannel(channels[i].id);
    }
  },

  highlightChannel: function (channelId) {
    $("#channel-item-id-" + channelId).addClass("chatula-channel-item-highlighted");
  },

  unhighlightChannel: function (channelId) {
    $("#channel-item-id-" + channelId).removeClass("chatula-channel-item-highlighted");
  },

  markAsSelected: function (channelId) {
    $("#channel-item-id-" + channelId).addClass("chatula-channel-item-selected");
  },

  unselectChannel: function () {
    $(".chatula-channel-item").each(function () {
      $(this).removeClass("chatula-channel-item-selected");
    });
  },

  clearChannelsList: function () {
    $("#channels").empty();
  },

  appendChannelToList: function (channel) {
    $("#channels").append(chatulaView.createChannelDOMElement(channel));
  },

  isChannelOnList: function (channelId) {
    return $("#channel-item-id-" + channelId).length !== 0;
  },

  minimize: function (e) {
    e = e || window.event;
    if (e) {
      var target = e.target || e.srcElement;
      e.stopPropagation();
    }
    $('#minimizeButton').addClass("invisible");
    $('#chatulaIFrameContainer', window.parent.document).height("36px");
    $('#chatulaIFrameContainer', window.parent.document).width("100px");
  },

  maximize: function () {
    $('#minimizeButton').removeClass("invisible");
    $('#chatulaIFrameContainer', window.parent.document).width("500px");
    $('#chatulaIFrameContainer', window.parent.document).height("465px");
  },

  createChannelDOMElement: function (newChannel) {
    var channelDIV = document.createElement("div");
    $(channelDIV).html("# " + newChannel.title);
    $(channelDIV).addClass("chatula-channel-item");
    channelDIV.id = "channel-item-id-" + newChannel.id;
    channelDIV.channel = newChannel;
    $(channelDIV).click(function (event) {
      var channel = event.target.channel;
      chatulaController.selectChannel(channel.id, 0, 50, false);
    });
    return channelDIV;
  },

  focusOnMessageInput: function () {
    $('#messageInput').focus();
  },

  showError: function (message) {
    var snackbar = $('#snackbar');
    snackbar.text(message);
    snackbar.addClass('show');
    setTimeout(function () {
      snackbar.removeClass('show');
      snackbar.text('');
    }, 3000);
  },

  sendDesktopNotification: function (message) {
    if (!chatulaValidation.canSendNotification() || document.hasFocus() || parent.document.hasFocus()) {
      return;
    }
    var chatMessage = JSON.parse(message.body);
    var notification = new Notification('New message from: ' + chatMessage.user.username,
      {
        tag: 'Chat',
        body: chatMessage.content,
        icon: 'https://cula.io/app/assets/img/dashboard/ninja.png',
        iconUrl: 'https://cula.io/app/assets/img/dashboard/ninja.png',
        isClickable: true
      }
    );
    notification.onclick = function () {
      parent.focus();
    };
  },

  toggleUsers: function () {
    $('#users-container-info').toggle(500);
    $('#users').toggle(500);
    $('#display_advance').toggleClass("fa-caret-down fa-caret-right");
  },

  resetView: function () {
    $("#channels").empty();
    $("#users").empty();
    $("#conversation").empty();
  },

  //FIXME separate logic
  appendMessage: function (message, extraLogic) {
    $("#conversation").append(chatulaView.formatMsg(message));
    if (extraLogic) {
      if (chatulaModel.user.username !== message.user.username) {
        if (!document.hasFocus() && !parent.document.hasFocus()) {
          chatulaTools.playSound();
        }
      }
      chatulaModel.lastMessageFrom = message.user.username;
      chatulaService.updateLastUserActionOnChannel(chatulaModel.selectedChannelId);
    }
  },

  formatMsg: function (message) {
    var time = message.timestamp.split(" ")[1];
    if (chatulaModel.lastMessageFrom !== message.user.username) {
      chatulaModel.lastCssClass = chatulaModel.lastCssClass == 'chatula-message-light' ? 'chatula-message-dark' : 'chatula-message-light';
      return "<div class='" + chatulaModel.lastCssClass + "'><div class='chatula-message-title'><span class='chatula-message-title-username'>" + message.user.username + "</span>&nbsp;&nbsp;<span class='chatula-message-title-timestamp' title='" + message.timestamp + "'>" + time + "</span></div><div class='chatula-message-content'> " + message.content + "</div></div>"
    } else {
      return "<div class='" + chatulaModel.lastCssClass + "'><div class='chatula-message-content'> " + message.content + "</div></div>"
    }
  },

  clearMessageInput: function () {
    $("#messageInput").val('');
  },

  clearMessages: function () {
    $("#conversation").empty();
  },

  getMessageInputValue: function () {
    return $("#messageInput").val();
  },

  scrollToMessageBoxBottom: function () {
    var elem = document.getElementById('conversation');
    elem.scrollTop = elem.scrollHeight;
  },
  alertError: function (error) {
    console.error('Chat error:', error);
  }

};
