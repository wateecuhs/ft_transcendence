let msnCurrentPage = 0;
let private_message = false;
let mp_user = null;

const conversations = {};

async function loadMessageHistory() {
  try {
    const response = await fetch(`/chat/messages/`);

      if (response.ok) {
        const data = await response.json();
        if (data) {
          data.forEach(message => {
            displayChatMessage(message.data);
          });
        } else console.log('load message history: no data');
      } else console.log('load message history: response is not ok');
  } catch (error) {
    console.error(error);
  }
}

function initWebSocket() {
  if (!window.ws || window.ws.readyState === WebSocket.CLOSED) {
    window.ws = new WebSocket(`wss://${window.location.host}/chat/`);
  }

  window.ws.onmessage = function(event) {

    const message = JSON.parse(event.data);
    if (message.type === "chat.public") {
      handle_chat_public(private_message, mp_user, message);
    }
    else if (message.type === "chat.private") {
      handle_chat_private(private_message, mp_user, message);
    }
    else if (message.type === "relationship.request") {
      showPopUp(window.dataMap.get('friend-request') + message.data.author);
    }
    else if (message.type === "relationship.accept") {
      updateUserFriend();
      showPopUp(window.dataMap.get('friend-accepted') + message.data.author);
    }
    else if (message.type === "relationship.remove") {
      updateUserFriend();
    }
    else if (message.type === "status.update") {
      console.log(message.data);
      handle_status_update(message.data);
      console.log('status update');
    }
    else {
      console.log(message.type);
    }
  }

  window.ws.onclose = function(event) {
    for (const key in conversations) {
      conversations[key] = "";
    }

    const isRefreshed = getRefreshToken();
    if (isRefreshed) {
      return initWebSocket();
    }
  };
  return window.ws;
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
    navigateToPage('msn');
  } else {
    msnWindow.style.display = 'none';
  }

  showMsnPage(msnCurrentPage);
}

async function updateUserFriend(username) {
  try {
      const response = await fetch(`/chat/friends/`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getTokenCookie()}`
          }
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === 'Invalid token') {
          const isRefreshed = await getRefreshToken();
          if (isRefreshed) {
            return updateUserFriend(username);
          }
          console.log(errorData.message);
          return;
        } else {
          console.error('Error: Failed to fetch friends', response.status);
          return;
        }
      }

      const friends = await response.json();

      if (friends) {
          await updateClientsTab(friends);
      }
  } catch (error) {
      console.error('Error fetching friends:', error);
  }
}

async function updateClientsTab(friends) {
  const clientTab = document.querySelector('#msnWindow .client.tab .ul-client-tab');
  clientTab.innerHTML = '';

  for (const friend of friends) {
    const li = document.createElement('li');
    li.classList.add("li-friend");

    client = await getClientInfo(friend);

    const statusDot = document.createElement('span');
    statusDot.classList.add("status-dot");
    statusDot.style.backgroundColor = 'red';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = friend;
    nameSpan.classList.add("friend-name");

    const span = document.createElement('span');
    const img = document.createElement('img');
    img.src = "img/png/notepad-1.png";
    span.classList.add("span-friend-tab");
    img.classList.add("info-friend");

    span.appendChild(img);
    li.appendChild(statusDot);
    li.appendChild(nameSpan);
    li.appendChild(span);
    clientTab.appendChild(li);

    const newImg = img.cloneNode(true);
    img.replaceWith(newImg);

    newImg.addEventListener('click', function(event) {
      toogleClientAction(event, friend);
    });
  }
}

function setupSendMessage() {
  const sendButton = document.querySelector('#msnWindow .send-button');
  const chatInput = document.querySelector('#msnWindow .chat-input');

  sendButton.addEventListener('click', function() {
    const message = chatInput.value.trim();

    if (message && window.ws && window.ws.readyState === WebSocket.OPEN) {
      if (private_message === true && mp_user != null) {
        window.ws.send(JSON.stringify({
          'type': 'chat_message',
          'data': {
            'sender': document.getElementsByClassName('chat-input').innerHTML,
            'message': `/w ${mp_user} ${message}`
          }
        }));
      } else {
        window.ws.send(JSON.stringify({
          'type': 'chat_message',
          'data': {
            'sender': document.getElementsByClassName('chat-input').innerHTML,
            'message': message
          }
        }));
      }
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

  addMessageToConversation(data.target, {
    author: data.author,
    target: data.target,
    content: data.content,
    created_at: data.created_at,
    is_author: data.is_author
  });
}

function searchFriends() {
  const sendButton = document.querySelector('#msnWindow .general-button');
  const searchInput = document.querySelector('#msnWindow .add-friends-input input');

  sendButton.addEventListener('click', function() {
    const targetName = searchInput.value.trim();

    if (targetName && window.ws && window.ws.readyState === WebSocket.OPEN) {
      window.ws.send(JSON.stringify({
        'type': 'chat_message',
        'data': {
          'message': `/add ${targetName}`
        }
      }));
      searchInput.value = '';
    }
  });
  searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      sendButton.click();
    }
  });
}

function openGeneralMessage() {
  const chatMessages = document.querySelector('#msnWindow .chat-messages')
  chatMessages.innerHTML = '';
  chatMessages.placeholder = 'Type a message';
  private_message = false;
  mp_user = null;
  loadMessageHistory();
}

function addMessageToConversation(friend, message) {
  if (!conversations[friend]) {
    conversations[friend] = [];
  }
  console.log('push with ' + friend);
  conversations[friend].push(message);
}

function loadPrivateHistory(friend) {
  if (!conversations || !conversations[friend]) return ;

  for (const data of conversations[friend]) {
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
}

document.addEventListener('DOMContentLoaded', () => {
  setupSendMessage();
  searchFriends();
});