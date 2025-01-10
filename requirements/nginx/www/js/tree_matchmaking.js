const tournament_data = [
  { round: 1, player_1: 'Alice', result_1: 'win', player_2: 'Bob', result_2: 'lose' },
  { round: 2, player_1: 'Charlie', result_1: 'win', player_2: 'David', result_2: 'lose' },
  { round: 3, player_1: 'Alice', result_1: 'win', player_2: 'Charlie', result_2: 'lose' }
];
let round = 0;

function toogleWindowTree() {
  const winTree = document.getElementById('tree-matchmaking');

  if (winTree.style.display === 'none') {
    winTree.style.display = 'flex';
  } else {
    winTree.style.display = 'none';
  }
}

function createTournamentTree(data) {
  const winTree = document.getElementById('tree-matchmaking');

  const container = document.createElement('div');
  container.classList.add('tournament-tree');

  data.forEach(match => {
    const roundDiv = document.createElement('div');
    roundDiv.classList.add('round');

    const matchDiv = document.createElement('div');
    matchDiv.classList.add('match');

    const roundNb = document.createElement('div');
    roundNb.classList.add('round-nb');
    roundNb.textContent = `Round: ${match.round}`;

    const player1 = document.createElement('div');
    player1.classList.add('player');
    player1.textContent = `${match.player_1} (${match.result_1})`;

    const player2 = document.createElement('div');
    player2.classList.add('player');
    player2.textContent = `${match.player_2} (${match.result_2})`;

    matchDiv.appendChild(roundNb);
    matchDiv.appendChild(player1);
    matchDiv.appendChild(player2);
    roundDiv.appendChild(matchDiv);
    container.appendChild(roundDiv);
  });

  winTree.querySelector('.window-content').appendChild(container);
}

function simulateRound() {
  const winTree = document.getElementById('tree-matchmaking');
  const winContent = winTree.querySelector('.window-content');

  if (round < tournament_data.length) {
    const match = tournament_data[round];
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('match-result');
    resultDiv.textContent = `Round ${match.round}: ${match.player_1} (${match.result_1}) vs ${match.player_2} (${match.result_2})`;
    winContent.appendChild(resultDiv);
    round++;
  } else {
    raiseAlert(`The winner of tournament is ${tournament_data[tournament_data.length - 1].player_1}!`);
    round = 0;
    winContent.innerHTML = '';
    const tournamentButton = document.createElement('button');
    tournamentButton.textContent = 'Simulate Button';
    winContent.appendChild(tournamentButton);
    
    tournamentButton.addEventListener('click', simulateRound);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const winTree = document.getElementById('tree-matchmaking');
  const winContent = winTree.querySelector('.window-content');

  const closeButton = winTree.querySelector('.close-button');
  const tournamentButton = document.createElement('button');
  tournamentButton.textContent = 'Simulate Button';
  winContent.appendChild(tournamentButton);
  
  tournamentButton.addEventListener('click', simulateRound);

  if (closeButton.addEventListener('click', function() {
    toogleWindowTree();
  }));
});
