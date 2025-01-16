function updateTime() {
  const timeElement = document.querySelector('.time');
  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const formattedHours = hours % 12 || 12;

  const timeText = `${formattedHours}:${minutes} ${ampm}`;
  let textSpan = timeElement.querySelector('.time-text');

  if (!textSpan) {
      textSpan = document.createElement('span');
      textSpan.className = 'time-text';
      timeElement.appendChild(textSpan);
  }

  textSpan.innerHTML = '';
  textSpan.textContent = timeText;
}

function toogleLanguageChoices() {
  const languages = document.querySelector('.language-choices');

  if (languages.style.display === 'none' || languages.style.display === '') {
    languages.style.display = 'inline-block';

    const choices = languages.querySelectorAll('ul li');
    choices.forEach((choice, index) => {
      choice.classList.remove('slide-flag-up');
      choice.classList.add('slide-flag-up');
    });
  } else {
    languages.style.display = 'none';
  }

  const choices = languages.querySelectorAll('ul li');
  choices.forEach(choice => {
    const divFlag = choice.querySelector('div');

    divFlag.addEventListener('click', function() {
      if (divFlag.id === 'france-flag') {
        window.dict = 'fr-dict.txt';
        fetch(window.dict)
          .then(response => response.text())
          .then(text => {
            let file = text.split('\n');
            window.dataMap = null;
            window.dataMap = new Map();
            for (let line of file) {
              let lineSplit = line.split('=');
              window.dataMap.set(lineSplit[0], lineSplit[1]);
            }
            document.getElementById('login-title').textContent = window.dataMap.get('login-title');
            document.getElementById('sign-in-button').textContent = window.dataMap.get('sign-in-button');
            document.getElementById('button-sign-up-page').textContent = window.dataMap.get('button-sign-up-page');
            document.getElementById('button-register-page').textContent = window.dataMap.get('button-register-page');
            document.getElementById('button-login-42').textContent = window.dataMap.get('button-login-42');
            document.getElementById('sign-in-username').placeholder = window.dataMap.get('sign-in-username');
            document.getElementById('sign-in-password').placeholder = window.dataMap.get('sign-in-password');
            document.getElementById('sign-up-username').placeholder = window.dataMap.get('sign-up-username');
            document.getElementById('sign-up-email').placeholder = window.dataMap.get('sign-up-email');
            document.getElementById('sign-up-password').placeholder = window.dataMap.get('sign-up-password');
            document.getElementById('sign-up-confirm-password').placeholder = window.dataMap.get('sign-up-confirm-password');
            document.getElementById('2fa-sign').textContent = window.dataMap.get('2fa-sign');
            document.getElementById('2fa-text').textContent = window.dataMap.get('2fa-text');
            document.getElementById('2fa-button').textContent = window.dataMap.get('2fa-button');
            document.getElementById('desktop').textContent = window.dataMap.get('desktop');
            document.getElementById('account').textContent = window.dataMap.get('account');
            document.getElementById('settings').textContent = window.dataMap.get('settings');
            document.getElementById('quit').textContent = window.dataMap.get('quit');
            document.getElementById('application-explorer').textContent = window.dataMap.get('application-explorer');
            document.getElementById('account-window').textContent = window.dataMap.get('account-window');
            document.getElementById('update-profile').textContent = window.dataMap.get('update-profile');
            document.getElementById('user-stats').textContent = window.dataMap.get('user-stats');
            const userFriends = document.getElementById('user-friends');
            if (userFriends != null)
              userFriends.textContent = window.dataMap.get('user-friends');
            document.getElementById('profile-account').textContent = window.dataMap.get('profile-account');
            document.getElementById('profile-alias').placeholder = window.dataMap.get('profile-alias');
            document.getElementById('profile-email').placeholder = window.dataMap.get('profile-email');
            document.getElementById('profile-old-password').placeholder = window.dataMap.get('profile-old-password');
            document.getElementById('profile-password').placeholder = window.dataMap.get('profile-password');
            document.getElementById('profile-confirm-password').placeholder = window.dataMap.get('profile-confirm-password');
            document.getElementById('update-button').textContent = window.dataMap.get('update-button');
            document.getElementById('friend-account').textContent = window.dataMap.get('friend-account');
            document.getElementById('activate-2fa-text').textContent = window.dataMap.get('activate-2fa-text');
            document.getElementById('enter-code').placeholder = window.dataMap.get('enter-code');
            document.getElementById('validate-qr-code-id').textContent = window.dataMap.get('validate-qr-code-id');
            document.getElementById('desktop-image').textContent = window.dataMap.get('desktop-image');
            document.getElementById('trash').textContent = window.dataMap.get('trash');
            document.getElementById('general').textContent = window.dataMap.get('general');
            document.getElementById('add-friends').textContent = window.dataMap.get('add-friends');
            document.getElementById('search-friends').placeholder = window.dataMap.get('search-friends');
            document.getElementById('type-message').placeholder = window.dataMap.get('type-message');
            document.getElementById('send').textContent = window.dataMap.get('send');
            document.getElementById('client-info').textContent = window.dataMap.get('client-info');
            document.getElementById('client-msg').textContent = window.dataMap.get('client-msg');
            document.getElementById('winbook-title').textContent = window.dataMap.get('winbook-title');
            document.getElementById('search').textContent = window.dataMap.get('search');
            document.getElementById('create').textContent = window.dataMap.get('create');
            document.getElementById('search-button').textContent = window.dataMap.get('search-button');
            document.getElementById('search-tournament').placeholder = window.dataMap.get('search-tournament');
            document.getElementById('create-tournament-name').placeholder = window.dataMap.get('create-tournament-name');
            document.getElementById('create-tournament-button').textContent = window.dataMap.get('create-tournament-button');
            const tournamentName = document.getElementById('tournament-name').textContent;
            if (tournamentName == 'Aucun Tournoi Sélectionné' || tournamentName == 'Nenhum torneio selecionado' || tournamentName == 'No Tournament Selected')
              document.getElementById('tournament-name').textContent = window.dataMap.get('tournament-name');
            const emptyData = document.getElementById('empty');
            if (emptyData != null)
              emptyData.textContent = window.dataMap.get('empty');
            document.getElementById('ready-button').textContent = window.dataMap.get('ready-button');
            document.getElementById('quit-button').textContent = window.dataMap.get('quit-button');
            document.getElementById('game').textContent = window.dataMap.get('game');
            document.getElementById('game-options').textContent = window.dataMap.get('game-options');
            document.getElementById('choose-option').textContent = window.dataMap.get('choose-option');
            document.getElementById('ai-button').textContent = window.dataMap.get('ai-button');
            document.getElementById('local-button').textContent = window.dataMap.get('local-button');
            document.getElementById('join-room').textContent = window.dataMap.get('join-room');
            document.getElementById('game-over-txt').textContent = window.dataMap.get('game-over-txt');
            document.getElementById('game-over-quit').textContent = window.dataMap.get('game-over-quit');
            document.getElementById('start-button').textContent = window.dataMap.get('start-button');
            const noTournament = document.getElementById('no-tournament');
            if (noTournament != null)
              noTournament.textContent = window.dataMap.get('no-tournament');
            document.getElementById('client-invite').textContent = window.dataMap.get('client-invite');
            document.getElementById('join-room-title').textContent = window.dataMap.get('join-room-title');
            document.getElementById('join-room-text').textContent = window.dataMap.get('join-room-text');
            document.getElementById('join-input-id').placeholder = window.dataMap.get('join-input-id');
            document.getElementById('join-room-button-id').textContent = window.dataMap.get('validate-qr-code-id');
            document.getElementById('friend-stat').textContent = window.dataMap.get('friend-stat');
            if (window.matchmaking) {
              document.getElementById('launch-matchmaking').textContent = window.dataMap.get('launch-matchmaking');
            } else {
              document.getElementById('launch-matchmaking').textContent = window.dataMap.get('stop-matchmaking');
            }
            const trashExplorer = document.getElementById('trash-explorer');
            if (trashExplorer)
              trashExplorer.textContent = window.dataMap.get('trash');
            const desktopExplorer = document.getElementById('desktop-explorer');
            if (desktopExplorer)
              desktopExplorer.textContent = window.dataMap.get('desktop');
            document.getElementById('trash-bin-title').textContent = window.dataMap.get('trash');
            document.getElementById('user-history').textContent = window.dataMap.get('user-match-history');
            document.getElementById('help').textContent = window.dataMap.get('help');
            document.getElementById('invite-help').textContent = window.dataMap.get('invite-help');
            document.getElementById('add-help').textContent = window.dataMap.get('add-help');
            document.getElementById('accept-help').textContent = window.dataMap.get('accept-help');
            document.getElementById('remove-help').textContent = window.dataMap.get('remove-help');
            document.getElementById('block-help').textContent = window.dataMap.get('block-help');
            document.getElementById('w-help').textContent = window.dataMap.get('w-help');
          });

          const flagIcon = document.querySelector('.flag-icon');
          if (flagIcon) {
            flagIcon.style.background = "url('../img/france_flag.png')";
            flagIcon.style.backgroundSize = "contain";
            flagIcon.style.backgroundRepeat = "no-repeat";
            flagIcon.style.backgroundPosition = "center";
            flagIcon.style.width = "32px";
            flagIcon.style.height = "32px";
          }

          raiseAlert("Langue changée vers le Français");
          updateUserInfo();
          updateUserStat();
        const requestData = {
            language: 'fr',
          };
          const response = fetch('/auth/language/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getTokenCookie()}`,
            },
            body: JSON.stringify(requestData),
          });
      } else if (divFlag.id === 'england-flag') {
        window.dict = 'en-dict.txt';
        fetch(window.dict)
          .then(response => response.text())
          .then(text => {
            let file = text.split('\n');
            window.dataMap = null;
            window.dataMap = new Map();
            for (let line of file) {
              let lineSplit = line.split('=');
              window.dataMap.set(lineSplit[0], lineSplit[1]);
            }
            document.getElementById('login-title').textContent = window.dataMap.get('login-title');
            document.getElementById('sign-in-button').textContent = window.dataMap.get('sign-in-button');
            document.getElementById('button-sign-up-page').textContent = window.dataMap.get('button-sign-up-page');
            document.getElementById('button-register-page').textContent = window.dataMap.get('button-register-page');
            document.getElementById('button-login-42').textContent = window.dataMap.get('button-login-42');
            document.getElementById('sign-in-username').placeholder = window.dataMap.get('sign-in-username');
            document.getElementById('sign-in-password').placeholder = window.dataMap.get('sign-in-password');
            document.getElementById('sign-up-username').placeholder = window.dataMap.get('sign-up-username');
            document.getElementById('sign-up-email').placeholder = window.dataMap.get('sign-up-email');
            document.getElementById('sign-up-password').placeholder = window.dataMap.get('sign-up-password');
            document.getElementById('sign-up-confirm-password').placeholder = window.dataMap.get('sign-up-confirm-password');
            document.getElementById('2fa-sign').textContent = window.dataMap.get('2fa-sign');
            document.getElementById('2fa-text').textContent = window.dataMap.get('2fa-text');
            document.getElementById('2fa-button').textContent = window.dataMap.get('2fa-button');
            document.getElementById('desktop').textContent = window.dataMap.get('desktop');
            document.getElementById('account').textContent = window.dataMap.get('account');
            document.getElementById('settings').textContent = window.dataMap.get('settings');
            document.getElementById('quit').textContent = window.dataMap.get('quit');
            document.getElementById('application-explorer').textContent = window.dataMap.get('application-explorer');
            document.getElementById('account-window').textContent = window.dataMap.get('account-window');
            document.getElementById('update-profile').textContent = window.dataMap.get('update-profile');
            document.getElementById('user-stats').textContent = window.dataMap.get('user-stats');
            const userFriends = document.getElementById('user-friends');
            if (userFriends != null)
              userFriends.textContent = window.dataMap.get('user-friends');
            document.getElementById('profile-account').textContent = window.dataMap.get('profile-account');
            document.getElementById('profile-alias').placeholder = window.dataMap.get('profile-alias');
            document.getElementById('profile-email').placeholder = window.dataMap.get('profile-email');
            document.getElementById('profile-old-password').placeholder = window.dataMap.get('profile-old-password');
            document.getElementById('profile-password').placeholder = window.dataMap.get('profile-password');
            document.getElementById('profile-confirm-password').placeholder = window.dataMap.get('profile-confirm-password');
            document.getElementById('update-button').textContent = window.dataMap.get('update-button');
            document.getElementById('friend-account').textContent = window.dataMap.get('friend-account');
            document.getElementById('activate-2fa-text').textContent = window.dataMap.get('activate-2fa-text');
            document.getElementById('enter-code').placeholder = window.dataMap.get('enter-code');
            document.getElementById('validate-qr-code-id').textContent = window.dataMap.get('validate-qr-code-id');
            document.getElementById('desktop-image').textContent = window.dataMap.get('desktop-image');
            document.getElementById('trash').textContent = window.dataMap.get('trash');
            document.getElementById('general').textContent = window.dataMap.get('general');
            document.getElementById('add-friends').textContent = window.dataMap.get('add-friends');
            document.getElementById('search-friends').placeholder = window.dataMap.get('search-friends');
            document.getElementById('type-message').placeholder = window.dataMap.get('type-message');
            document.getElementById('send').textContent = window.dataMap.get('send');
            document.getElementById('client-info').textContent = window.dataMap.get('client-info');
            document.getElementById('client-msg').textContent = window.dataMap.get('client-msg');
            document.getElementById('winbook-title').textContent = window.dataMap.get('winbook-title');
            document.getElementById('search').textContent = window.dataMap.get('search');
            document.getElementById('create').textContent = window.dataMap.get('create');
            document.getElementById('search-button').textContent = window.dataMap.get('search-button');
            document.getElementById('search-tournament').placeholder = window.dataMap.get('search-tournament');
            document.getElementById('create-tournament-name').placeholder = window.dataMap.get('create-tournament-name');
            document.getElementById('create-tournament-button').textContent = window.dataMap.get('create-tournament-button');
            const tournamentName = document.getElementById('tournament-name').textContent;
            if (tournamentName == 'Aucun Tournoi Sélectionné' || tournamentName == 'Nenhum torneio selecionado' || tournamentName == 'No Tournament Selected')
              document.getElementById('tournament-name').textContent = window.dataMap.get('tournament-name');
            const emptyData = document.getElementById('empty');
            if (emptyData != null)
              emptyData.textContent = window.dataMap.get('empty');
            document.getElementById('ready-button').textContent = window.dataMap.get('ready-button');
            document.getElementById('quit-button').textContent = window.dataMap.get('quit-button');
            document.getElementById('game').textContent = window.dataMap.get('game');
            document.getElementById('game-options').textContent = window.dataMap.get('game-options');
            document.getElementById('choose-option').textContent = window.dataMap.get('choose-option');
            document.getElementById('ai-button').textContent = window.dataMap.get('ai-button');
            document.getElementById('local-button').textContent = window.dataMap.get('local-button');
            document.getElementById('join-room').textContent = window.dataMap.get('join-room');
            document.getElementById('game-over-txt').textContent = window.dataMap.get('game-over-txt');
            document.getElementById('game-over-quit').textContent = window.dataMap.get('game-over-quit');
            document.getElementById('start-button').textContent = window.dataMap.get('start-button');
            const noTournament = document.getElementById('no-tournament');
            if (noTournament != null)
              noTournament.textContent = window.dataMap.get('no-tournament');
            document.getElementById('client-invite').textContent = window.dataMap.get('client-invite');
            document.getElementById('join-room-title').textContent = window.dataMap.get('join-room-title');
            document.getElementById('join-room-text').textContent = window.dataMap.get('join-room-text');
            document.getElementById('join-input-id').placeholder = window.dataMap.get('join-input-id');
            document.getElementById('join-room-button-id').textContent = window.dataMap.get('validate-qr-code-id');
            document.getElementById('friend-stat').textContent = window.dataMap.get('friend-stat');
            if (window.matchmaking) {
              document.getElementById('launch-matchmaking').textContent = window.dataMap.get('launch-matchmaking');
            } else {
              document.getElementById('launch-matchmaking').textContent = window.dataMap.get('stop-matchmaking');
            }
            const trashExplorer = document.getElementById('trash-explorer');
            if (trashExplorer)
              trashExplorer.textContent = window.dataMap.get('trash');
            const desktopExplorer = document.getElementById('desktop-explorer');
            if (desktopExplorer)
              desktopExplorer.textContent = window.dataMap.get('desktop');
            document.getElementById('trash-bin-title').textContent = window.dataMap.get('trash');
            document.getElementById('user-history').textContent = window.dataMap.get('user-match-history');
            document.getElementById('help').textContent = window.dataMap.get('help');
            document.getElementById('invite-help').textContent = window.dataMap.get('invite-help');
            document.getElementById('add-help').textContent = window.dataMap.get('add-help');
            document.getElementById('accept-help').textContent = window.dataMap.get('accept-help');
            document.getElementById('remove-help').textContent = window.dataMap.get('remove-help');
            document.getElementById('block-help').textContent = window.dataMap.get('block-help');
            document.getElementById('w-help').textContent = window.dataMap.get('w-help');
          });

          const flagIcon = document.querySelector('.flag-icon');
          if (flagIcon) {
            flagIcon.style.background = "url('../img/uk_flag.png')";
            flagIcon.style.backgroundSize = "contain";
            flagIcon.style.backgroundRepeat = "no-repeat";
            flagIcon.style.backgroundPosition = "center";
            flagIcon.style.width = "32px";
            flagIcon.style.height = "32px";
          }

          raiseAlert("Language changed to English");
          updateUserInfo();
          updateUserStat();
        const requestData = {
            language: 'en',
          };
          const response = fetch('/auth/language/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getTokenCookie()}`,
            },
            body: JSON.stringify(requestData),
          });
      } else if (divFlag.id === 'portugal-flag') {
        window.dict = 'pt-dict.txt';
        fetch(window.dict)
          .then(response => response.text())
          .then(text => {
            let file = text.split('\n');
            window.dataMap = null;
            window.dataMap = new Map();
            for (let line of file) {
              let lineSplit = line.split('=');
              window.dataMap.set(lineSplit[0], lineSplit[1]);
            }
            document.getElementById('login-title').textContent = window.dataMap.get('login-title');
            document.getElementById('sign-in-button').textContent = window.dataMap.get('sign-in-button');
            document.getElementById('button-sign-up-page').textContent = window.dataMap.get('button-sign-up-page');
            document.getElementById('button-register-page').textContent = window.dataMap.get('button-register-page');
            document.getElementById('button-login-42').textContent = window.dataMap.get('button-login-42');
            document.getElementById('sign-in-username').placeholder = window.dataMap.get('sign-in-username');
            document.getElementById('sign-in-password').placeholder = window.dataMap.get('sign-in-password');
            document.getElementById('sign-up-username').placeholder = window.dataMap.get('sign-up-username');
            document.getElementById('sign-up-email').placeholder = window.dataMap.get('sign-up-email');
            document.getElementById('sign-up-password').placeholder = window.dataMap.get('sign-up-password');
            document.getElementById('sign-up-confirm-password').placeholder = window.dataMap.get('sign-up-confirm-password');
            document.getElementById('2fa-sign').textContent = window.dataMap.get('2fa-sign');
            document.getElementById('2fa-text').textContent = window.dataMap.get('2fa-text');
            document.getElementById('2fa-button').textContent = window.dataMap.get('2fa-button');
            document.getElementById('desktop').textContent = window.dataMap.get('desktop');
            document.getElementById('account').textContent = window.dataMap.get('account');
            document.getElementById('settings').textContent = window.dataMap.get('settings');
            document.getElementById('quit').textContent = window.dataMap.get('quit');
            document.getElementById('application-explorer').textContent = window.dataMap.get('application-explorer');
            document.getElementById('account-window').textContent = window.dataMap.get('account-window');
            document.getElementById('update-profile').textContent = window.dataMap.get('update-profile');
            document.getElementById('user-stats').textContent = window.dataMap.get('user-stats');
            const userFriends = document.getElementById('user-friends');
            if (userFriends != null)
              userFriends.textContent = window.dataMap.get('user-friends');
            document.getElementById('profile-account').textContent = window.dataMap.get('profile-account');
            document.getElementById('profile-alias').placeholder = window.dataMap.get('profile-alias');
            document.getElementById('profile-email').placeholder = window.dataMap.get('profile-email');
            document.getElementById('profile-old-password').placeholder = window.dataMap.get('profile-old-password');
            document.getElementById('profile-password').placeholder = window.dataMap.get('profile-password');
            document.getElementById('profile-confirm-password').placeholder = window.dataMap.get('profile-confirm-password');
            document.getElementById('update-button').textContent = window.dataMap.get('update-button');
            document.getElementById('friend-account').textContent = window.dataMap.get('friend-account');
            document.getElementById('activate-2fa-text').textContent = window.dataMap.get('activate-2fa-text');
            document.getElementById('enter-code').placeholder = window.dataMap.get('enter-code');
            document.getElementById('validate-qr-code-id').textContent = window.dataMap.get('validate-qr-code-id');
            document.getElementById('desktop-image').textContent = window.dataMap.get('desktop-image');
            document.getElementById('trash').textContent = window.dataMap.get('trash');
            document.getElementById('general').textContent = window.dataMap.get('general');
            document.getElementById('add-friends').textContent = window.dataMap.get('add-friends');
            document.getElementById('search-friends').placeholder = window.dataMap.get('search-friends');
            document.getElementById('type-message').placeholder = window.dataMap.get('type-message');
            document.getElementById('send').textContent = window.dataMap.get('send');
            document.getElementById('client-info').textContent = window.dataMap.get('client-info');
            document.getElementById('client-msg').textContent = window.dataMap.get('client-msg');
            document.getElementById('winbook-title').textContent = window.dataMap.get('winbook-title');
            document.getElementById('search').textContent = window.dataMap.get('search');
            document.getElementById('create').textContent = window.dataMap.get('create');
            document.getElementById('search-button').textContent = window.dataMap.get('search-button');
            document.getElementById('search-tournament').placeholder = window.dataMap.get('search-tournament');
            document.getElementById('create-tournament-name').placeholder = window.dataMap.get('create-tournament-name');
            document.getElementById('create-tournament-button').textContent = window.dataMap.get('create-tournament-button');
            const tournamentName = document.getElementById('tournament-name').textContent;
            if (tournamentName == 'Aucun Tournoi Sélectionné' || tournamentName == 'Nenhum torneio selecionado' || tournamentName == 'No Tournament Selected')
              document.getElementById('tournament-name').textContent = window.dataMap.get('tournament-name');
            const emptyData = document.getElementById('empty');
            if (emptyData != null)
              emptyData.textContent = window.dataMap.get('empty');
            document.getElementById('ready-button').textContent = window.dataMap.get('ready-button');
            document.getElementById('quit-button').textContent = window.dataMap.get('quit-button');
            document.getElementById('game').textContent = window.dataMap.get('game');
            document.getElementById('game-options').textContent = window.dataMap.get('game-options');
            document.getElementById('choose-option').textContent = window.dataMap.get('choose-option');
            document.getElementById('ai-button').textContent = window.dataMap.get('ai-button');
            document.getElementById('local-button').textContent = window.dataMap.get('local-button');
            document.getElementById('join-room').textContent = window.dataMap.get('join-room');
            document.getElementById('game-over-txt').textContent = window.dataMap.get('game-over-txt');
            document.getElementById('game-over-quit').textContent = window.dataMap.get('game-over-quit');
            document.getElementById('start-button').textContent = window.dataMap.get('start-button');
            const noTournament = document.getElementById('no-tournament');
            if (noTournament != null)
              noTournament.textContent = window.dataMap.get('no-tournament');
            document.getElementById('client-invite').textContent = window.dataMap.get('client-invite');
            document.getElementById('join-room-title').textContent = window.dataMap.get('join-room-title');
            document.getElementById('join-room-text').textContent = window.dataMap.get('join-room-text');
            document.getElementById('join-input-id').placeholder = window.dataMap.get('join-input-id');
            document.getElementById('join-room-button-id').textContent = window.dataMap.get('validate-qr-code-id');
            document.getElementById('friend-stat').textContent = window.dataMap.get('friend-stat');
            if (window.matchmaking) {
              document.getElementById('launch-matchmaking').textContent = window.dataMap.get('launch-matchmaking');
            } else {
              document.getElementById('launch-matchmaking').textContent = window.dataMap.get('stop-matchmaking');
            }
            const trashExplorer = document.getElementById('trash-explorer');
            if (trashExplorer)
              trashExplorer.textContent = window.dataMap.get('trash');
            const desktopExplorer = document.getElementById('desktop-explorer');
            if (desktopExplorer)
              desktopExplorer.textContent = window.dataMap.get('desktop');
            document.getElementById('trash-bin-title').textContent = window.dataMap.get('trash');
            document.getElementById('user-history').textContent = window.dataMap.get('user-match-history');
            document.getElementById('help').textContent = window.dataMap.get('help');
            document.getElementById('invite-help').textContent = window.dataMap.get('invite-help');
            document.getElementById('add-help').textContent = window.dataMap.get('add-help');
            document.getElementById('accept-help').textContent = window.dataMap.get('accept-help');
            document.getElementById('remove-help').textContent = window.dataMap.get('remove-help');
            document.getElementById('block-help').textContent = window.dataMap.get('block-help');
            document.getElementById('w-help').textContent = window.dataMap.get('w-help');
          });

          const flagIcon = document.querySelector('.flag-icon');
          if (flagIcon) {
            flagIcon.style.background = "url('../img/portugal_flag.png')";
            flagIcon.style.backgroundSize = "contain";
            flagIcon.style.backgroundRepeat = "no-repeat";
            flagIcon.style.backgroundPosition = "center";
            flagIcon.style.width = "32px";
            flagIcon.style.height = "32px";
          }

          raiseAlert("Idioma alterado para português");
          updateUserInfo();
          updateUserStat();
        const requestData = {
            language: 'pt',
          };
          const response = fetch('/auth/language/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getTokenCookie()}`,
            },
            body: JSON.stringify(requestData),
          });
      } else if (divFlag.id === 'russia-flag') {
        window.dict = 'ru-dict.txt';
        fetch(window.dict)
          .then(response => response.text())
          .then(text => {
            let file = text.split('\n');
            window.dataMap = null;
            window.dataMap = new Map();
            for (let line of file) {
              let lineSplit = line.split('=');
              window.dataMap.set(lineSplit[0], lineSplit[1]);
            }
            document.getElementById('login-title').textContent = window.dataMap.get('login-title');
            document.getElementById('sign-in-button').textContent = window.dataMap.get('sign-in-button');
            document.getElementById('button-sign-up-page').textContent = window.dataMap.get('button-sign-up-page');
            document.getElementById('button-register-page').textContent = window.dataMap.get('button-register-page');
            document.getElementById('button-login-42').textContent = window.dataMap.get('button-login-42');
            document.getElementById('sign-in-username').placeholder = window.dataMap.get('sign-in-username');
            document.getElementById('sign-in-password').placeholder = window.dataMap.get('sign-in-password');
            document.getElementById('sign-up-username').placeholder = window.dataMap.get('sign-up-username');
            document.getElementById('sign-up-email').placeholder = window.dataMap.get('sign-up-email');
            document.getElementById('sign-up-password').placeholder = window.dataMap.get('sign-up-password');
            document.getElementById('sign-up-confirm-password').placeholder = window.dataMap.get('sign-up-confirm-password');
            document.getElementById('2fa-sign').textContent = window.dataMap.get('2fa-sign');
            document.getElementById('2fa-text').textContent = window.dataMap.get('2fa-text');
            document.getElementById('2fa-button').textContent = window.dataMap.get('2fa-button');
            document.getElementById('desktop').textContent = window.dataMap.get('desktop');
            document.getElementById('account').textContent = window.dataMap.get('account');
            document.getElementById('settings').textContent = window.dataMap.get('settings');
            document.getElementById('quit').textContent = window.dataMap.get('quit');
            document.getElementById('application-explorer').textContent = window.dataMap.get('application-explorer');
            document.getElementById('account-window').textContent = window.dataMap.get('account-window');
            document.getElementById('update-profile').textContent = window.dataMap.get('update-profile');
            document.getElementById('user-stats').textContent = window.dataMap.get('user-stats');
            const userFriends = document.getElementById('user-friends');
            if (userFriends != null)
              userFriends.textContent = window.dataMap.get('user-friends');
            document.getElementById('profile-account').textContent = window.dataMap.get('profile-account');
            document.getElementById('profile-alias').placeholder = window.dataMap.get('profile-alias');
            document.getElementById('profile-email').placeholder = window.dataMap.get('profile-email');
            document.getElementById('profile-old-password').placeholder = window.dataMap.get('profile-old-password');
            document.getElementById('profile-password').placeholder = window.dataMap.get('profile-password');
            document.getElementById('profile-confirm-password').placeholder = window.dataMap.get('profile-confirm-password');
            document.getElementById('update-button').textContent = window.dataMap.get('update-button');
            document.getElementById('friend-account').textContent = window.dataMap.get('friend-account');
            document.getElementById('activate-2fa-text').textContent = window.dataMap.get('activate-2fa-text');
            document.getElementById('enter-code').placeholder = window.dataMap.get('enter-code');
            document.getElementById('validate-qr-code-id').textContent = window.dataMap.get('validate-qr-code-id');
            document.getElementById('desktop-image').textContent = window.dataMap.get('desktop-image');
            document.getElementById('trash').textContent = window.dataMap.get('trash');
            document.getElementById('general').textContent = window.dataMap.get('general');
            document.getElementById('add-friends').textContent = window.dataMap.get('add-friends');
            document.getElementById('search-friends').placeholder = window.dataMap.get('search-friends');
            document.getElementById('type-message').placeholder = window.dataMap.get('type-message');
            document.getElementById('send').textContent = window.dataMap.get('send');
            document.getElementById('client-info').textContent = window.dataMap.get('client-info');
            document.getElementById('client-msg').textContent = window.dataMap.get('client-msg');
            document.getElementById('winbook-title').textContent = window.dataMap.get('winbook-title');
            document.getElementById('search').textContent = window.dataMap.get('search');
            document.getElementById('create').textContent = window.dataMap.get('create');
            document.getElementById('search-button').textContent = window.dataMap.get('search-button');
            document.getElementById('search-tournament').placeholder = window.dataMap.get('search-tournament');
            document.getElementById('create-tournament-name').placeholder = window.dataMap.get('create-tournament-name');
            document.getElementById('create-tournament-button').textContent = window.dataMap.get('create-tournament-button');
            const tournamentName = document.getElementById('tournament-name').textContent;
            if (tournamentName == 'Aucun Tournoi Sélectionné' || tournamentName == 'Nenhum torneio selecionado' || tournamentName == 'No Tournament Selected')
              document.getElementById('tournament-name').textContent = window.dataMap.get('tournament-name');
            const emptyData = document.getElementById('empty');
            if (emptyData != null)
              emptyData.textContent = window.dataMap.get('empty');
            document.getElementById('ready-button').textContent = window.dataMap.get('ready-button');
            document.getElementById('quit-button').textContent = window.dataMap.get('quit-button');
            document.getElementById('game').textContent = window.dataMap.get('game');
            document.getElementById('game-options').textContent = window.dataMap.get('game-options');
            document.getElementById('choose-option').textContent = window.dataMap.get('choose-option');
            document.getElementById('ai-button').textContent = window.dataMap.get('ai-button');
            document.getElementById('local-button').textContent = window.dataMap.get('local-button');
            document.getElementById('join-room').textContent = window.dataMap.get('join-room');
            document.getElementById('game-over-txt').textContent = window.dataMap.get('game-over-txt');
            document.getElementById('game-over-quit').textContent = window.dataMap.get('game-over-quit');
            document.getElementById('start-button').textContent = window.dataMap.get('start-button');
            const noTournament = document.getElementById('no-tournament');
            if (noTournament != null)
              noTournament.textContent = window.dataMap.get('no-tournament');
            document.getElementById('client-invite').textContent = window.dataMap.get('client-invite');
            document.getElementById('join-room-title').textContent = window.dataMap.get('join-room-title');
            document.getElementById('join-room-text').textContent = window.dataMap.get('join-room-text');
            document.getElementById('join-input-id').placeholder = window.dataMap.get('join-input-id');
            document.getElementById('join-room-button-id').textContent = window.dataMap.get('validate-qr-code-id');
            document.getElementById('friend-stat').textContent = window.dataMap.get('friend-stat');
            if (window.matchmaking) {
              document.getElementById('launch-matchmaking').textContent = window.dataMap.get('launch-matchmaking');
            } else {
              document.getElementById('launch-matchmaking').textContent = window.dataMap.get('stop-matchmaking');
            }
            const trashExplorer = document.getElementById('trash-explorer');
            if (trashExplorer)
              trashExplorer.textContent = window.dataMap.get('trash');
            const desktopExplorer = document.getElementById('desktop-explorer');
            if (desktopExplorer)
              desktopExplorer.textContent = window.dataMap.get('desktop');
            document.getElementById('trash-bin-title').textContent = window.dataMap.get('trash');
            document.getElementById('user-history').textContent = window.dataMap.get('user-match-history');
            document.getElementById('help').textContent = window.dataMap.get('help');
            document.getElementById('invite-help').textContent = window.dataMap.get('invite-help');
            document.getElementById('add-help').textContent = window.dataMap.get('add-help');
            document.getElementById('accept-help').textContent = window.dataMap.get('accept-help');
            document.getElementById('remove-help').textContent = window.dataMap.get('remove-help');
            document.getElementById('block-help').textContent = window.dataMap.get('block-help');
            document.getElementById('w-help').textContent = window.dataMap.get('w-help');
          });

          const flagIcon = document.querySelector('.flag-icon');
          if (flagIcon) {
            flagIcon.style.background = "url('../img/russia_flag.png')";
            flagIcon.style.backgroundSize = "contain";
            flagIcon.style.backgroundRepeat = "no-repeat";
            flagIcon.style.backgroundPosition = "center";
            flagIcon.style.width = "32px";
            flagIcon.style.height = "32px";
          }

          raiseAlert("Язык изменен на русский");
          updateUserInfo();
          updateUserStat();
        const requestData = {
          language: 'ru',
        };
        const response = fetch('/auth/language/', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getTokenCookie()}`,
          },
          body: JSON.stringify(requestData),
        });
      }
    });
  });
}


function toogleLanguageChoicesLogin() {
  const languages = document.querySelector('.language-choices-login');

  if (languages.style.display === 'none' || languages.style.display === '') {
    languages.style.display = 'flex';

    const choices = languages.querySelectorAll('ul li');
    choices.forEach((choice, index) => {

      choice.classList.remove('slide-flag-up-login');
      choice.classList.add('slide-flag-up-login');
    });
  } else {
    languages.style.display = 'none';
  }

  const choices = languages.querySelectorAll('ul li');
  choices.forEach(choice => {
    const divFlag = choice.querySelector('div');

    divFlag.addEventListener('click', function() {

      if (divFlag.id === 'france-flag-login') {
        window.dict = 'fr-dict.txt';
        fetch(window.dict)
          .then(response => response.text())
          .then(text => {
            let file = text.split('\n');
            window.dataMap = null;
            window.dataMap = new Map();
            for (let line of file) {
              let lineSplit = line.split('=');
              window.dataMap.set(lineSplit[0], lineSplit[1]);
            }
            document.getElementById('login-title').textContent = window.dataMap.get('login-title');
            document.getElementById('sign-in-button').textContent = window.dataMap.get('sign-in-button');
            document.getElementById('button-sign-up-page').textContent = window.dataMap.get('button-sign-up-page');
            document.getElementById('button-register-page').textContent = window.dataMap.get('button-register-page');
            document.getElementById('button-login-42').textContent = window.dataMap.get('button-login-42');
            document.getElementById('sign-in-username').placeholder = window.dataMap.get('sign-in-username');
            document.getElementById('sign-in-password').placeholder = window.dataMap.get('sign-in-password');
            document.getElementById('sign-up-username').placeholder = window.dataMap.get('sign-up-username');
            document.getElementById('sign-up-email').placeholder = window.dataMap.get('sign-up-email');
            document.getElementById('sign-up-password').placeholder = window.dataMap.get('sign-up-password');
            document.getElementById('sign-up-confirm-password').placeholder = window.dataMap.get('sign-up-confirm-password');
            document.getElementById('2fa-sign').textContent = window.dataMap.get('2fa-sign');
            document.getElementById('2fa-text').textContent = window.dataMap.get('2fa-text');
            document.getElementById('2fa-button').textContent = window.dataMap.get('2fa-button');
            document.getElementById('desktop').textContent = window.dataMap.get('desktop');
            document.getElementById('account').textContent = window.dataMap.get('account');
            document.getElementById('settings').textContent = window.dataMap.get('settings');
            document.getElementById('quit').textContent = window.dataMap.get('quit');
            document.getElementById('application-explorer').textContent = window.dataMap.get('application-explorer');
            document.getElementById('account-window').textContent = window.dataMap.get('account-window');
            document.getElementById('update-profile').textContent = window.dataMap.get('update-profile');
            document.getElementById('user-stats').textContent = window.dataMap.get('user-stats');
            const userFriends = document.getElementById('user-friends');
            if (userFriends != null)
              userFriends.textContent = window.dataMap.get('user-friends');
            document.getElementById('profile-account').textContent = window.dataMap.get('profile-account');
            document.getElementById('profile-alias').placeholder = window.dataMap.get('profile-alias');
            document.getElementById('profile-email').placeholder = window.dataMap.get('profile-email');
            document.getElementById('profile-old-password').placeholder = window.dataMap.get('profile-old-password');
            document.getElementById('profile-password').placeholder = window.dataMap.get('profile-password');
            document.getElementById('profile-confirm-password').placeholder = window.dataMap.get('profile-confirm-password');
            document.getElementById('update-button').textContent = window.dataMap.get('update-button');
            document.getElementById('friend-account').textContent = window.dataMap.get('friend-account');
            document.getElementById('activate-2fa-text').textContent = window.dataMap.get('activate-2fa-text');
            document.getElementById('enter-code').placeholder = window.dataMap.get('enter-code');
            document.getElementById('validate-qr-code-id').textContent = window.dataMap.get('validate-qr-code-id');
            document.getElementById('desktop-image').textContent = window.dataMap.get('desktop-image');
            document.getElementById('trash').textContent = window.dataMap.get('trash');
            document.getElementById('general').textContent = window.dataMap.get('general');
            document.getElementById('add-friends').textContent = window.dataMap.get('add-friends');
            document.getElementById('search-friends').placeholder = window.dataMap.get('search-friends');
            document.getElementById('type-message').placeholder = window.dataMap.get('type-message');
            document.getElementById('send').textContent = window.dataMap.get('send');
            document.getElementById('client-info').textContent = window.dataMap.get('client-info');
            document.getElementById('client-msg').textContent = window.dataMap.get('client-msg');
            document.getElementById('winbook-title').textContent = window.dataMap.get('winbook-title');
            document.getElementById('search').textContent = window.dataMap.get('search');
            document.getElementById('create').textContent = window.dataMap.get('create');
            document.getElementById('search-button').textContent = window.dataMap.get('search-button');
            document.getElementById('search-tournament').placeholder = window.dataMap.get('search-tournament');
            document.getElementById('create-tournament-name').placeholder = window.dataMap.get('create-tournament-name');
            document.getElementById('create-tournament-button').textContent = window.dataMap.get('create-tournament-button');
            const tournamentName = document.getElementById('tournament-name').textContent;
            if (tournamentName == 'Aucun Tournoi Sélectionné' || tournamentName == 'Nenhum torneio selecionado' || tournamentName == 'No Tournament Selected')
              document.getElementById('tournament-name').textContent = window.dataMap.get('tournament-name');
            const emptyData = document.getElementById('empty');
            if (emptyData != null)
              emptyData.textContent = window.dataMap.get('empty');
            document.getElementById('ready-button').textContent = window.dataMap.get('ready-button');
            document.getElementById('quit-button').textContent = window.dataMap.get('quit-button');
            document.getElementById('game').textContent = window.dataMap.get('game');
            document.getElementById('game-options').textContent = window.dataMap.get('game-options');
            document.getElementById('choose-option').textContent = window.dataMap.get('choose-option');
            document.getElementById('ai-button').textContent = window.dataMap.get('ai-button');
            document.getElementById('local-button').textContent = window.dataMap.get('local-button');
            document.getElementById('join-room').textContent = window.dataMap.get('join-room');
            document.getElementById('game-over-txt').textContent = window.dataMap.get('game-over-txt');
            document.getElementById('game-over-quit').textContent = window.dataMap.get('game-over-quit');
            document.getElementById('start-button').textContent = window.dataMap.get('start-button');
            const noTournament = document.getElementById('no-tournament');
            if (noTournament != null)
              noTournament.textContent = window.dataMap.get('no-tournament');
            document.getElementById('client-invite').textContent = window.dataMap.get('client-invite');
            document.getElementById('join-room-title').textContent = window.dataMap.get('join-room-title');
            document.getElementById('join-room-text').textContent = window.dataMap.get('join-room-text');
            document.getElementById('join-input-id').placeholder = window.dataMap.get('join-input-id');
            document.getElementById('join-room-button-id').textContent = window.dataMap.get('validate-qr-code-id');
            document.getElementById('friend-stat').textContent = window.dataMap.get('friend-stat');
            if (window.matchmaking) {
              document.getElementById('launch-matchmaking').textContent = window.dataMap.get('launch-matchmaking');
            } else {
              document.getElementById('launch-matchmaking').textContent = window.dataMap.get('stop-matchmaking');
            }
            const trashExplorer = document.getElementById('trash-explorer');
            if (trashExplorer)
              trashExplorer.textContent = window.dataMap.get('trash');
            const desktopExplorer = document.getElementById('desktop-explorer');
            if (desktopExplorer)
              desktopExplorer.textContent = window.dataMap.get('desktop');
            document.getElementById('trash-bin-title').textContent = window.dataMap.get('trash');
            document.getElementById('user-history').textContent = window.dataMap.get('user-match-history');
            document.getElementById('help').textContent = window.dataMap.get('help');
            document.getElementById('invite-help').textContent = window.dataMap.get('invite-help');
            document.getElementById('add-help').textContent = window.dataMap.get('add-help');
            document.getElementById('accept-help').textContent = window.dataMap.get('accept-help');
            document.getElementById('remove-help').textContent = window.dataMap.get('remove-help');
            document.getElementById('block-help').textContent = window.dataMap.get('block-help');
            document.getElementById('w-help').textContent = window.dataMap.get('w-help');
          });

          const flagIcon = document.querySelector('.flag-icon-login');
          if (flagIcon) {
            flagIcon.style.background = "url('../img/france_flag.png')";
            flagIcon.style.backgroundSize = "contain";
            flagIcon.style.backgroundRepeat = "no-repeat";
            flagIcon.style.backgroundPosition = "center";
            flagIcon.style.width = "32px";
            flagIcon.style.height = "32px";
          }

          raiseAlert("Langue changé en Français");
          updateUserInfo();
        const requestData = {
            language: 'fr',
          };
          const response = fetch('/auth/language/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getTokenCookie()}`,
            },
            body: JSON.stringify(requestData),
          });
      } else if (divFlag.id === 'england-flag-login') {
        window.dict = 'en-dict.txt';
        fetch(window.dict)
          .then(response => response.text())
          .then(text => {
            let file = text.split('\n');
            window.dataMap = null;
            window.dataMap = new Map();
            for (let line of file) {
              let lineSplit = line.split('=');
              window.dataMap.set(lineSplit[0], lineSplit[1]);
            }
            document.getElementById('login-title').textContent = window.dataMap.get('login-title');
            document.getElementById('sign-in-button').textContent = window.dataMap.get('sign-in-button');
            document.getElementById('button-sign-up-page').textContent = window.dataMap.get('button-sign-up-page');
            document.getElementById('button-register-page').textContent = window.dataMap.get('button-register-page');
            document.getElementById('button-login-42').textContent = window.dataMap.get('button-login-42');
            document.getElementById('sign-in-username').placeholder = window.dataMap.get('sign-in-username');
            document.getElementById('sign-in-password').placeholder = window.dataMap.get('sign-in-password');
            document.getElementById('sign-up-username').placeholder = window.dataMap.get('sign-up-username');
            document.getElementById('sign-up-email').placeholder = window.dataMap.get('sign-up-email');
            document.getElementById('sign-up-password').placeholder = window.dataMap.get('sign-up-password');
            document.getElementById('sign-up-confirm-password').placeholder = window.dataMap.get('sign-up-confirm-password');
            document.getElementById('2fa-sign').textContent = window.dataMap.get('2fa-sign');
            document.getElementById('2fa-text').textContent = window.dataMap.get('2fa-text');
            document.getElementById('2fa-button').textContent = window.dataMap.get('2fa-button');
            document.getElementById('desktop').textContent = window.dataMap.get('desktop');
            document.getElementById('account').textContent = window.dataMap.get('account');
            document.getElementById('settings').textContent = window.dataMap.get('settings');
            document.getElementById('quit').textContent = window.dataMap.get('quit');
            document.getElementById('application-explorer').textContent = window.dataMap.get('application-explorer');
            document.getElementById('account-window').textContent = window.dataMap.get('account-window');
            document.getElementById('update-profile').textContent = window.dataMap.get('update-profile');
            document.getElementById('user-stats').textContent = window.dataMap.get('user-stats');
            const userFriends = document.getElementById('user-friends');
            if (userFriends != null)
              userFriends.textContent = window.dataMap.get('user-friends');
            document.getElementById('profile-account').textContent = window.dataMap.get('profile-account');
            document.getElementById('profile-alias').placeholder = window.dataMap.get('profile-alias');
            document.getElementById('profile-email').placeholder = window.dataMap.get('profile-email');
            document.getElementById('profile-old-password').placeholder = window.dataMap.get('profile-old-password');
            document.getElementById('profile-password').placeholder = window.dataMap.get('profile-password');
            document.getElementById('profile-confirm-password').placeholder = window.dataMap.get('profile-confirm-password');
            document.getElementById('update-button').textContent = window.dataMap.get('update-button');
            document.getElementById('friend-account').textContent = window.dataMap.get('friend-account');
            document.getElementById('activate-2fa-text').textContent = window.dataMap.get('activate-2fa-text');
            document.getElementById('enter-code').placeholder = window.dataMap.get('enter-code');
            document.getElementById('validate-qr-code-id').textContent = window.dataMap.get('validate-qr-code-id');
            document.getElementById('desktop-image').textContent = window.dataMap.get('desktop-image');
            document.getElementById('trash').textContent = window.dataMap.get('trash');
            document.getElementById('general').textContent = window.dataMap.get('general');
            document.getElementById('add-friends').textContent = window.dataMap.get('add-friends');
            document.getElementById('search-friends').placeholder = window.dataMap.get('search-friends');
            document.getElementById('type-message').placeholder = window.dataMap.get('type-message');
            document.getElementById('send').textContent = window.dataMap.get('send');
            document.getElementById('client-info').textContent = window.dataMap.get('client-info');
            document.getElementById('client-msg').textContent = window.dataMap.get('client-msg');
            document.getElementById('winbook-title').textContent = window.dataMap.get('winbook-title');
            document.getElementById('search').textContent = window.dataMap.get('search');
            document.getElementById('create').textContent = window.dataMap.get('create');
            document.getElementById('search-button').textContent = window.dataMap.get('search-button');
            document.getElementById('search-tournament').placeholder = window.dataMap.get('search-tournament');
            document.getElementById('create-tournament-name').placeholder = window.dataMap.get('create-tournament-name');
            document.getElementById('create-tournament-button').textContent = window.dataMap.get('create-tournament-button');
            const tournamentName = document.getElementById('tournament-name').textContent;
            if (tournamentName == 'Aucun Tournoi Sélectionné' || tournamentName == 'Nenhum torneio selecionado' || tournamentName == 'No Tournament Selected')
              document.getElementById('tournament-name').textContent = window.dataMap.get('tournament-name');
            const emptyData = document.getElementById('empty');
            if (emptyData != null)
              emptyData.textContent = window.dataMap.get('empty');
            document.getElementById('ready-button').textContent = window.dataMap.get('ready-button');
            document.getElementById('quit-button').textContent = window.dataMap.get('quit-button');
            document.getElementById('game').textContent = window.dataMap.get('game');
            document.getElementById('game-options').textContent = window.dataMap.get('game-options');
            document.getElementById('choose-option').textContent = window.dataMap.get('choose-option');
            document.getElementById('ai-button').textContent = window.dataMap.get('ai-button');
            document.getElementById('local-button').textContent = window.dataMap.get('local-button');
            document.getElementById('join-room').textContent = window.dataMap.get('join-room');
            document.getElementById('game-over-txt').textContent = window.dataMap.get('game-over-txt');
            document.getElementById('game-over-quit').textContent = window.dataMap.get('game-over-quit');
            document.getElementById('start-button').textContent = window.dataMap.get('start-button');
            const noTournament = document.getElementById('no-tournament');
            if (noTournament != null)
              noTournament.textContent = window.dataMap.get('no-tournament');
            document.getElementById('client-invite').textContent = window.dataMap.get('client-invite');
            document.getElementById('join-room-title').textContent = window.dataMap.get('join-room-title');
            document.getElementById('join-room-text').textContent = window.dataMap.get('join-room-text');
            document.getElementById('join-input-id').placeholder = window.dataMap.get('join-input-id');
            document.getElementById('join-room-button-id').textContent = window.dataMap.get('validate-qr-code-id');
            document.getElementById('friend-stat').textContent = window.dataMap.get('friend-stat');
            if (window.matchmaking) {
              document.getElementById('launch-matchmaking').textContent = window.dataMap.get('launch-matchmaking');
            } else {
              document.getElementById('launch-matchmaking').textContent = window.dataMap.get('stop-matchmaking');
            }
            const trashExplorer = document.getElementById('trash-explorer');
            if (trashExplorer)
              trashExplorer.textContent = window.dataMap.get('trash');
            const desktopExplorer = document.getElementById('desktop-explorer');
            if (desktopExplorer)
              desktopExplorer.textContent = window.dataMap.get('desktop');
            document.getElementById('trash-bin-title').textContent = window.dataMap.get('trash');
            document.getElementById('user-history').textContent = window.dataMap.get('user-match-history');
            document.getElementById('help').textContent = window.dataMap.get('help');
            document.getElementById('invite-help').textContent = window.dataMap.get('invite-help');
            document.getElementById('add-help').textContent = window.dataMap.get('add-help');
            document.getElementById('accept-help').textContent = window.dataMap.get('accept-help');
            document.getElementById('remove-help').textContent = window.dataMap.get('remove-help');
            document.getElementById('block-help').textContent = window.dataMap.get('block-help');
            document.getElementById('w-help').textContent = window.dataMap.get('w-help');
          });

          const flagIcon = document.querySelector('.flag-icon-login');
          if (flagIcon) {
            flagIcon.style.background = "url('../img/uk_flag.png')";
            flagIcon.style.backgroundSize = "contain";
            flagIcon.style.backgroundRepeat = "no-repeat";
            flagIcon.style.backgroundPosition = "center";
            flagIcon.style.width = "32px";
            flagIcon.style.height = "32px";
          }

          raiseAlert("Language changed to English");
          updateUserInfo();
        const requestData = {
            language: 'en',
          };
          const response = fetch('/auth/language/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getTokenCookie()}`,
            },
            body: JSON.stringify(requestData),
          });
      } else if (divFlag.id === 'portugal-flag-login') {
        window.dict = 'pt-dict.txt';
        fetch(window.dict)
          .then(response => response.text())
          .then(text => {
            let file = text.split('\n');
            window.dataMap = null;
            window.dataMap = new Map();
            for (let line of file) {
              let lineSplit = line.split('=');
              window.dataMap.set(lineSplit[0], lineSplit[1]);
            }
            document.getElementById('login-title').textContent = window.dataMap.get('login-title');
            document.getElementById('sign-in-button').textContent = window.dataMap.get('sign-in-button');
            document.getElementById('button-sign-up-page').textContent = window.dataMap.get('button-sign-up-page');
            document.getElementById('button-register-page').textContent = window.dataMap.get('button-register-page');
            document.getElementById('button-login-42').textContent = window.dataMap.get('button-login-42');
            document.getElementById('sign-in-username').placeholder = window.dataMap.get('sign-in-username');
            document.getElementById('sign-in-password').placeholder = window.dataMap.get('sign-in-password');
            document.getElementById('sign-up-username').placeholder = window.dataMap.get('sign-up-username');
            document.getElementById('sign-up-email').placeholder = window.dataMap.get('sign-up-email');
            document.getElementById('sign-up-password').placeholder = window.dataMap.get('sign-up-password');
            document.getElementById('sign-up-confirm-password').placeholder = window.dataMap.get('sign-up-confirm-password');
            document.getElementById('2fa-sign').textContent = window.dataMap.get('2fa-sign');
            document.getElementById('2fa-text').textContent = window.dataMap.get('2fa-text');
            document.getElementById('2fa-button').textContent = window.dataMap.get('2fa-button');
            document.getElementById('desktop').textContent = window.dataMap.get('desktop');
            document.getElementById('account').textContent = window.dataMap.get('account');
            document.getElementById('settings').textContent = window.dataMap.get('settings');
            document.getElementById('quit').textContent = window.dataMap.get('quit');
            document.getElementById('application-explorer').textContent = window.dataMap.get('application-explorer');
            document.getElementById('account-window').textContent = window.dataMap.get('account-window');
            document.getElementById('update-profile').textContent = window.dataMap.get('update-profile');
            document.getElementById('user-stats').textContent = window.dataMap.get('user-stats');
            const userFriends = document.getElementById('user-friends');
            if (userFriends != null)
              userFriends.textContent = window.dataMap.get('user-friends');
            document.getElementById('profile-account').textContent = window.dataMap.get('profile-account');
            document.getElementById('profile-alias').placeholder = window.dataMap.get('profile-alias');
            document.getElementById('profile-email').placeholder = window.dataMap.get('profile-email');
            document.getElementById('profile-old-password').placeholder = window.dataMap.get('profile-old-password');
            document.getElementById('profile-password').placeholder = window.dataMap.get('profile-password');
            document.getElementById('profile-confirm-password').placeholder = window.dataMap.get('profile-confirm-password');
            document.getElementById('update-button').textContent = window.dataMap.get('update-button');
            document.getElementById('friend-account').textContent = window.dataMap.get('friend-account');
            document.getElementById('activate-2fa-text').textContent = window.dataMap.get('activate-2fa-text');
            document.getElementById('enter-code').placeholder = window.dataMap.get('enter-code');
            document.getElementById('validate-qr-code-id').textContent = window.dataMap.get('validate-qr-code-id');
            document.getElementById('desktop-image').textContent = window.dataMap.get('desktop-image');
            document.getElementById('trash').textContent = window.dataMap.get('trash');
            document.getElementById('general').textContent = window.dataMap.get('general');
            document.getElementById('add-friends').textContent = window.dataMap.get('add-friends');
            document.getElementById('search-friends').placeholder = window.dataMap.get('search-friends');
            document.getElementById('type-message').placeholder = window.dataMap.get('type-message');
            document.getElementById('send').textContent = window.dataMap.get('send');
            document.getElementById('client-info').textContent = window.dataMap.get('client-info');
            document.getElementById('client-msg').textContent = window.dataMap.get('client-msg');
            document.getElementById('winbook-title').textContent = window.dataMap.get('winbook-title');
            document.getElementById('search').textContent = window.dataMap.get('search');
            document.getElementById('create').textContent = window.dataMap.get('create');
            document.getElementById('search-button').textContent = window.dataMap.get('search-button');
            document.getElementById('search-tournament').placeholder = window.dataMap.get('search-tournament');
            document.getElementById('create-tournament-name').placeholder = window.dataMap.get('create-tournament-name');
            document.getElementById('create-tournament-button').textContent = window.dataMap.get('create-tournament-button');
            const tournamentName = document.getElementById('tournament-name').textContent;
            if (tournamentName == 'Aucun Tournoi Sélectionné' || tournamentName == 'Nenhum torneio selecionado' || tournamentName == 'No Tournament Selected')
              document.getElementById('tournament-name').textContent = window.dataMap.get('tournament-name');
            const emptyData = document.getElementById('empty');
            if (emptyData != null)
              emptyData.textContent = window.dataMap.get('empty');
            document.getElementById('ready-button').textContent = window.dataMap.get('ready-button');
            document.getElementById('quit-button').textContent = window.dataMap.get('quit-button');
            document.getElementById('game').textContent = window.dataMap.get('game');
            document.getElementById('game-options').textContent = window.dataMap.get('game-options');
            document.getElementById('choose-option').textContent = window.dataMap.get('choose-option');
            document.getElementById('ai-button').textContent = window.dataMap.get('ai-button');
            document.getElementById('local-button').textContent = window.dataMap.get('local-button');
            document.getElementById('join-room').textContent = window.dataMap.get('join-room');
            document.getElementById('game-over-txt').textContent = window.dataMap.get('game-over-txt');
            document.getElementById('game-over-quit').textContent = window.dataMap.get('game-over-quit');
            document.getElementById('start-button').textContent = window.dataMap.get('start-button');
            const noTournament = document.getElementById('no-tournament');
            if (noTournament != null)
              noTournament.textContent = window.dataMap.get('no-tournament');
            document.getElementById('client-invite').textContent = window.dataMap.get('client-invite');
            document.getElementById('join-room-title').textContent = window.dataMap.get('join-room-title');
            document.getElementById('join-room-text').textContent = window.dataMap.get('join-room-text');
            document.getElementById('join-input-id').placeholder = window.dataMap.get('join-input-id');
            document.getElementById('join-room-button-id').textContent = window.dataMap.get('validate-qr-code-id');
            document.getElementById('friend-stat').textContent = window.dataMap.get('friend-stat');
            if (window.matchmaking) {
              document.getElementById('launch-matchmaking').textContent = window.dataMap.get('launch-matchmaking');
            } else {
              document.getElementById('launch-matchmaking').textContent = window.dataMap.get('stop-matchmaking');
            }
            const trashExplorer = document.getElementById('trash-explorer');
            if (trashExplorer)
              trashExplorer.textContent = window.dataMap.get('trash');
            const desktopExplorer = document.getElementById('desktop-explorer');
            if (desktopExplorer)
              desktopExplorer.textContent = window.dataMap.get('desktop');
            document.getElementById('trash-bin-title').textContent = window.dataMap.get('trash');
            document.getElementById('user-history').textContent = window.dataMap.get('user-match-history');
            document.getElementById('help').textContent = window.dataMap.get('help');
            document.getElementById('invite-help').textContent = window.dataMap.get('invite-help');
            document.getElementById('add-help').textContent = window.dataMap.get('add-help');
            document.getElementById('accept-help').textContent = window.dataMap.get('accept-help');
            document.getElementById('remove-help').textContent = window.dataMap.get('remove-help');
            document.getElementById('block-help').textContent = window.dataMap.get('block-help');
            document.getElementById('w-help').textContent = window.dataMap.get('w-help');
          });

          const flagIcon = document.querySelector('.flag-icon-login');
          if (flagIcon) {
            flagIcon.style.background = "url('../img/portugal_flag.png')";
            flagIcon.style.backgroundSize = "contain";
            flagIcon.style.backgroundRepeat = "no-repeat";
            flagIcon.style.backgroundPosition = "center";
            flagIcon.style.width = "32px";
            flagIcon.style.height = "32px";
          }
          raiseAlert("Idioma alterado para português");
          updateUserInfo();
        const requestData = {
            language: 'pt',
          };
          const response = fetch('/auth/language/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getTokenCookie()}`,
            },
            body: JSON.stringify(requestData),
          });
      } else if (divFlag.id === 'russia-flag-login') {
        window.dict = 'ru-dict.txt';
        fetch(window.dict)
          .then(response => response.text())
          .then(text => {
            let file = text.split('\n');
            window.dataMap = null;
            window.dataMap = new Map();
            for (let line of file) {
              let lineSplit = line.split('=');
              window.dataMap.set(lineSplit[0], lineSplit[1]);
            }
            document.getElementById('login-title').textContent = window.dataMap.get('login-title');
            document.getElementById('sign-in-button').textContent = window.dataMap.get('sign-in-button');
            document.getElementById('button-sign-up-page').textContent = window.dataMap.get('button-sign-up-page');
            document.getElementById('button-register-page').textContent = window.dataMap.get('button-register-page');
            document.getElementById('button-login-42').textContent = window.dataMap.get('button-login-42');
            document.getElementById('sign-in-username').placeholder = window.dataMap.get('sign-in-username');
            document.getElementById('sign-in-password').placeholder = window.dataMap.get('sign-in-password');
            document.getElementById('sign-up-username').placeholder = window.dataMap.get('sign-up-username');
            document.getElementById('sign-up-email').placeholder = window.dataMap.get('sign-up-email');
            document.getElementById('sign-up-password').placeholder = window.dataMap.get('sign-up-password');
            document.getElementById('sign-up-confirm-password').placeholder = window.dataMap.get('sign-up-confirm-password');
            document.getElementById('2fa-sign').textContent = window.dataMap.get('2fa-sign');
            document.getElementById('2fa-text').textContent = window.dataMap.get('2fa-text');
            document.getElementById('2fa-button').textContent = window.dataMap.get('2fa-button');
            document.getElementById('desktop').textContent = window.dataMap.get('desktop');
            document.getElementById('account').textContent = window.dataMap.get('account');
            document.getElementById('settings').textContent = window.dataMap.get('settings');
            document.getElementById('quit').textContent = window.dataMap.get('quit');
            document.getElementById('application-explorer').textContent = window.dataMap.get('application-explorer');
            document.getElementById('account-window').textContent = window.dataMap.get('account-window');
            document.getElementById('update-profile').textContent = window.dataMap.get('update-profile');
            document.getElementById('user-stats').textContent = window.dataMap.get('user-stats');
            const userFriends = document.getElementById('user-friends');
            if (userFriends != null)
              userFriends.textContent = window.dataMap.get('user-friends');
            document.getElementById('profile-account').textContent = window.dataMap.get('profile-account');
            document.getElementById('profile-alias').placeholder = window.dataMap.get('profile-alias');
            document.getElementById('profile-email').placeholder = window.dataMap.get('profile-email');
            document.getElementById('profile-old-password').placeholder = window.dataMap.get('profile-old-password');
            document.getElementById('profile-password').placeholder = window.dataMap.get('profile-password');
            document.getElementById('profile-confirm-password').placeholder = window.dataMap.get('profile-confirm-password');
            document.getElementById('update-button').textContent = window.dataMap.get('update-button');
            document.getElementById('friend-account').textContent = window.dataMap.get('friend-account');
            document.getElementById('activate-2fa-text').textContent = window.dataMap.get('activate-2fa-text');
            document.getElementById('enter-code').placeholder = window.dataMap.get('enter-code');
            document.getElementById('validate-qr-code-id').textContent = window.dataMap.get('validate-qr-code-id');
            document.getElementById('desktop-image').textContent = window.dataMap.get('desktop-image');
            document.getElementById('trash').textContent = window.dataMap.get('trash');
            document.getElementById('general').textContent = window.dataMap.get('general');
            document.getElementById('add-friends').textContent = window.dataMap.get('add-friends');
            document.getElementById('search-friends').placeholder = window.dataMap.get('search-friends');
            document.getElementById('type-message').placeholder = window.dataMap.get('type-message');
            document.getElementById('send').textContent = window.dataMap.get('send');
            document.getElementById('client-info').textContent = window.dataMap.get('client-info');
            document.getElementById('client-msg').textContent = window.dataMap.get('client-msg');
            document.getElementById('winbook-title').textContent = window.dataMap.get('winbook-title');
            document.getElementById('search').textContent = window.dataMap.get('search');
            document.getElementById('create').textContent = window.dataMap.get('create');
            document.getElementById('search-button').textContent = window.dataMap.get('search-button');
            document.getElementById('search-tournament').placeholder = window.dataMap.get('search-tournament');
            document.getElementById('create-tournament-name').placeholder = window.dataMap.get('create-tournament-name');
            document.getElementById('create-tournament-button').textContent = window.dataMap.get('create-tournament-button');
            const tournamentName = document.getElementById('tournament-name').textContent;
            if (tournamentName == 'Aucun Tournoi Sélectionné' || tournamentName == 'Nenhum torneio selecionado' || tournamentName == 'No Tournament Selected')
              document.getElementById('tournament-name').textContent = window.dataMap.get('tournament-name');
            const emptyData = document.getElementById('empty');
            if (emptyData != null)
              emptyData.textContent = window.dataMap.get('empty');
            document.getElementById('ready-button').textContent = window.dataMap.get('ready-button');
            document.getElementById('quit-button').textContent = window.dataMap.get('quit-button');
            document.getElementById('game').textContent = window.dataMap.get('game');
            document.getElementById('game-options').textContent = window.dataMap.get('game-options');
            document.getElementById('choose-option').textContent = window.dataMap.get('choose-option');
            document.getElementById('ai-button').textContent = window.dataMap.get('ai-button');
            document.getElementById('local-button').textContent = window.dataMap.get('local-button');
            document.getElementById('join-room').textContent = window.dataMap.get('join-room');
            document.getElementById('game-over-txt').textContent = window.dataMap.get('game-over-txt');
            document.getElementById('game-over-quit').textContent = window.dataMap.get('game-over-quit');
            document.getElementById('start-button').textContent = window.dataMap.get('start-button');
            const noTournament = document.getElementById('no-tournament');
            if (noTournament != null)
              noTournament.textContent = window.dataMap.get('no-tournament');
            document.getElementById('client-invite').textContent = window.dataMap.get('client-invite');
          });
          document.getElementById('join-room-title').textContent = window.dataMap.get('join-room-title');
          document.getElementById('join-room-text').textContent = window.dataMap.get('join-room-text');
          document.getElementById('join-input-id').placeholder = window.dataMap.get('join-input-id');
          document.getElementById('join-room-button-id').textContent = window.dataMap.get('validate-qr-code-id');
          document.getElementById('friend-stat').textContent = window.dataMap.get('friend-stat');
          if (window.matchmaking) {
            document.getElementById('launch-matchmaking').textContent = window.dataMap.get('launch-matchmaking');
          } else {
            document.getElementById('launch-matchmaking').textContent = window.dataMap.get('stop-matchmaking');
          }
          const trashExplorer = document.getElementById('trash-explorer');
          if (trashExplorer)
            trashExplorer.textContent = window.dataMap.get('trash');
          const desktopExplorer = document.getElementById('desktop-explorer');
          if (desktopExplorer)
            desktopExplorer.textContent = window.dataMap.get('desktop');
          document.getElementById('trash-bin-title').textContent = window.dataMap.get('trash');
          document.getElementById('user-history').textContent = window.dataMap.get('user-match-history');
          document.getElementById('help').textContent = window.dataMap.get('help');
          document.getElementById('invite-help').textContent = window.dataMap.get('invite-help');
          document.getElementById('add-help').textContent = window.dataMap.get('add-help');
          document.getElementById('accept-help').textContent = window.dataMap.get('accept-help');
          document.getElementById('remove-help').textContent = window.dataMap.get('remove-help');
          document.getElementById('block-help').textContent = window.dataMap.get('block-help');
          document.getElementById('w-help').textContent = window.dataMap.get('w-help');

          const flagIcon = document.querySelector('.flag-icon-login');
          if (flagIcon) {
            flagIcon.style.background = "url('../img/russia_flag.png')";
            flagIcon.style.backgroundSize = "contain";
            flagIcon.style.backgroundRepeat = "no-repeat";
            flagIcon.style.backgroundPosition = "center";
            flagIcon.style.width = "32px";
            flagIcon.style.height = "32px";
          }
          raiseAlert("Язык изменен на русский");
          updateUserInfo();
        const requestData = {
          language: 'ru',
        };
        const response = fetch('/auth/language/', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getTokenCookie()}`,
          },
          body: JSON.stringify(requestData),
        });
      }

      languages.style.display = 'none';
    });
  });
}
