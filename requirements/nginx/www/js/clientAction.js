
function toogleClientAction(event, friend) {
  const client = document.querySelector('#client-action');
  const clientAction = client.querySelector('.ul-client-action');


  if (client.style.display === 'none') {
    client.style.display = 'flex';
  } else {
    client.style.display = 'none';
  }

  client.style.position = 'absolute';
  client.style.top = `${window.innerHeight / 2 - client.offsetHeight / 2}px`;
  client.style.left = `${window.innerWidth / 2 - client.offsetWidth / 2}px`;

  const clientLi = clientAction.querySelectorAll('li');
  clientLi.forEach((li) => {
    li.addEventListener('click', function() {
      if (li.id === "client-info") {
        toogleClientWindow(friend);
        client.style.display = 'none';
      }

      if (li.id === "client-msg") {
        const chatMessages = document.querySelector('#msnWindow .chat-messages');
        const chatInput = document.querySelector('#msnWindow .chat-input');
        chatMessages.innerHTML = '';
        loadPrivateHistory(friend);
        private_message = true;
        mp_user = friend;
        chatInput.placeholder = `Send a message to ${friend}`;
        client.style.display = 'none';
      }
    });
  });

  client.querySelector('.close-button').addEventListener('click', function() {
    client.style.display = 'none';
  });
}
