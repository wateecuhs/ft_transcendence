const winBook = document.getElementById('winBook');
const winBookPages = winBook.querySelectorAll('.winBook-page');

const winSearchTournament = winBook.querySelector('#search-button');  // Bouton "Rechercher"
const winSearchInput = winBook.querySelector('#search-tournament');  // Champ de texte pour la recherche
const tournamentResultsList = winBook.querySelector('#tournament-results');  // Liste des résultats

const createTournamentButton = winBook.querySelector('#create-tournament-button');

let currentPageIndex = 0;


let tournaments = [
    { name: 'Tournoi 1', maxPlayers: 4, creator: 'player1', players: [{ name: 'player1', status: 'Ready' }, { name: 'test', status: 'Ready'}] },
    { name: 'Tournoi 2', maxPlayers: 4, creator: 'player2', players: [{ name: 'player2', status: 'Not Ready' }] },
];

function displayTournamentInfo(tournament) {
  console.log("TEST");
  const displayTournament = document.querySelector(".tournament-info");

  if (displayTournament) {
    console.log("TEST_2");
    const tournamentElement = displayTournament.querySelector(".tournament-name");
    if (tournamentElement) {
      tournamentElement.innerHTML = "";
      tournamentElement.textContent = tournament.name; // Utilisation de tournament.name pour afficher le nom
    }

    // Mise à jour du nombre de joueurs
    const playersCountElement = displayTournament.querySelector("#players-count");
    if (playersCountElement) {
      playersCountElement.innerHTML = "";
      playersCountElement.textContent = `Nombre de joueurs : ${tournament.players.length}`;
    }

    // Mise à jour de la liste des joueurs
    const playersList = document.getElementById("players-list"); // Sélectionne la liste des joueurs
    if (playersList) {
      console.log("HERE 2");
      playersList.innerHTML = ""; // Vide la liste avant de la remplir

      // Ajouter chaque joueur à la liste
      tournament.players.forEach(player => {
        const playerItem = document.createElement("li");
        playerItem.classList.add("player");

        const playerName = document.createElement("span");
        playerName.classList.add("player-name");
        playerName.textContent = player.name;

        const playerStatus = document.createElement("span");
        playerStatus.classList.add("player-status");
        playerStatus.textContent = player.status;

        playerItem.appendChild(playerName);
        playerItem.appendChild(playerStatus);

        playersList.appendChild(playerItem);
      });
    }
  } else {
      console.error("Element .tournament-info non trouvé");
  }
}

function showTournament() {
  const query = winSearchInput.value.toLowerCase();
  console.log("Saisie de l'utilisateur :", query);

  const filteredTournaments = tournaments.filter(tournament => {
      console.log("Vérification tournoi :", tournament.name);  // Afficher chaque tournoi pendant la vérification
      return tournament.name.toLowerCase().includes(query);
  });

  console.log("Tournois filtrés :", filteredTournaments);  // Afficher la liste des tournois filtrés

  tournamentResultsList.innerHTML = '';

  if (filteredTournaments.length > 0) {
    filteredTournaments.forEach(tournament => {
      // Créer un bouton pour chaque tournoi
      const button = document.createElement('button');
      button.textContent = `${tournament.name} (Max: ${tournament.maxPlayers} joueurs)`;
      button.classList.add('tournament-button');

      // Ajouter un gestionnaire d'événements sur le bouton
      button.addEventListener('click', function() {
          console.log("Tournoi sélectionné :", tournament.name);
          // Appeler la fonction pour afficher les détails du tournoi
          displayTournamentInfo(tournament);
      });

      // Ajouter le bouton à la liste des résultats
      tournamentResultsList.appendChild(button);
  });
  tournamentResultsList.classList.add('show');
  } else {
      const noResultsItem = document.createElement('li');
      noResultsItem.textContent = 'Aucun tournoi trouvé';
      tournamentResultsList.appendChild(noResultsItem);
      tournamentResultsList.classList.add('show');
  }
}

function addNewTournament() {
  const tournamentNameInput = document.getElementById('new-tournament-name');
  const tournamentName = tournamentNameInput.value.trim();

  if (!tournamentName) {
    alert("Veuillez entrer un nom pour le tournoi");
    return;
  }

  const newTournament = {
    name: tournamentName,
    maxPlayers: 4,
    creator: 'player1',
    players: []
  };

  tournaments.push(newTournament);

  tournamentNameInput.value = '';

  showTournament();
}

winSearchTournament.addEventListener('click', showTournament);
createTournamentButton.addEventListener('click', addNewTournament);

winSearchInput.addEventListener('keypress', function(event) {
  if(event.key == 'Enter') {
    showTournament();
  }
});

function showPage(pageIndex) {
  winBookPages.forEach((page, index) => {
    page.style.display = (index === pageIndex) ? 'block' : 'none';
  });
  currentPageIndex = pageIndex;

  if (pageIndex === 0) {
    history.replaceState({ page: pageIndex }, "", "#winbook");
  } else {
    history.pushState({ page: pageIndex }, "", `#page${pageIndex}`);
  }
}

function toggleWinbookWindow() {
  const winbookWindow = document.getElementById('winBook');
  if (winbookWindow.style.display === 'none') {
    winbookWindow.style.display = 'flex';
    showPage(0);
    history.pushState({ page: "winbook" }, "", "#winbook");
  } else {
    winbookWindow.style.display = 'none';
  }
}

window.addEventListener('popstate', function (event) {
  const currentPage = window.location.hash;

  if (currentPage === "#winbook") {
    toggleWinbookWindow(true);
  } else if (currentPage.startsWith("#page")) {
    const pageIndex = parseInt(currentPage.replace("#page", ""));
    showPage(pageIndex);
  } else if (currentPage === "") {
    toggleWinbookWindow(false);
  }
});

