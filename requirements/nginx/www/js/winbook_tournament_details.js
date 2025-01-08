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
  if (tournament.players.length === 0) {
    resetWinBook();
    return ;
  }
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
  readyButton.textContent = window.dataMap.get('joined');

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
  const readyButton = winBookWindow.querySelector('#ready-button');

  try {
    const response = await fetch(`https://${window.location.host}/matchmaking/tournaments/`, {
      method: 'GET',
    });

    if (response.ok) {
      const tournaments = await response.json();
      if (tournaments.length > 0) {
        tournaments.forEach(tournament => {
          if (tournament_name === tournament.name) {
            window.mmws.send(JSON.stringify({ type: 'tournament.join', data: tournament }));
            readyButton.disabled = true;
            readyButton.textContent = window.dataMap.get('joined');
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
    const response = await fetch(`https://${window.location.host}/matchmaking/tournaments/`, {
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
  readyButton.textContent = window.dataMap.get('ready-button');
}


function sendPlayersToRooms(tournament) {
  const winBookWindow = document.getElementById("winBook");
  const tournamentContent = winBookWindow.querySelector('#tournament-pane-id');
  const readyButton = winBookWindow.querySelector('#ready-button');
  const quitButton = document.querySelector('#quit-button');

  readyButton.style.display = 'none';
  quitButton.style.display = 'none';

  const rounds = tournament.rounds;
  rounds.forEach(round => {
    if (round.round === "FIRST") {
      const matches = round.matches;
      let i = 1;
      matches.forEach(match => {

        const newData = document.createElement('div');
          const dataMatch = {
            room_code: match.room_code,
            player1: match.player1,
            player2: match.player2
          };
          newData.textContent = `Match ${i} : ${dataMatch.player1} vs ${dataMatch.player2}`;
          tournamentContent.appendChild(newData);
          i += 1;
      });
      matches.forEach(match => {
        if (tournament.author === match.player1 || tournament.author === match.player2) {
          // runRemoteGame(match.room_code);
          let game = new PongWindow("remote", match.room_code);
          game.run();
          return ;
        }
      });
    }
  });
}
