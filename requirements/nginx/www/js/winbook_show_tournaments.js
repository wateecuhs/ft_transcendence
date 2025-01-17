
function showTournament() {
  const winBookWindow = document.getElementById("winBook");
  const winSearchInput = winBookWindow.querySelector('#search-tournament');
  const query = winSearchInput.value.trim();
  if (query === '') {
    showAllTournaments();
  } else {
    showTournamentResults(query);
  }
}

async function showTournamentResults(query) {
  const winBookWindow = document.getElementById("winBook");
  const tournamentResultsList = winBookWindow.querySelector('#tournament-results');
  tournamentResultsList.innerHTML = '';

  try {
    const response = await fetch(`https://${window.location.host}/matchmaking/tournaments/`, {
      method: 'GET',
    });

    if (response.ok) {
      const tournaments = await response.json();
      tournamentResultsList.innerHTML = '';

      const filteredTournaments = tournaments.filter(tournament =>
        tournament.name.toLowerCase().includes(query.toLowerCase())
      );
      tournamentResultsList.innerHTML = '';

      if (filteredTournaments.length > 0) {
        filteredTournaments.forEach(tournament => function() {
          const li = document.createElement('li');
          if (tournament.status === 'FINISHED')
            li.textContent = `${tournament.name} | ${window.dataMap.get('finished')}`;
          else
            li.textContent = `${tournament.name}`;

          li.addEventListener('click', function() {
            raiseAlert(`${window.dataMap.get('tournament-selected')} ${tournament.name}`);
            const tournamentContent = document.getElementById('tournament-score-id');
            if (tournamentContent) {
              tournamentContent.innerHTML = '';
            } else {
              console.error("Element 'tournament-score-id' introuvable.");
            }
            resetWinBook();
            showTournamentDetails(tournament);
          });

          tournamentResultsList.appendChild(li);
        });
      } else {
        const noResultsItem = document.createElement('li');
        noResultsItem.textContent = window.dataMap.get('no-tournament');
        tournamentResultsList.appendChild(noResultsItem);
      }
    } else {
      console.error('Error: response is not ok in winBook');
    }
  } catch (error) {
    console.error(error);
  }
}

async function showAllTournaments() {
  const winBookWindow = document.getElementById("winBook");
  const tournamentResultsList = winBookWindow.querySelector('#tournament-results');
  tournamentResultsList.innerHTML = '';

  try {
    const response = await fetch(`https://${window.location.host}/matchmaking/tournaments/`, {
      method: 'GET',
    });

    if (response.ok) {
      const tournaments = await response.json();
      if (tournaments.length > 0) {
        tournaments.forEach(tournament => {
          const li = document.createElement('li');
          if (tournament.status === 'FINISHED')
            li.textContent = `${tournament.name} ${window.dataMap.get('max-4-player')} | ${window.dataMap.get('finished')}`;
          else
            li.textContent = `${tournament.name} ${window.dataMap.get('max-4-player')}`;

          li.addEventListener('click', function() {
            resetWinBook();
            raiseAlert(`${window.dataMap.get('tournament-selected')} ${tournament.name}`);
            showTournamentDetails(tournament);
          });

          tournamentResultsList.appendChild(li);
        });
      } else {
        const noResultsItem = document.createElement('li');
        noResultsItem.id = 'no-tournament';
        // noResultsItem.textContent = window.dataMap.get('no-tournament');
        tournamentResultsList.appendChild(noResultsItem);
      }
    } else {
      console.error('Error: response is not ok in winbook');
    }
  } catch (error) {
    console.error(error);
  }
}
