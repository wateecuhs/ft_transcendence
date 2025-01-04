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

function updateLanguage(file) {
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
  document.getElementById('user-friends').textContent = window.dataMap.get('user-friends');
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
  document.getElementById('tournament-name').textContent = window.dataMap.get('tournament-name');
  document.getElementById('empty').textContent = window.dataMap.get('empty');
  document.getElementById('ready-button').textContent = window.dataMap.get('ready-button');
  document.getElementById('quit-button').textContent = window.dataMap.get('quit-button');
  document.getElementById('game').textContent = window.dataMap.get('game');
  document.getElementById('game-options').textContent = window.dataMap.get('game-options');
  document.getElementById('choose-option').textContent = window.dataMap.get('choose-option');
  document.getElementById('ai-button').textContent = window.dataMap.get('ai-button');
  document.getElementById('local-button').textContent = window.dataMap.get('local-button');
  document.getElementById('create-room').textContent = window.dataMap.get('create-room');
  document.getElementById('join-room').textContent = window.dataMap.get('join-room');
  document.getElementById('game-over-txt').textContent = window.dataMap.get('game-over-txt');
  document.getElementById('game-over-quit').textContent = window.dataMap.get('game-over-quit');
  document.getElementById('start-button').textContent = window.dataMap.get('start-button');
  document.getElementById('no-tournament').textContent = window.dataMap.get('no-tournament');
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
            document.getElementById('user-friends').textContent = window.dataMap.get('user-friends');
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
            document.getElementById('tournament-name').textContent = window.dataMap.get('tournament-name');
            document.getElementById('empty').textContent = window.dataMap.get('empty');
            document.getElementById('ready-button').textContent = window.dataMap.get('ready-button');
            document.getElementById('quit-button').textContent = window.dataMap.get('quit-button');
            document.getElementById('game').textContent = window.dataMap.get('game');
            document.getElementById('game-options').textContent = window.dataMap.get('game-options');
            document.getElementById('choose-option').textContent = window.dataMap.get('choose-option');
            document.getElementById('ai-button').textContent = window.dataMap.get('ai-button');
            document.getElementById('local-button').textContent = window.dataMap.get('local-button');
            document.getElementById('create-room').textContent = window.dataMap.get('create-room');
            document.getElementById('join-room').textContent = window.dataMap.get('join-room');
            document.getElementById('game-over-txt').textContent = window.dataMap.get('game-over-txt');
            document.getElementById('game-over-quit').textContent = window.dataMap.get('game-over-quit');
            document.getElementById('start-button').textContent = window.dataMap.get('start-button');
            document.getElementById('no-tournament').textContent = window.dataMap.get('no-tournament');
            raiseAlert("Langue changé en Français");
          });

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
            document.getElementById('user-friends').textContent = window.dataMap.get('user-friends');
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
            document.getElementById('tournament-name').textContent = window.dataMap.get('tournament-name');
            document.getElementById('empty').textContent = window.dataMap.get('empty');
            document.getElementById('ready-button').textContent = window.dataMap.get('ready-button');
            document.getElementById('quit-button').textContent = window.dataMap.get('quit-button');
            document.getElementById('game').textContent = window.dataMap.get('game');
            document.getElementById('game-options').textContent = window.dataMap.get('game-options');
            document.getElementById('choose-option').textContent = window.dataMap.get('choose-option');
            document.getElementById('ai-button').textContent = window.dataMap.get('ai-button');
            document.getElementById('local-button').textContent = window.dataMap.get('local-button');
            document.getElementById('create-room').textContent = window.dataMap.get('create-room');
            document.getElementById('join-room').textContent = window.dataMap.get('join-room');
            document.getElementById('game-over-txt').textContent = window.dataMap.get('game-over-txt');
            document.getElementById('game-over-quit').textContent = window.dataMap.get('game-over-quit');
            document.getElementById('start-button').textContent = window.dataMap.get('start-button');
            document.getElementById('no-tournament').textContent = window.dataMap.get('no-tournament');
            raiseAlert("Language changed to English");
          });
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
            document.getElementById('user-friends').textContent = window.dataMap.get('user-friends');
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
            document.getElementById('tournament-name').textContent = window.dataMap.get('tournament-name');
            document.getElementById('empty').textContent = window.dataMap.get('empty');
            document.getElementById('ready-button').textContent = window.dataMap.get('ready-button');
            document.getElementById('quit-button').textContent = window.dataMap.get('quit-button');
            document.getElementById('game').textContent = window.dataMap.get('game');
            document.getElementById('game-options').textContent = window.dataMap.get('game-options');
            document.getElementById('choose-option').textContent = window.dataMap.get('choose-option');
            document.getElementById('ai-button').textContent = window.dataMap.get('ai-button');
            document.getElementById('local-button').textContent = window.dataMap.get('local-button');
            document.getElementById('create-room').textContent = window.dataMap.get('create-room');
            document.getElementById('join-room').textContent = window.dataMap.get('join-room');
            document.getElementById('game-over-txt').textContent = window.dataMap.get('game-over-txt');
            document.getElementById('game-over-quit').textContent = window.dataMap.get('game-over-quit');
            document.getElementById('start-button').textContent = window.dataMap.get('start-button');
            document.getElementById('no-tournament').textContent = window.dataMap.get('no-tournament');
            raiseAlert("Idioma alterado para português");
          });
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
      } else if (divFlag.id === 'russia-flag') {
        window.dict = 'rs-dict.txt';
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
            document.getElementById('user-friends').textContent = window.dataMap.get('user-friends');
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
            document.getElementById('tournament-name').textContent = window.dataMap.get('tournament-name');
            document.getElementById('empty').textContent = window.dataMap.get('empty');
            document.getElementById('ready-button').textContent = window.dataMap.get('ready-button');
            document.getElementById('quit-button').textContent = window.dataMap.get('quit-button');
            document.getElementById('game').textContent = window.dataMap.get('game');
            document.getElementById('game-options').textContent = window.dataMap.get('game-options');
            document.getElementById('choose-option').textContent = window.dataMap.get('choose-option');
            document.getElementById('ai-button').textContent = window.dataMap.get('ai-button');
            document.getElementById('local-button').textContent = window.dataMap.get('local-button');
            document.getElementById('create-room').textContent = window.dataMap.get('create-room');
            document.getElementById('join-room').textContent = window.dataMap.get('join-room');
            document.getElementById('game-over-txt').textContent = window.dataMap.get('game-over-txt');
            document.getElementById('game-over-quit').textContent = window.dataMap.get('game-over-quit');
            document.getElementById('start-button').textContent = window.dataMap.get('start-button');
            document.getElementById('no-tournament').textContent = window.dataMap.get('no-tournament');
          });
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
    });
  });
}
