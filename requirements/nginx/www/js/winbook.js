function toggleWinbookWindow() {
  const winbook = document.getElementById('winBook');
  if (winbook.style.display === 'none') {
    setWindowIndex();
    winbook.style.zIndex = 3000;
    winbook.style.display = 'flex';
    winbook.style.position = 'absolute';
    winbook.style.top = `${window.innerHeight / 2 - winbook.offsetHeight / 2}px`;
    winbook.style.left = `${window.innerWidth / 2 - winbook.offsetWidth / 2}px`;
    navigateToPage('winbook');
    showAllTournaments();
  } else {
    winbook.style.display = 'none';
  }
}

function initMMWebSocket() {
  if (!window.mmws || window.mmws.readyState === WebSocket.CLOSED) {
    window.mmws = new WebSocket(`wss://${window.location.host}/matchmaking/`);
  }

  window.mmws.onmessage = function(event) {
    const message = JSON.parse(event.data);

    if (message.type === "tournament.join") {
      showTournamentDetails(message.data);
    }
    else if (message.type === "tournament.create") {
      raiseAlert(`${window.dataMap.get('tournament-created-1')} ${message.data.name} ${window.dataMap.get('tournament-created-2')}`);
      showTournamentDetails(message.data);
    }
    else if (message.type === "tournament.leave") {
      showTournamentDetails(message.data);
    }
    else if (message.type === "tournament.start") {
      const data = {
        author: 'WinBook Corporation',
        content: 'A Tournament is now starting !',
        created_at: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        })
      };

      displayChatMessage(data);
      const pongWindow = document.getElementById('PongGame');
      pongWindow.querySelector('.close-button').click();
      showPopUp(window.dataMap.get('start-tournament'));
      navigateToPage("pong");
      sendPlayersToRooms(message.data);
    }
    else if (message.type === "tournament.delete") {
      showTournamentDetails(message.data);
    }
    else if (message.type === "tournament.update") {
      if (message.data.rounds.length === 2 && message.data.rounds[1].matches[0].status !== "FINISHED") {
        if (message.data.author === message.data.rounds[1].matches[0].player1 || message.data.author === message.data.rounds[1].matches[0].player2) {
          showPopUp("Hurry up ! You are in the next round !");
		      const pongWindow = document.getElementById('PongGame');
          pongWindow.querySelector('.close-button').click();
          setTimeout(() => {
            let game = new PongWindow("remote", message.data.rounds[1].matches[0].room_code);
            game.run();
          }, 2000);
        }
      }
    }
    else if (message.type === "matchmaking.start") {
      const optionWin = document.getElementById('game-option');
      const buttonMathmaking = optionWin.querySelector('#launch-matchmaking');
      buttonMathmaking.textContent = window.dataMap.get('launch-matchmaking');
      window.matchmaking = true;
      optionWin.style.display = 'none';
      navigateToPage("pong");
      let game = new PongWindow("remote", message.data.room_code);
      game.run();
    }
    else if (message.type === "matchmaking.leave") {
      //showPopUp(window.dataMap.get('matchmaking-leave'));
    }
    else if (message.type === "error") {
      errorMessage = message.message.split(':')[1];
      if (errorMessage === ' Name Must Be At Least 3 Characters Long')
        errorMessage = window.dataMap.get('too-short-name');
      else if (errorMessage === ' Ensure This Field Has No More Than 20 Characters.')
        errorMessage = window.dataMap.get('too-long-name');
      else if (errorMessage === ' Name Must Be Alphanumeric')
        errorMessage = window.dataMap.get('alphanumeric-name');
      if (message.message === 'You already have an active tournament.')
        errorMessage = window.dataMap.get('already-tournament');
      if (message.message === 'Tournament with this name already exists')
        errorMessage = window.dataMap.get('double-tournament');
      raiseAlert(errorMessage);
    }
    else {
        console.error(message.type);
      }
  }

  window.mmws.onclose = function(event) {
    const isRefreshed = getRefreshToken();
    if (isRefreshed) {
      return initMMWebSocket();
    }
    else {
      quitDesk();
      raiseAlert(window.dataMap.get('expired-session'));
    }
  }
  return window.mmws;
}

document.getElementById('winBook').querySelector('.close-button').addEventListener('click', function() {
  document.getElementById('winBook').style.display = 'none';
});


document.addEventListener("DOMContentLoaded", () => {
  const winBookWindow = document.getElementById("winBook");
  const tabs = winBookWindow.querySelectorAll(".tabs .tab");
  const panes = winBookWindow.querySelectorAll(".tab-content .tab-pane");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panes.forEach((pane) => (pane.style.display = "none"));

      tab.classList.add("active");
      const targetId = tab.dataset.tab;
      const targetPane = winBookWindow.querySelector(`#${targetId}`);
      if (targetPane) {
        targetPane.style.display = "flex";
      } else {
        console.error(`Le contenu de l'onglet #${targetId} est introuvable !`);
      }
    });
  });

  const winSearchInput = winBookWindow.querySelector('#search-tournament');
  const searchButton = winBookWindow.querySelector('#search-button');
  const createTournamentInput = winBookWindow.querySelector('#create-tournament-name');
  const createTournamentButton = document.querySelector('#create-tournament-button');

  createTournamentButton.addEventListener('click', createTournament);
  searchButton.addEventListener('click', showTournament);

  winSearchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      searchButton.click();
    }
  });

  createTournamentInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      createTournamentButton.click();
    }
  });

  const readyButton = winBookWindow.querySelector('#ready-button');
  const quitButton = winBookWindow.querySelector('#quit-button');

  readyButton.addEventListener('click', joinTournament);
  quitButton.addEventListener('click', quitTournament);

  showAllTournaments();
});
