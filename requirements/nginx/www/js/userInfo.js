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

    raiseAlert(userInfoMessage);
  } else {
    alert('Aucune information trouvée pour cet utilisateur.');
  }
}

async function getUserInfo(accessToken) {
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
        accessToken = data.accessToken
        return {
          username: data.username,
          alias: data.alias,
          status: data.status,
          email: data.email,
          avatar_path: data.avatar_path,
          access_token: data.accessToken,
          is_42_account: data.is_42_account,
          is_2FA: data.is_2FA,
          room_id: data.room_id,
        };
      } else {
        raiseAlert('Erreur lors de la récupération des informations utilisateur');
        return null;
      }
    } else {
      const errorData = await response.json();
      raiseAlert(errorData.message);
      return null;
    }
  } catch(error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
    return null;
  }
}

async function getUserStatistic(accessToken) {
  try {
    const response = await fetch('/auth/statistics/me/', {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      if (data.message === 'Success') {
        return {
          matches_number: data.matches_number,
          matches_win: data.matches_win,
					matches_lose: data.matches_lose,
					winrate: data.winrate,
					goal_scored: data.goal_scored,
					goal_conceded: data.goal_conceded
        };
      } else {
        raiseAlert(data.message);
      }
    } else {
      console.log('Couldnt find user statistic');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
    return null;
  }
  return null;
}

async function updateUserInfo(accesUsername) {
	const userInfo = localStorage.getItem(accesUsername);

	if (userInfo) {
		const user = JSON.parse(userInfo);

    document.querySelector("#account-page-0 .user-img span").textContent = user.alias || 'default pseudo';
    document.querySelector("#account-page-0 ul li:nth-child(1)").textContent = `Name: ${user.username || 'default'}`;
    document.querySelector("#account-page-0 ul li:nth-child(2)").textContent = `Email address: ${user.email || 'default@gmail.com'}`;
    document.querySelector("#account-page-0 ul li:nth-child(3)").textContent = `42 Member: ${user.is_42_account || 'false'}`;
    document.querySelector("#account-page-0 ul li:nth-child(4)").textContent = `Alias: ${user.alias || 'defuat_alias'}`;

		const avatarImg = document.querySelector("#account-page-0 .user-img img");
		avatarImg.src = "";
		avatarImg.src = user.avatar_path || 'img/png/game_spider-0.png';
	} else {
		console.error('Impossible de récupérer les informations utilisateur.');
	}
}

function getTokenCookie() {
  let cookieString = document.cookie;

  let cookie = cookieString.split(';');
  let access_token_string = cookie.find(element => element.trim().startsWith('access_token'));
  let access_token_split = access_token_string.split('=');
  let access_token = access_token_split[1];
  return access_token;
}

async function updateUserStat() {
  const access_token = getTokenCookie();
  const userStatistic = await getUserStatistic(access_token);

  if (userStatistic) {
    const stat = userStatistic;

    document.querySelector("#account-page-1 ul li:nth-child(1)").textContent = `Number of matches: ${stat.matches_number}`;
    document.querySelector("#account-page-1 ul li:nth-child(2)").textContent = `Matches won: ${stat.matches_win}`;
    document.querySelector("#account-page-1 ul li:nth-child(3)").textContent = `Matches lost: ${stat.matches_lose}`;
    document.querySelector("#account-page-1 ul li:nth-child(4)").textContent = `Winning Rate: ${stat.winrate}`;
    document.querySelector("#account-page-1 ul li:nth-child(5)").textContent = `Goal scored: ${stat.goal_scored}`;
    document.querySelector("#account-page-1 ul li:nth-child(6)").textContent = `Goal conceded: ${stat.goal_conceded}`;
  }
}
