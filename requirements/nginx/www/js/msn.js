let msnCurrentPage = 0;

function loadMessageHistory() {
  fetch(`/chat/messages`)
    .then(response => response.json())
    .then(data => {
      data.forEach(message => {
        displayChatMessage(message.data);
      });
    })
}

function initWebSocket() {
  var ws = new WebSocket('wss://localhost:8443/chat/');
  ws.onmessage = function(event) {
    const message = JSON.parse(event.data);
    if (message.type === "chat.public") {
      displayChatMessage(message.data);
    }
    else if (message.type === "chat.private") {
      displayPrivateMessage(message.data);
    }
    else {
      console.log(message);
    }
  }
  return ws;
}

function showMsnPage(pageIndex) {
  const msnPages = document.getElementById('msnWindow').querySelectorAll('.msn-page');
  msnPages.forEach((page, index) => {
    page.style.display = (index === pageIndex) ? 'flex' : 'none';
  });
}

document.getElementById('msnWindow').querySelector('.close-button').addEventListener('click', function() {
  document.getElementById('msnWindow').style.display = 'none';
});

function toggleMsnWindow() {
  const msnWindow = document.getElementById('msnWindow');
  if (msnWindow.style.display === 'none') {
    msnWindow.style.display = 'flex';
    msnWindow.style.position = 'absolute';
    msnWindow.style.top = `${window.innerHeight / 2 - msnWindow.offsetHeight / 2}px`;
    msnWindow.style.left = `${window.innerWidth / 2 - msnWindow.offsetWidth / 2}px`;
  }

  showMsnPage(msnCurrentPage);
}

function setupSendMessage() {
  const sendButton = document.querySelector('#msnWindow .send-button');
  const chatInput = document.querySelector('#msnWindow .chat-input');


  sendButton.addEventListener('click', function() {
    const message = chatInput.value.trim();
    if (message) {
      ws.send(JSON.stringify({
				'type': 'chat_message',
				'data': {
					'sender': document.getElementsByClassName('chat-input').innerHTML,
					'message': message
				}
			}));
      chatInput.value = '';
    }
  });

  chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      sendButton.click();
    }
  });
}

function displayChatMessage(data) {
  const chatMessages = document.querySelector('#msnWindow .chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.textContent = data.author + ': ' + data.content;
  chatMessages.appendChild(messageDiv);
  const timestampSpan = document.createElement('span');
  timestampSpan.classList.add('timestamp');
  timestampSpan.textContent = data.created_at;
  messageDiv.appendChild(timestampSpan);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function displayPrivateMessage(data) {
  const chatMessages = document.querySelector('#msnWindow .chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  const prefix = data.is_author ? '[To] ' : '[From] ';
  const who = data.is_author ? data.target : data.author;
  messageDiv.textContent = prefix + who + ': ' + data.content;
  chatMessages.appendChild(messageDiv);
  const timestampSpan = document.createElement('span');
  timestampSpan.classList.add('timestamp');
  timestampSpan.textContent = data.created_at;
  messageDiv.appendChild(timestampSpan);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.addEventListener('DOMContentLoaded', function() {
  setupSendMessage();
});