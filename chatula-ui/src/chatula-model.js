var chatulaModel = {

  selectedChannelId:null,
  selectedUserlId:null,
  user:null,
  lastMessageFrom: '',
  directMessage:null,
  lastCssClass:'',

  prepareMessage: function (content) {
    return {
      user: {id: chatulaModel.user.userId},
      channel: {id: chatulaModel.selectedChannelId},
      content: content
    };
  },

  reset: function () {
    chatulaModel.selectedChannelId = null;
    chatulaModel.selectedUserlId = null;
    chatulaModel.user = null;
    chatulaModel.lastMessageFrom = '';
    chatulaModel.directMessage = false;
    chatulaModel.lastCssClass = '';
  }
};
