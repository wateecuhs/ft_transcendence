function showTournamentDetails(tournament) {
  const winBookWindow = document.getElementById("winBook");
  if (!winBookWindow) {
    console.error("L'élément #winBook est introuvable !");
    return;
  }
  const tournamentNameElement = winBookWindow.querySelector('#tournament-name');
  const playerListElement = winBookWindow.querySelector('#player-list');

  tournamentNameElement.textContent = tournament.name;
  playerListElement.innerHTML = '';
  if (tournament.players) {
    tournament.players.forEach(player => {
      const li = document.createElement('li');
      li.textContent = player;
      playerListElement.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No Player in tournament';
    playerListElement.appendChild(li);
  }
}

function createTournament() {
  const winBookWindow = document.getElementById("winBook");
  const createTournamentNameInput = document.querySelector('#create-tournament-name');
  const tournamentName = createTournamentNameInput.value.trim();
  const readyButton = winBookWindow.querySelector('#ready-button');
  readyButton.disabled = true;
  readyButton.textContent = 'Rejoint';

  if (tournamentName === '') {
    raiseAlert('Veuillez entrer un nom pour le tournoi.', 'error');
    return ;
  }

  const newTournament = { name: tournamentName };

  window.mmws.send(JSON.stringify({ type: 'tournament.create', data: newTournament }));
  createTournamentNameInput.value = '';
}

async function joinTournament() {
  const winBookWindow = document.getElementById("winBook");
  const tournamentNameElement = winBookWindow.querySelector('#tournament-name');
  const tournament_name = tournamentNameElement.textContent;

  try {
    const response = await fetch('https://localhost:8443/matchmaking/tournaments/', {
      method: 'GET',
    });

    if (response.ok) {
      const tournaments = await response.json();
      if (tournaments.length > 0) {
        tournaments.forEach(tournament => {
          if (tournament_name === tournament.name) {
            window.mmws.send(JSON.stringify({ type: 'tournament.join', data: tournament }));
            readyButton.disabled = true;
            readyButton.textContent = 'Rejoint';
            return ;
          }
        });
      }
    } else {
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
}

async function quitTournament() {
  const winBookWindow = document.getElementById("winBook");
  const tournamentNameElement = winBookWindow.querySelector('#tournament-name');
  const tournament_name = tournamentNameElement.textContent;

  try {
    const response = await fetch('https://localhost:8443/matchmaking/tournaments/', {
      method: 'GET',
    });

    if (response.ok) {
      const tournaments = await response.json();
      if (tournaments.length > 0) {
        tournaments.forEach(tournament => {
          if (tournament_name === tournament.name) {
            window.mmws.send(JSON.stringify({ type: 'tournament.leave', data: tournament}));
            resetWinBook();
            return ;
          }
        });
      }
    } else {
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
}

function resetWinBook() {
  const winBookWindow = document.getElementById("winBook");
  const tournamentNameElement = winBookWindow.querySelector('#tournament-name');
  const playerListElement = winBookWindow.querySelector('#player-list');
  const readyButton = winBookWindow.querySelector('#ready-button');

  tournamentNameElement.textContent = 'No Tournament Selected';
  playerListElement.innerHTML = '';
  const li = document.createElement('li');
  li.textContent = 'Empty';
  playerListElement.appendChild(li);
  readyButton.disabled = false;
  readyButton.textContent = 'Join';
}
