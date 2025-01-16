async function handle_chat_private(private_message, mp_user, message) {
  if (private_message === true && mp_user != null) {
    user = await getUserInfo(getTokenCookie());
    if (!user) {
      console.error("Error: Failed to fetch user information");
    }
    if (message.data.author === mp_user || message.data.target === mp_user) {
      displayPrivateMessage(message.data);
    }
  }
}

async function handle_chat_public(private_message, mp_user, message) {
  if (!private_message) {
    displayChatMessage(message.data);
    return ;
  }
}

async function handle_chat_invite(message) {
  if (message.data)
      displayInviteMessage(message.data);
  return window.ws;
}

function handle_status_update(friendToUpdate) {

  const clientTab = document.querySelector('#msnWindow .client.tab .ul-client-tab');


    setTimeout(() => {
      const friends = clientTab.querySelectorAll('li');

      if (!friends.length) {
        console.error('Error: No friends found');
        return ;
      }

      for (const friend of friends) {
        const name = friend.querySelector('.friend-name');

        if (name.textContent === friendToUpdate.author) {
          const statusDot = friend.querySelector('.status-dot');
          console.log(`for friend ${friend.author} status is ${friend.status}`);
          statusDot.style.backgroundColor = friendToUpdate.status === "ON" ? 'green' : 'red';
          return ;
        }
      }
    }, 500);
}
