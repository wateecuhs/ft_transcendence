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
          language: data.language,
        };
      } else {
        raiseAlert('Erreur lors de la récupération des informations utilisateur');
        return null;
      }
    } else {
      const errorData = await response.json();
      if (errorData.message === 'failed : access_token is invalid' || errorData.message === 'failed : access_token is expired') {
        const isRefreshed = await getRefreshToken();
        if (isRefreshed) {
          const new_token = getTokenCookie();
          return await getUserInfo(new_token);
        }
      } else {
        console.log(errorData.message);
      }
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
      const errorData = await response.json();
      if (errorData.message === 'failed : access_token is invalid' || errorData.message === 'failed : access_token is expired') {
        const isRefreshed = await getRefreshToken();
        if (isRefreshed) {
          const new_token = getTokenCookie();
          return await getUserStatistic(new_token);
        }
      } else {
        raiseAlert('Getuser:' + errorData.message);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
    return null;
  }
  return null;
}

async function updateUserInfo() {
	const tmp = await getUserInfo(getTokenCookie());
  const userInfo = JSON.stringify(tmp);

	if (userInfo) {
		const user = JSON.parse(userInfo);
    const userWin = document.querySelector("#accountWindow");

    if (user == null) {
      return
    }
    userWin.querySelector("#account-page-0 .user-img span").textContent = user.alias || 'default pseudo';
    userWin.querySelector("#account-page-0 ul li:nth-child(1)").textContent = `${window.dataMap.get('account-name')}: ${user.username || 'default'}`;
    userWin.querySelector("#account-page-0 ul li:nth-child(2)").textContent = `${window.dataMap.get('account-email')}: ${user.email || 'default@gmail.com'}`;
    userWin.querySelector("#account-page-0 ul li:nth-child(3)").textContent = `${window.dataMap.get('account-42')}: ${user.is_42_account || 'false'}`;
    userWin.querySelector("#account-page-0 ul li:nth-child(4)").textContent = `${window.dataMap.get('account-alias')}: ${user.alias || 'defuat_alias'}`;

		const avatarImg = userWin.querySelector("#account-page-0 .user-img img");
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
  if (!access_token_string)
    return ;
  let access_token_split = access_token_string.split('=');
  let access_token = access_token_split[1];
  return access_token;
}

async function getRefreshToken() {
  try {
    const response = await fetch('/auth/refresh/', {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.message === 'Success') {
        document.cookie = `access_token=${data.access_token}; path=/`;
        console.log('Token has been successfully refresh');
        return true;
      } else {
        raiseAlert('In getRefreshToken: ' + data.message);
      }
    } else {
      raiseAlert('In getRefreshToken: ' + data.message);
    }
  } catch (error) {
    console.log(error);
  }
  return false;
}

async function updateUserStat() {
  try {
    const access_token = getTokenCookie();
    const userStatistic = await getUserStatistic(access_token);

    if (userStatistic) {
      const stat = userStatistic;
      const user = document.querySelector("#accountWindow");

      user.querySelector("#account-page-1 ul li:nth-child(1)").textContent = `${window.dataMap.get('number-match')}: ${stat.matches_number}`;
      user.querySelector("#account-page-1 ul li:nth-child(2)").textContent = `${window.dataMap.get('number-win')}: ${stat.matches_win}`;
      user.querySelector("#account-page-1 ul li:nth-child(3)").textContent = `${window.dataMap.get('number-lose')}: ${stat.matches_lose}`;
      user.querySelector("#account-page-1 ul li:nth-child(4)").textContent = `${window.dataMap.get('winrate')}: ${stat.winrate}`;
      user.querySelector("#account-page-1 ul li:nth-child(5)").textContent = `${window.dataMap.get('goal-scored')}: ${stat.goal_scored}`;
      user.querySelector("#account-page-1 ul li:nth-child(6)").textContent = `${window.dataMap.get('goal-conceded')}: ${stat.goal_conceded}`;
    }
  } catch(error) {
    console.error(error);
  }
}
