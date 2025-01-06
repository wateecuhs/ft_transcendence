function toggleWinbookWindow() {
  const msnWindow = document.getElementById('winBook');
  if (msnWindow.style.display === 'none') {
    msnWindow.style.display = 'flex';
    msnWindow.style.position = 'absolute';
    msnWindow.style.top = `${window.innerHeight / 2 - msnWindow.offsetHeight / 2}px`;
    msnWindow.style.left = `${window.innerWidth / 2 - msnWindow.offsetWidth / 2}px`;
  }
}

function initMMWebSocket() {
  if (!window.mmws || window.mmws.readyState === WebSocket.CLOSED) {
    window.mmws = new WebSocket(`wss://${window.location.host}/matchmaking/`);
  }

  window.mmws.onmessage = function(event) {
    const message = JSON.parse(event.data);

    if (message.type === "tournament.join") {
      raiseAlert(`Vous êtes maintenant prêt pour ${message.data.name}`);
      showTournamentDetails(message.data);
      
    }
    else if (message.type === "tournament.create") {
      raiseAlert(`Le tournoi "${message.data.name}" a été créé avec succès.`);
      showTournamentDetails(message.data);
    }
    else if (message.type === "tournament.leave") {
      showTournamentDetails(message.data);
    }
    else if (message.type === "tournament.start") {
      const data = {
        author: 'WinBook Corporation',
        content: 'A Tournament is now starting !',
        created_at: new Date().toISOString()
      };
      displayChatMessage(data);
      showPopUp('Tournament is now starting !');
      showTournamentDetails(message.data);
      sendPlayersToRooms(message.data);
    }
    else if (message.type === "tournament.delete") {
      showTournamentDetails(message.data);
    }
    else {
      if (message.message === 'You already have an active tournament.') {
        raiseAlert('You already have an active tournament.');
      }
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
  const createTournamentButton = document.querySelector('#create-tournament-button');

  createTournamentButton.addEventListener('click', createTournament);
  searchButton.addEventListener('click', showTournament);
  
  winSearchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      searchButton.click();
    }
  });

  const readyButton = winBookWindow.querySelector('#ready-button');
  const quitButton = winBookWindow.querySelector('#quit-button');

  readyButton.addEventListener('click', joinTournament);
  quitButton.addEventListener('click', quitTournament);

  showAllTournaments();
});

