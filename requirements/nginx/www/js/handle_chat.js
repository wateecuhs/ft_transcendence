async function handle_chat_private(private_message, mp_user, message) {
  if (private_message === true && mp_user != null) {
    user = await getUserInfo(getTokenCookie());

    if (!user) {
      console.error("Error: Failed to fetch user information");
    }

    if (message.data && message.data.author === mp_user) {
      if (!message.data.target) return ;

      if (user.username === message.data.target) {
        displayPrivateMessage(message.data);
      }
      return window.ws;
    }
  }
  displayPrivateMessage(message.data);
}

async function handle_chat_public(private_message, mp_user, message) {
  if (private_message === true && mp_user != null) {
  user = await getUserInfo(getTokenCookie());

    if (!user) {
      console.error("Error: Failed to fetch user information");
    }

    if (message.data && message.data.author === mp_user) {
      if (!message.data.target) return ;

      if (user.username === message.data.target) {
        displayPrivateMessage(message.data);
      }
      return window.ws;
    }
  }
  displayChatMessage(message.data);
}

function handle_status_update(friendToUpdate) {
  const clientTab = document.querySelector('#msnWindow .client.tab .ul-client-tab');
  const friends = clientTab.querySelectorAll('li');


  for (const friend of friends) {
    const name = friend.querySelector('.friend-name');
    if (name.textContent === friendToUpdate.author) {
      const statusDot = friend.querySelector('.status-dot');
      statusDot.style.backgroundColor = friendToUpdate.status === "ON" ? 'green' : 'red';
      return ;
    }
  }
}
