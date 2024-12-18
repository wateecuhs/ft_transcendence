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
