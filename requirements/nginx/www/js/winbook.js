document.getElementById('winBook').querySelector('.close-button').addEventListener('click', function() {
  document.getElementById('winBook').style.display = 'none';
});

function toggleWinbookWindow() {
  const msnWindow = document.getElementById('winBook');
  if (msnWindow.style.display === 'none') {
    msnWindow.style.display = 'flex';
    msnWindow.style.position = 'absolute';
    msnWindow.style.top = `${window.innerHeight / 2 - msnWindow.offsetHeight / 2}px`;
    msnWindow.style.left = `${window.innerWidth / 2 - msnWindow.offsetWidth / 2}px`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const winBookWindow = document.getElementById("winBook");
  if (!winBookWindow) {
    console.error("L'élément #winBook est introuvable !");
    return;
  }

  const tabs = winBookWindow.querySelectorAll(".tabs .tab");
  const panes = winBookWindow.querySelectorAll(".tab-content .tab-pane");

  if (tabs.length === 0 || panes.length === 0) {
    console.error("Aucun onglet ou contenu d'onglet trouvé !");
    return;
  }

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

  const tournamentResultsList = winBookWindow.querySelector('#tournament-results');
  const winSearchInput = winBookWindow.querySelector('#search-tournament');
  const searchButton = winBookWindow.querySelector('#search-button');

  const tournamentNameElement = winBookWindow.querySelector('#tournament-name');
  const playerListElement = winBookWindow.querySelector('#player-list');
  const readyButton = winBookWindow.querySelector('#ready-button');

  const createTournamentNameInput = document.querySelector('#create-tournament-name');
  const createTournamentButton = document.querySelector('#create-tournament-button');

  createTournamentButton.addEventListener('click', () => {
    const tournamentName = createTournamentNameInput.value.trim();

    if (tournamentName === '') {
      raiseAlert('Veuillez entrer un nom pour le tournoi.', 'error');
      return;
    }

    const newTournament = {
      name: tournamentName,
      maxPlayers: 4,
    };
    ws.send(JSON.stringify({ type: 'tournament.create', data: newTournament }));
    raiseAlert(`Le tournoi "${tournamentName}" a été créé avec succès.`, 'success');
    showTournamentDetails(newTournament);
    createTournamentNameInput.value = '';
  });

  async function showTournamentResults(query) {
    tournamentResultsList.innerHTML = '';
    try {
      const response = await fetch('https://localhost:8443/matchmaking/tournaments/', {
        method: 'GET',
      });

      if (response.ok) {
        const tournaments = await response.json();

        if (tournaments.message === 'No tournaments found.') {
          const noResultsItem = document.createElement('li');
          noResultsItem.textContent = 'Aucun tournoi trouvé';
          tournamentResultsList.appendChild(noResultsItem);
          return ;
        }

        const filteredTournaments = tournaments.filter(tournament =>
          tournament.name.toLowerCase().includes(query.toLowerCase())
        );
        tournamentResultsList.innerHTML = '';

        if (filteredTournaments.length > 0) {
          filteredTournaments.forEach(tournament => {
            const li = document.createElement('li');
            li.textContent = `${tournament.name} (Max: 4 joueurs)`;
            
            li.addEventListener('click', function() {
              raiseAlert(`Vous avez sélectionné ${tournament.name}`);
              showTournamentDetails(tournament);
            });
            
            tournamentResultsList.appendChild(li);
          });
        } else {
          const noResultsItem = document.createElement('li');
          noResultsItem.textContent = 'Aucun tournoi trouvé';
          tournamentResultsList.appendChild(noResultsItem);
        }
      } else {
        console.log('Error: response is not ok in winBook');
      }
    } catch (error) {
      console.log(error);
    }
  }


  async function showAllTournaments() {
    tournamentResultsList.innerHTML = '';
    try {
      const response = await fetch('https://localhost:8443/matchmaking/tournaments/', {
        method: 'GET',
      });

      if (response.ok) {
        const tournaments = await response.json();
        if (tournaments.message === 'No tournaments found.') {
          const noResultsItem = document.createElement('li');
          noResultsItem.textContent = 'Aucun tournoi trouvé';
          tournamentResultsList.appendChild(noResultsItem);
        } else if (tournaments) {
          tournaments.forEach(tournament => {
            const li = document.createElement('li');
            li.textContent = `${tournament.name} (Max: 4 joueurs)`;
      
            li.addEventListener('click', function() {
              raiseAlert(`Vous avez sélectionné ${tournament.name}`);
              showTournamentDetails(tournament);
            });
      
            tournamentResultsList.appendChild(li);
          });
        }
      } else {
        console.log('Error: response is not ok in winbook');
      }
    } catch (error) {
      console.log(error);
    }
  }


  function showTournamentDetails(tournament) {
    tournamentNameElement.textContent = tournament.name;
    playerListElement.innerHTML = '';

    tournament.players.forEach(player => {
      const li = document.createElement('li');
      li.textContent = player;
      playerListElement.appendChild(li);
    });

      readyButton.style.display = 'block';
      readyButton.addEventListener('click', () => {
      raiseAlert(`Vous êtes maintenant prêt pour ${tournament.name}`);
      readyButton.disabled = true;
      readyButton.textContent = 'Vous êtes prêt';
    });
  }

  searchButton.addEventListener('click', () => {
    const query = winSearchInput.value.trim();
    if (query === '') {
      showAllTournaments();
    } else {
      showTournamentResults(query);
    }
  });

  winSearchInput.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
      searchButton.click();
    }
  });

  showAllTournaments();
});

