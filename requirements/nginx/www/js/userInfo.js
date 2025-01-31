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
    alert('No information found for this user');
  }
}

async function getUserInfo() {
  let accessToken = getTokenCookie();
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
        raiseAlert('Getuser:' + data.message);
        return null;
      }
    } else {
      const errorData = await response.json();
      if (errorData.message.startsWith('failed : access token') || errorData.message === 'failed : access_token is invalid' || errorData.message === 'failed : access_token is expired') {
        const isRefreshed = await getRefreshToken();
        if (isRefreshed) {
          const new_token = getTokenCookie();
          return await getUserInfo(new_token);
        }
        else {
          quitDesk();
          raiseAlert(window.dataMap.get('expired-session'));
        }
      } else {
        console.error(errorData.message);
      }
      return null;
    }
  } catch(error) {
    console.error('Info error', error);
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
      if (errorData.message.startsWith('failed : access token') || errorData.message === 'failed : access_token is invalid' || errorData.message === 'failed : access_token is expired') {
        const isRefreshed = await getRefreshToken();
        if (isRefreshed) {
          const new_token = getTokenCookie();
          return await getUserStatistic(new_token);
        }
        else {
          quitDesk();
          raiseAlert(window.dataMap.get('expired-session'));
        }
      } else {
        raiseAlert('Getuser:' + errorData.message);
      }
    }
  } catch (error) {
    console.error('Info error', error);
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
    const userTaskbar = document.getElementById('name-taskbar-id');
    if (userTaskbar && user.username) {
      userTaskbar.textContent = user.username;
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
		console.error('Cant get user info');
	}
}

async function getMatchesHistory() {
  try {
    const response = await fetch('/auth/matches/me/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getTokenCookie()}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.message === 'Success') {
        return {
          matches: data.matches,
        };
      } else {
        raiseAlert(data.message);
      }
    } else {
      const errorData = await response.json();
      if (errorData.message.startsWith('failed : access token') || errorData.message === 'failed : access_token is invalid' || errorData.message === 'failed : access_token is expired') {
        const isRefreshed = await getRefreshToken();
        if (isRefreshed) {
          return await getMatchesHistory();
        } else {
          quitDesk();
          raiseAlert(window.dataMap.get('expired-session'));
        }
      }
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function updateMatchHistory() {
  const matchesData = await getMatchesHistory();
  const userWin = document.querySelector("#accountWindow");
  const matchesList = userWin.querySelector("#account-page-2 ul");

  matchesList.innerHTML = '';

  if (matchesData && matchesData.matches) {
    if (matchesData.matches.length === 0) {
      const matchElement = document.createElement('li');
      matchElement.classList.add('match');

      const noMatch = document.createElement('div');
      noMatch.classList.add('no-match');
      noMatch.textContent = window.dataMap.get('no-match-history');
      matchElement.appendChild(noMatch);
      matchesList.appendChild(matchElement);
      return ;
    }

    matchesData.matches.forEach( async (match) => {
      const matchElement = document.createElement('li');
      matchElement.classList.add('match');

      const matchDate = document.createElement('div');
      matchDate.classList.add('match-date');
      matchDate.textContent = `--- ${window.dataMap.get('match-history-match')} ${match.date} ---`;

      const matchVersus = document.createElement('div');
      matchVersus.classList.add('match-versus');

      const alias_user = await getUserAlias(match.user_name);
      const alias_opponent = await getUserAlias(match.opponent_name);
      matchVersus.textContent = `${alias_user} vs ${alias_opponent}`;

      const matchScore = document.createElement('div');
      matchScore.classList.add('match-score');
      matchScore.textContent = `${window.dataMap.get('score')} ${match.user_score} - ${match.opponent_score}`;

      const matchStatus = document.createElement('div');
      matchStatus.classList.add('match-status');
      const statusVal = match.user_win === true ? 'Win' : 'Lose';
      matchStatus.textContent = `${window.dataMap.get('status')}: ${statusVal }`;

      const matchSeparator = document.createElement('div');
      matchSeparator.classList.add('match-details');
      matchSeparator.textContent = '--- ---';

      matchElement.appendChild(matchDate);
      matchElement.appendChild(matchVersus);
      matchElement.appendChild(matchScore);
      matchElement.appendChild(matchStatus);
      matchElement.appendChild(matchSeparator);

      matchesList.appendChild(matchElement);
    });
  } else {
    const matchElement = document.createElement('li');
    matchElement.classList.add('match');

    const noMatch = document.createElement('div');
    noMatch.classList.add('no-match');
    noMatch.textContent = window.dataMap.get('no-match-history');
    matchElement.appendChild(noMatch);
    return ;
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

    const data = await response.json();
    if (response.ok) {
      if (data.message === 'Success') {
        document.cookie = `access_token=${data.access_token}; path=/; SameSite=None; Secure`;
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.error(error);
    return false;
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

async function getUserAlias(username) {
  try {
    const response = await fetch(`https://${window.location.host}/auth/user/${username}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getTokenCookie()}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.message === 'Success') {
        return data.alias;
      }
    } else {
      const errorData = await response.json();
      if (errorData.message.startsWith('failed : access token') || errorData.message === 'failed : access_token is invalid' || errorData.message === 'failed : access_token is expired') {
        const isRefreshed = await getRefreshToken();
        if (isRefreshed) {
          return await getUserAlias(username);
        }
        else {
          quitDesk();
          raiseAlert(window.dataMap.get('expired-session'));
        }
      }
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
