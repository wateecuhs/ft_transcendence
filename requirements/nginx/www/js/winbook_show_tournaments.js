
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
        noResultsItem.textContent = window.dataMap.get('no-tournament');
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
        console.log("tournaments", tournaments);
        tournaments.forEach(tournament => {
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
        noResultsItem.id = 'no-tournament';
        // noResultsItem.textContent = window.dataMap.get('no-tournament');
        tournamentResultsList.appendChild(noResultsItem);
      }
    } else {
      console.log('Error: response is not ok in winbook');
    }
  } catch (error) {
    console.log(error);
  }
}

