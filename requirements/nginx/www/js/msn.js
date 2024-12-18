let msnCurrentPage = 0;
let private_message = false;
let mp_user = null;

const conversations = {};

function toogleClientAction(event, friend) {
  const clientAction = document.querySelector('#msnWindow .client.tab .ul-client-action');
  const mouse = event.target;
  const rect = mouse.getBoundingClientRect();
  const x = rect.x;
  const y = rect.y;


  if (clientAction.style.display === 'none') {
    clientAction.style.display = 'flex';
  } else {
    clientAction.style.display = 'none';
  }

  clientAction.style.position = 'absolute';
  clientAction.style.left = `${x} - 180px`;
  clientAction.style.top = `${y} - 180px`;

  const clientLi = clientAction.querySelectorAll('li');
  clientLi.forEach((li) => {
    li.addEventListener('click', function() {
      if (li.id === "client-info") {
        toogleClientWindow(friend);
      }

      if (li.id === "client-msg") {
        const chatMessages = document.querySelector('#msnWindow .chat-messages');
        const chatInput = document.querySelector('#msnWindow .chat-input');
        chatMessages.innerHTML = '';
        loadPrivateHistory(friend);
        private_message = true;
        mp_user = friend;
        chatInput.placeholder = `Send a message to ${friend}`;
      }
    });
  });
}

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
    window.ws = new WebSocket('wss://localhost:8443/chat/');
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
      raiseAlert("Received friend request from " + message.data.author);
    }
    else if (message.type === "relationship.accept") {
      updateUserFriend();
      // devrait juste ajouter le nouvel user au lieu de tout re-render et le mettre en online par defaut
    }
    else if (message.type === "relationship.remove") {
      console.log("remove friend", message.data);
      updateUserFriend();
    }
    else if (message.type === "status.update") {
      handle_status_update(message.data)
    }
    else {
      console.log(message.type);
    }
  }
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
          console.error('Error: Failed to fetch friends', response.status);
          return;
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
    console.log(client.status);

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

    img.addEventListener('click', function(event) {
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
  alert(friend);
  if (!conversations || !conversations[friend]) return ;

  for (const data of conversations[friend]) {
    console.log(data);
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