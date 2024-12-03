function displayUserInfo(username) {
  const userInfo = localStorage.getItem(username);
  if (userInfo) {
    const user = JSON.parse(userInfo);

    const userInfoMessage = `
      Nom d'utilisateur: ${user.username}
      Alias: ${user.alias}
      Email: ${user.email}
      Avatar: ${user.avatar_path}
      Access Token: ${user.access_token}
      Compte 42: ${user.is_42_account ? 'Oui' : 'Non'}
      ID de salle: ${user.room_id}
    `;

    alert(userInfoMessage);
  } else {
    alert('Aucune information trouvée pour cet utilisateur.');
  }
}

async function changeUserInfo(accesToken, requestData) {
  try {
    const response = await fetch('/auth/user/me', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accesToken}`,
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {

    } else {

    }
  } catch (error) {

  }
}

async function getUserInfo(accessToken) {
  console.log('test');
  try {
    const response = await fetch('/auth/user/me/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.message === 'Success') {
        return {
          username: data.username,
          alias: data.alias,
          status: data.status,
          email: data.email,
          avatar_path: data.avatar_path,
          access_token: accessToken,
          is_42_account: data.is_42_account,
          room_id: data.room_id,
        };
      } else {
        alert('Erreur lors de la récupération des informations utilisateur');
        return null;
      }
    } else {
      const errorData = await response.json();
      alert('Erreur : ' + (errorData.message || 'Problème avec l\'API.'));
      return null;
    }
  } catch(error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
    return null;
  }
}
