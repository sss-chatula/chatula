// var chatulaService;
// var user;
// var lastMessageFrom = '';
// var selectedChannelId;
// var selectedUserlId;
// var directMessage;
// var lastClass;
//
// function postMessage(message, data) {
//   if (message === 'GET_CHANNELS') {
//     chatulaService.getChannelList(channelsRetrieved);
//   } else if (message === 'GET_USERS') {
//     chatulaService.getUserList(usersRetrieved);
//   } else if (message === 'LOG_IN') {
//     window.localStorage.setItem('jwt', data.token);
//     user = decodeJWT(data.token);
//     chatulaService = new ChatulaService(data.token);
//     chatulaService.connect(addUserSubscriber);
//     maximize();
//   } else if (message === 'LOG_OUT') {
//     chatulaService.disconnect(disconnected);
//     this.lastMessageFrom = '';
//     this.selectedChannelId = null;
//     this.selectedUserId = null;
//     minimize();
//   }
// }
//
// function minimize(e) {
//   e = e || window.event;
//   if (e) {
//     var target = e.target || e.srcElement;
//     e.stopPropagation();
//   }
//   $('#minimizeButton').addClass("invisible");
//   $('#chatulaIFrameContainer', window.parent.document).height("36px");
//   $('#chatulaIFrameContainer', window.parent.document).width("100px");
// }
//
// function maximize() {
//   $('#minimizeButton').removeClass("invisible");
//   $('#chatulaIFrameContainer', window.parent.document).width("500px");
//   $('#chatulaIFrameContainer', window.parent.document).height("465px");
// }
//
// function disconnected() {
//   $("#channels").empty();
//   $("#users").empty();
//   $("#conversation").empty();
// }
//
// function unselectItem() {
//   $(".chatula-channel-item").each(function () {
//     $(this).removeClass("chatula-channel-item-selected");
//   });
//   $(".chatula-user-item").each(function () {
//     $(this).removeClass("chatula-user-item-selected");
//   });
// }
//
// function prepareMessage(content) {
//   return {
//     user: {id: user.userId},
//     channel: {id: selectedChannelId},
//     content: content
//   };
// }
//
// function appendMessage(message) {
//   $("#conversation").append(formatMsg(message));
//   if (user.username !== message.user.username) {
//     //FIXME when im not focused play sound
//     if (!document.hasFocus() && !parent.document.hasFocus()) {
//       playSound();
//     }
//     // sendDesktopNotification(message);
//   }
//   lastMessageFrom = message.user.username;
//   chatulaService.updateLastUserActionOnChannel(selectedChannelId);
//
// }
//
// function channelsRetrieved(channels) {
//   $("#channels").empty();
//   for (var i = 0; i < channels.length; i++) {
//     $("#channels").append(createChannelObject(channels[i]));
//     addSubscriberToChannel(channels[i].id);
//   }
//   chatulaService.getMyChannelsWithUnreadMessages(highlightChannels);
// }
//
// function createChannelObject(newChannel) {
//   var channelDIV = document.createElement("div");
//   $(channelDIV).html("# " + newChannel.title);
//   $(channelDIV).addClass("chatula-channel-item");
//   channelDIV.id = "channel-item-id-" + newChannel.id;
//   channelDIV.channel = newChannel;
//   $(channelDIV).click(function (event) {
//     var channel = event.target.channel;
//     selectChannel(channel.id, 0, 50, false);
//   });
//   return channelDIV;
// }
//
// function messagesRetrieved(msgs) {
//   $("#conversation").empty();
//   for (var i = 0; i < msgs.length; i++) {
//     $("#conversation").append(formatMsg(msgs[i]));
//     lastMessageFrom = msgs[i].user.username;
//   }
// }
//
// function usersRetrieved(users) {
//   $("#users").empty();
//   for (var i = 0; i < users.length; i++) {
//     var usersDIV = document.createElement("div");
//     $(usersDIV).html(users[i].username);
//     $(usersDIV).addClass("chatula-user-item");
//     usersDIV.id = "user-item-id-" + users[i].id;
//     usersDIV.user = users[i];
//     $(usersDIV).click(function (event) {
//       var user = event.target.user;
//       selectUser(user.id);
//     });
//     $("#users").append(usersDIV);
//   }
// }
//
// function selectUser(userId) {
//   unselectItem();
//   unhighlightUser(userId);
//   selectedUserlId = userId;
//   // directMessage = true;
//   $("#user-item-id-" + userId).addClass("chatula-user-item-selected");
//   $('#users').toggle(500);
//   $('#users-container-info').toggle(500);
//   chatulaService.createChannel([user.userId, userId], channelCreated);
// }
//
// function channelCreated(channelId) {
//   if ($("#channel-item-id-" + channelId).length == 0) {
//     chatulaService.getChannel(channelId, channelFetchedAndSelected);
//   } else {
//     selectChannel(channelId, 0, 50, false);
//   }
// }
//
// function channelFetched(channel) {
//   console.log("channel fetched=", channel);
//   $("#channels").append(createChannelObject(channel));
//   addSubscriberToChannel(channel.id);
// }
//
// function channelFetchedAndSelected(channel) {
//   channelFetched(channel);
//   selectChannel(channel.id, 0, 50, true);
// }
//
// function channelFetchedAndHighlighted(channel) {
//   channelFetched(channel);
//   highlightChannel(channel.id);
//   playSound();
// }
//
// function selectChannel(channelId, offset, limit, direct) {
//   unselectItem();
//   unhighlightChannel(channelId);
//   directMessage = direct;
//   $("#channel-item-id-" + channelId).addClass("chatula-channel-item-selected");
//   selectedChannelId = channelId;
//   $('#messageInput').focus();
//   chatulaService.updateLastUserActionOnChannel(selectedChannelId);
//   lastMessageFrom = '';
//   chatulaService.getChannelMessages(selectedChannelId, offset, limit, messagesRetrieved);
// }
//
// function formatMsg(message) {
//   var time = message.timestamp.split(" ")[1];
//   if (lastMessageFrom !== message.user.username) {
//     lastClass = lastClass == 'chatula-message-light' ? 'chatula-message-dark' : 'chatula-message-light';
//     return "<div class='" + lastClass + "'><div class='chatula-message-title'><span class='chatula-message-title-username'>" + message.user.username + "</span>&nbsp;&nbsp;<span class='chatula-message-title-timestamp' title='" + message.timestamp + "'>" + time + "</span></div><div class='chatula-message-content'> " + message.content + "</div></div>"
//   } else {
//     return "<div class='" + lastClass + "'><div class='chatula-message-content'> " + message.content + "</div></div>"
//   }
// }
//
// function performMessageSending() {
//   var content = $("#messageInput").val();
//   if (!shouldSend(content)) {
//     return;
//   }
//   chatulaService.sendMessage(selectedChannelId, prepareMessage(content));
//   console.log('should send direct message:' + directMessage);
//   if (directMessage) {
//     chatulaService.sendInvitationToUser(user.userId, selectedUserlId);
//   }
//   $("#messageInput").val('');
// }
//
// function addSubscriberToChannel(channelId) {
//   chatulaService.getStompClient().subscribe("/channel/" + channelId, function (message) {
//     var destination = message.headers.destination;
//     var destinationChannelId = destination.substr(destination.lastIndexOf('/') + 1);
//     if (selectedChannelId == destinationChannelId) {
//       var messageContent = JSON.parse(message.body);
//       appendMessage(messageContent);
//     } else {
//       highlightChannel(destinationChannelId);
//       playSound();
//     }
//     sendDesktopNotification(message);
//
//     var elem = document.getElementById('conversation');
//     elem.scrollTop = elem.scrollHeight;
//   }, {id: 'channel=' + channelId});
//
//   chatulaService.getStompClient().subscribe("/channel/" + channelId + "/errors", function (error) {
//     this.alertError(error.body);
//   }, {id: 'error=' + channelId});
// };
//
// function alertError(error) {
//   console.error('Chat error:', error);
// };
//
// function addUserSubscriber() {
//   chatulaService.getStompClient().subscribe("/direct/" + user.userId, function (message) {
//     var inviterUserId = message.body;
//     console.log('level 1 = user= ', inviterUserId);
//     chatulaService.createChannel([user.userId, inviterUserId], function (channelId) {
//       console.log('level 2 channel = ' + channelId);
//       if ($("#channel-item-id-" + channelId).length == 0) {
//         chatulaService.getChannel(channelId, channelFetchedAndHighlighted);
//       } else {
//         highlightChannel(channelId);
//         playSound();
//       }
//     });
//   });
// }
//
// function highlightUser(userId) {
//   $("#user-item-id-" + userId).addClass("chatula-user-item-highlighted");
// }
//
// function highlightChannels(channels) {
//   for (var i = 0; i < channels.length; i++) {
//     highlightChannel(channels[i].id);
//   }
// }
//
// function highlightChannel(channelId) {
//   $("#channel-item-id-" + channelId).addClass("chatula-channel-item-highlighted");
// }
//
// function unhighlightUser(userId) {
//   $("#user-item-id-" + userId).removeClass("chatula-user-item-highlighted");
// }
//
// function unhighlightChannel(channelId) {
//   $("#channel-item-id-" + channelId).removeClass("chatula-channel-item-highlighted");
// }
//
// function showError(message) {
//   var snackbar = $('#snackbar');
//   snackbar.text(message);
//   snackbar.addClass('show');
//   setTimeout(function () {
//     snackbar.removeClass('show');
//     snackbar.text('');
//   }, 3000);
// }
//
// function shouldSend(content) {
//   if (selectedChannelId == null) {
//     showError('You need to choose a channel');
//     return false;
//   }
//   if (content == null || content.length < 1 || content.length > 2048) {
//     showError('Message must be between 1 and 2048 characters long');
//     return false;
//   }
//   return true;
// }
//
// function sendDesktopNotification(message) {
//
//   if (!canSendNotification() || document.hasFocus() || parent.document.hasFocus()) {
//     return;
//   }
//
//   var chatMessage = JSON.parse(message.body);
//
//   var notification = new Notification('New message from: ' + chatMessage.user.username,
//     {
//       tag: 'Chat',
//       body: chatMessage.content,
//       icon: 'https://cula.io/app/assets/img/dashboard/ninja.png',
//       iconUrl: 'https://cula.io/app/assets/img/dashboard/ninja.png',
//       isClickable: true
//     }
//   );
//
//   notification.onclick = function () {
//     parent.focus();
//   };
//
//
// }
//
// function canSendNotification() {
//   if (!("Notification" in window)) {
//     alert("This browser does not support system notifications");
//     return false;
//   }
//   // Let's check whether notification permissions have already been granted
//   else if (Notification.permission === "granted") {
//     return true;
//   }
//
//   else if (Notification.permission !== 'denied') {
//     Notification.requestPermission(function (permission) {
//       if (permission === "granted") {
//         return true;
//       }
//     });
//   }
//   return false;
// }
//
// function toggleUsers() {
//   $('#users-container-info').toggle(500);
//   $('#users').toggle(500);
//
//   // $('#display_advance').toggle('1000');
//   $('#display_advance').toggleClass("fa-caret-down fa-caret-right");
//
// }
