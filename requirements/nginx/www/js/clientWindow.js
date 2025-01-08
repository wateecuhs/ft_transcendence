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
          is_42_account: data.is_42_account,
        }
      } else {
        raiseAlert('Erreur lors de la récupération des informations utilisateur');
        return null;
      }
    } else {
      const errorData = await response.json();
      if (errorData.message === 'failed : access_token is invalid' || errorData.message === 'failed : access_token is expired') {
        const isRefreshed = await getRefreshToken();
        if (isRefreshed) {
          return await getClientInfo(username);
        }
      } else {
        console.log(errorData.message);
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
      if (errorData.message === 'failed : access_token is invalid' || errorData.message === 'failed : access_token is expired') {
        const isRefreshed = await getRefreshToken();
        if (isRefreshed) {
          return await getClientStatistic(username);
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

  clientWindow.querySelector("#account-page-0 .user-img span").textContent = user.alias || 'default pseudo';
  clientWindow.querySelector("#account-page-0 ul li:nth-child(1)").textContent = `${window.dataMap.get('account-name')}: ${user.username || 'default'}`;
	clientWindow.querySelector("#account-page-0 ul li:nth-child(2)").textContent = `${window.dataMap.get('account-42')}: ${user.is_42_account || 'false'}`;
  clientWindow.querySelector("#account-page-0 ul li:nth-child(3)").textContent = `${window.dataMap.get('account-alias')}: ${user.alias || 'defuat_alias'}`;

	const avatarImg = clientWindow.querySelector("#account-page-0 .user-img img");
	avatarImg.src = user.avatar_path || 'img/png/game_spider-0.png';

  clientWindow.querySelector("#account-page-1 ul li:nth-child(1)").textContent = `${window.dataMap.get('number-match')}: ${stat.matches_number}`;
  clientWindow.querySelector("#account-page-1 ul li:nth-child(2)").textContent = `${window.dataMap.get('number-win')}: ${stat.matches_win}`;
  clientWindow.querySelector("#account-page-1 ul li:nth-child(3)").textContent = `${window.dataMap.get('number-lose')}: ${stat.matches_lose}`;
  clientWindow.querySelector("#account-page-1 ul li:nth-child(4)").textContent = `${window.dataMap.get('winrate')}: ${stat.winrate}`;
  clientWindow.querySelector("#account-page-1 ul li:nth-child(5)").textContent = `${window.dataMap.get('goal-scored')}: ${stat.goal_scored}`;
  clientWindow.querySelector("#account-page-1 ul li:nth-child(6)").textContent = `${window.dataMap.get('goal-conceded')}: ${stat.goal_conceded}`;
}
