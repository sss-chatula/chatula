var chatFrame = '<div id="chatulaIFrameContainer" style="width: 100px; height: 36px; position: fixed; right:1px; bottom: 1px;">' +
  '<iframe id="chatulaIFrame" scrolling="no" style="border: 0px; width: 100%; height: 100%;" src="/chatula/chatula.html"></iframe>' +
  '</div>';
// $("body").append(chatFrame);// $('body').append(xrew);
var elemDiv = document.createElement('div');
elemDiv.innerHTML = chatFrame;
document.body.appendChild(elemDiv);



