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
    tournament.players.forEach(async (player) => {
      const li = document.createElement('li');
      player = await getUserAlias(player);
      li.textContent = player;
      playerListElement.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No Player in tournament';
    playerListElement.appendChild(li);
  }

  const readyButton = winBookWindow.querySelector('#ready-button');
  const quitButton = document.querySelector('#quit-button');

  if (tournament.status === "PLAYING" || tournament.status === "FINISHED") {
    readyButton.style.display = 'none';
    quitButton.style.display = 'none';
    firstRoundResults(tournament);
  } else {
    readyButton.style.display = 'flex';
    quitButton.style.display = 'flex';
  }
}

function createTournament() {
  const winBookWindow = document.getElementById("winBook");
  const createTournamentNameInput = document.querySelector('#create-tournament-name');
  const tournamentName = createTournamentNameInput.value.trim();
  const readyButton = winBookWindow.querySelector('#ready-button');
  
  if (!readyButton) {
    console.error("L'élément #ready-button est introuvable !");
    return;
  }
  
  readyButton.disabled = true;
  readyButton.textContent = window.dataMap.get('joined');

  if (tournamentName === '') {
    raiseAlert('Veuillez entrer un nom pour le tournoi.', 'error');
    return ;
  }
  
  resetWinBook();

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
      console.error(response);
    }
  } catch (error) {
    console.error(error);
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
      console.error(response);
    }
  } catch (error) {
    console.error(error);
  }
}

function resetWinBook() {
  const winBookWindow = document.getElementById("winBook");
  const tournamentNameElement = winBookWindow.querySelector('#tournament-name');
  const playerListElement = winBookWindow.querySelector('#player-list');
  const readyButton = winBookWindow.querySelector('#ready-button');
  const quitButton = document.querySelector('#quit-button');

  const tournamentContent = document.getElementById('tournament-score-id');
  if (tournamentContent) {
    tournamentContent.innerHTML = '';
  } else {
    console.error("Element 'tournament-score-id' introuvable.");
  }

  tournamentNameElement.textContent = 'No Tournament Selected';
  playerListElement.innerHTML = '';
  const li = document.createElement('li');
  li.textContent = 'Empty';
  playerListElement.appendChild(li);

  readyButton.style.display = 'flex';
  quitButton.style.display = 'flex';

  readyButton.disabled = false;
  readyButton.textContent = window.dataMap.get('ready-button');
}


async function sendPlayersToRooms(tournament) {
  const winBookWindow = document.getElementById("winBook");
  const tournamentContent = winBookWindow.querySelector('#tournament-score-id');
  const readyButton = winBookWindow.querySelector('#ready-button');
  const quitButton = document.querySelector('#quit-button');

  readyButton.style.display = 'none';
  quitButton.style.display = 'none';

  const rounds = tournament.rounds;
  tournamentContent.innerHTML = '';

  firstRoundResults(tournament);
  rounds.forEach( async (round) => {
    if (round.round === "FIRST") {
      const matches = round.matches;
      matches.forEach(match => {
        if ((tournament.author === match.player1 || tournament.author === match.player2)) {
          let game = new PongWindow("remote", match.room_code);
          game.run();
          return ;
        }
      });
    } else if (round.round === "FINAL") {
      const matches = round.matches;
      matches.forEach(match => {
        if ((tournament.author === match.player1 || tournament.author === match.player2)) {
          let game = new PongWindow("remote", match.room_code);
          game.run();
          return ;
        }
      });
    }
  });
}

function firstRoundResults(tournament) {
  const winBookWindow = document.getElementById("winBook");
  const tournamentContent = winBookWindow.querySelector('#tournament-score-id');
  tournamentContent.innerHTML = '';
  let i = 1;

  const processPromise = (async () => {
      for (const round of tournament.rounds) {
          await Promise.all(round.matches.map(async (match) => {
              const newData = document.createElement('div');
              
              const dataMatch = {
                  room_code: match.room_code,
                  player1: match.player1,
                  player2: match.player2,
                  ...(match.status === "FINISHED" && { score: match.score })
              };

              const [alias_1, alias_2] = await Promise.all([
                  getUserAlias(dataMatch.player1),
                  getUserAlias(dataMatch.player2)
              ]);

              if (match.status === "FINISHED") {
                  newData.innerHTML = `Match ${round.round === "FIRST" ? i : "FINAL"} : <b>${alias_1}</b> vs <b>${alias_2}</b>: ${dataMatch.score[0]} - ${dataMatch.score[1]}`;
              } else {
                  newData.innerHTML = `Match ${round.round === "FIRST" ? i : "FINAL"} : <b>${alias_1}</b> vs <b>${alias_2}</b>`;
              }

              tournamentContent.appendChild(newData);
              i += 1;
          }));
      }
  })();

  processPromise.catch(error => {
      console.error('Error processing tournament results:', error);
  });
  return processPromise;
}
