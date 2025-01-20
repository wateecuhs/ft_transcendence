const clientWindow = document.getElementById('clientWindow');
let currentPageClient = 0;

clientWindow.querySelector('.close-button').addEventListener('click', function() {
  clientWindow.style.display = 'none';
});

function displayClientStylePage(pageIndex) {
 const totalPages = clientWindow.querySelectorAll('.account-page');

 totalPages.forEach((page, index) => {
  page.style.display = (index === pageIndex) ? 'block' : 'none';
 });

 const numberPages = clientWindow.querySelector(".number-pages");
 numberPages.innerHTML = '';
 numberPages.textContent = `${pageIndex + 1}/2`;
}

clientWindow.querySelector('.right-arrow').addEventListener('click', function() {
  if (currentPageClient < 1) {
    currentPageClient++;
  }
  displayClientStylePage(currentPageClient);
});

clientWindow.querySelector('.left-arrow').addEventListener('click', function() {
  if (currentPageClient > 0) {
    currentPageClient--;
  }
  displayClientStylePage(currentPageClient);
});

function toogleClientWindow(friend) {
  updateClientInfo(friend);
  const work_desk = clientWindow;

  if (work_desk.style.display === 'none') {
    setWindowIndex();
    work_desk.style.zIndex = 3000;
  }
  work_desk.style.display = (work_desk.style.display == 'none') ? 'block' : 'none';
  work_desk.style.position = 'absolute';
  work_desk.style.top = `${window.innerHeight / 2 - work_desk.offsetHeight / 2}px`;
  work_desk.style.left = `${window.innerWidth / 2 - work_desk.offsetWidth / 2}px`;
  displayClientStylePage(currentPageClient);
}

async function getClientInfo(username) {
  try {
    const response = await fetch(`/auth/user/${username}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getTokenCookie()}`
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.message === 'Success') {
        return {
          username: data.username,
          alias: data.alias,
          status: data.status,
          avatar_path: data.avatar_path,
        }
      } else {
        raiseAlert('Erreur lors de la récupération des informations utilisateur');
        return null;
      }
    } else {
      const errorData = await response.json();
      if (errorData.message.startsWith('failed : access token') || errorData.message === 'failed : access_token is invalid' || errorData.message === 'failed : access_token is expired') {
        const isRefreshed = await getRefreshToken();
        if (isRefreshed) {
          return await getClientInfo(username);
        }
        else {
          quitDesk();
          let expired_session = null;
          if (window.dataMap && window.dataMap.has('expired-session'))
            expired_session = window.dataMap.get('expired-session');
          else
            expired_session = 'Session expired';
          raiseAlert(expired_session);
        }
      } else {
        console.error(errorData.message);
      }
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
    return null;
  }
}

async function getClientStatistic(username) {
  try {
    const response = await fetch(`/auth/statistics/${username}/`, {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${getTokenCookie()}`,
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
          return await getClientStatistic(username);
        }
        else {
          quitDesk();
          let expired_session = null;
          if (window.dataMap && window.dataMap.has('expired-session'))
            expired_session = window.dataMap.get('expired-session');
          else
            expired_session = 'Session expired';
          raiseAlert(expired_session);
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

async function updateClientInfo(username) {
  const user = await getClientInfo(username);
  const stat = await getClientStatistic(username);

  let accountName = null;
  let accountAlias = null;
  if (window.dataMap && window.dataMap.has('account-name'))
    accountName = window.dataMap.get('account-name');
  else
    accountName = 'Name';
  if (window.dataMap && window.dataMap.has('account-alias'))
    accountAlias = window.dataMap.get('account-alias');
  else
    accountAlias = 'Alias';
  clientWindow.querySelector("#account-page-0 .user-img span").textContent = user.alias || 'default pseudo';
  clientWindow.querySelector("#account-page-0 ul li:nth-child(1)").textContent = `${accountName}: ${user.username || 'default'}`;
  clientWindow.querySelector("#account-page-0 ul li:nth-child(3)").textContent = `${accountAlias}: ${user.alias || 'default_alias'}`;

	const avatarImg = clientWindow.querySelector("#account-page-0 .user-img img");
	avatarImg.src = user.avatar_path || 'img/png/game_spider-0.png';

  let statMatchesNumber = null;
  let statMatchesWin = null;
  let statMatchesLose = null;
  let statWinrate = null;
  let statGoalScored = null;
  let statGoalConceded = null;
  if (window.dataMap && window.dataMap.has('number-match'))
    statMatchesNumber = window.dataMap.get('number-match');
  else
    statMatchesNumber = 'Matches number';
  if (window.dataMap && window.dataMap.has('number-win'))
    statMatchesWin = window.dataMap.get('number-win');
  else
    statMatchesWin = 'Matches win';
  if (window.dataMap && window.dataMap.has('number-lose'))
    statMatchesLose = window.dataMap.get('number-lose');
  else
    statMatchesLose = 'Matches lose';
  if (window.dataMap && window.dataMap.has('winrate'))
    statWinrate = window.dataMap.get('winrate');
  else
    statWinrate = 'Winrate';
  if (window.dataMap && window.dataMap.has('goal-scored'))
    statGoalScored = window.dataMap.get('goal-scored');
  else
    statGoalScored = 'Goal scored';
  if (window.dataMap && window.dataMap.has('goal-conceded'))
    statGoalConceded = window.dataMap.get('goal-conceded');
  else
    statGoalConceded = 'Goal conceded';
  clientWindow.querySelector("#account-page-1 ul li:nth-child(1)").textContent = `${statMatchesNumber}: ${stat.matches_number}`;
  clientWindow.querySelector("#account-page-1 ul li:nth-child(2)").textContent = `${statMatchesWin}: ${stat.matches_win}`;
  clientWindow.querySelector("#account-page-1 ul li:nth-child(3)").textContent = `${statMatchesLose}: ${stat.matches_lose}`;
  clientWindow.querySelector("#account-page-1 ul li:nth-child(4)").textContent = `${statWinrate}: ${stat.winrate}`;
  clientWindow.querySelector("#account-page-1 ul li:nth-child(5)").textContent = `${statGoalScored}: ${stat.goal_scored}`;
  clientWindow.querySelector("#account-page-1 ul li:nth-child(6)").textContent = `${statGoalConceded}: ${stat.goal_conceded}`;
}
