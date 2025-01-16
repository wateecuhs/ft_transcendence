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

function translate() {
  const loginTitle = document.getElementById('login-title');
  if (loginTitle != null)
    loginTitle.textContent = window.dataMap.get('login-title');
  const signInButton = document.getElementById('sign-in-button');
  if (signInButton != null)
    signInButton.textContent = window.dataMap.get('sign-in-button');
  const buttonSignUpPage = document.getElementById('button-sign-up-page');
  if (buttonSignUpPage != null)
    buttonSignUpPage.textContent = window.dataMap.get('button-sign-up-page');
  const buttonRegisterPage = document.getElementById('button-register-page');
  if (buttonRegisterPage != null)
    buttonRegisterPage.textContent = window.dataMap.get('button-register-page');
  const buttonLogin42 = document.getElementById('button-login-42');
  if (buttonLogin42 != null)
    buttonLogin42.textContent = window.dataMap.get('button-login-42');
  const signInUsername = document.getElementById('sign-in-username');
  if (signInUsername != null)
    signInUsername.placeholder = window.dataMap.get('sign-in-username');
  const signInPassword = document.getElementById('sign-in-password');
  if (signInPassword != null)
    signInPassword.placeholder = window.dataMap.get('sign-in-password');
  const signUpUsername = document.getElementById('sign-up-username');
  if (signUpUsername != null)
    signUpUsername.placeholder = window.dataMap.get('sign-up-username');
  const signUpEmail = document.getElementById('sign-up-email');
  if (signUpEmail != null)
    signUpEmail.placeholder = window.dataMap.get('sign-up-email');
  const signUpPassword = document.getElementById('sign-up-password');
  if (signUpPassword != null)
    signUpPassword.placeholder = window.dataMap.get('sign-up-password');
  const signUpConfirmPassword = document.getElementById('sign-up-confirm-password');
  if (signUpConfirmPassword != null)
    signUpConfirmPassword.placeholder = window.dataMap.get('sign-up-confirm-password');
  const twoFactorAuthSign = document.getElementById('2fa-sign');
  if (twoFactorAuthSign != null)
    twoFactorAuthSign.textContent = window.dataMap.get('2fa-sign');
  const twoFactorAuthText = document.getElementById('2fa-text');
  if (twoFactorAuthText != null)
    twoFactorAuthText.textContent = window.dataMap.get('2fa-text');
  const twoFactorAuthButton = document.getElementById('2fa-button');
  if (twoFactorAuthButton != null)
    twoFactorAuthButton.textContent = window.dataMap.get('2fa-button');
  const desktop = document.getElementById('desktop');
  if (desktop != null)
    desktop.textContent = window.dataMap.get('desktop');
  const account = document.getElementById('account');
  if (account != null)
    account.textContent = window.dataMap.get('account');
  const settings = document.getElementById('settings');
  if (settings != null)
    settings.textContent = window.dataMap.get('settings');
  const quit = document.getElementById('quit');
  if (quit != null)
    quit.textContent = window.dataMap.get('quit');
  const applicationExplorer = document.getElementById('application-explorer');
  if (applicationExplorer != null)
    applicationExplorer.textContent = window.dataMap.get('application-explorer');
  const accountWindow = document.getElementById('account-window');
  if (accountWindow != null)
    accountWindow.textContent = window.dataMap.get('account-window');
  const updateProfile = document.getElementById('update-profile');
  if (updateProfile != null)
    updateProfile.textContent = window.dataMap.get('update-profile');
  const userStats = document.getElementById('user-stats');
  if (userStats != null)
    userStats.textContent = window.dataMap.get('user-stats');
  const userFriends = document.getElementById('user-friends');
  if (userFriends != null)
    userFriends.textContent = window.dataMap.get('user-friends');
  const profileAccount = document.getElementById('profile-account');
  if (profileAccount != null)
    profileAccount.textContent = window.dataMap.get('profile-account');
  const profileAlias = document.getElementById('profile-alias');
  if (profileAlias != null)
    profileAlias.placeholder = window.dataMap.get('profile-alias');
  const profileEmail = document.getElementById('profile-email');
  if (profileEmail != null)
    profileEmail.placeholder = window.dataMap.get('profile-email');
  const profileOldPassword = document.getElementById('profile-old-password');
  if (profileOldPassword != null)
    profileOldPassword.placeholder = window.dataMap.get('profile-old-password');
  const profilePassword = document.getElementById('profile-password');
  if (profilePassword != null)
    profilePassword.placeholder = window.dataMap.get('profile-password');
  const profileConfirmPassword = document.getElementById('profile-confirm-password');
  if (profileConfirmPassword != null)
    profileConfirmPassword.placeholder = window.dataMap.get('profile-confirm-password');
  const updateButton = document.getElementById('update-button');
  if (updateButton != null)
    updateButton.textContent = window.dataMap.get('update-button');
  const friendAccount = document.getElementById('friend-account');
  if (friendAccount != null)
    friendAccount.textContent = window.dataMap.get('friend-account');
  const activate2faText = document.getElementById('activate-2fa-text');
  if (activate2faText != null)
    activate2faText.textContent = window.dataMap.get('activate-2fa-text');
  const enterCode = document.getElementById('enter-code');
  if (enterCode != null)
    enterCode.placeholder = window.dataMap.get('enter-code');
  const validateQrCodeId = document.getElementById('validate-qr-code-id');
  if (validateQrCodeId != null)
    validateQrCodeId.textContent = window.dataMap.get('validate-qr-code-id');
  const desktopImage = document.getElementById('desktop-image');
  if (desktopImage != null)
    desktopImage.textContent = window.dataMap.get('desktop-image');
  const trash = document.getElementById('trash');
  if (trash != null)
    trash.textContent = window.dataMap.get('trash');
  const general = document.getElementById('general');
  if (general != null)
    general.textContent = window.dataMap.get('general');
  const addFriends = document.getElementById('add-friends');
  if (addFriends != null)
    addFriends.textContent = window.dataMap.get('add-friends');
  const searchFriends = document.getElementById('search-friends');
  if (searchFriends != null)
    searchFriends.placeholder = window.dataMap.get('search-friends');
  const typeMessage = document.getElementById('type-message');
  if (typeMessage != null)
    typeMessage.placeholder = window.dataMap.get('type-message');
  const send = document.getElementById('send');
  if (send != null)
    send.textContent = window.dataMap.get('send');
  const clientInfo = document.getElementById('client-info');
  if (clientInfo != null)
    clientInfo.textContent = window.dataMap.get('client-info');
  const clientMsg = document.getElementById('client-msg');
  if (clientMsg != null)
    clientMsg.textContent = window.dataMap.get('client-msg');
  const winbookTitle = document.getElementById('winbook-title');
  if (winbookTitle != null)
    winbookTitle.textContent = window.dataMap.get('winbook-title');
  const search = document.getElementById('search');
  if (search != null)
    search.textContent = window.dataMap.get('search');
  const create = document.getElementById('create');
  if (create != null)
    create.textContent = window.dataMap.get('create');
  const searchButton = document.getElementById('search-button');
  if (searchButton != null)
    searchButton.textContent = window.dataMap.get('search-button');
  const searchTournament = document.getElementById('search-tournament');
  if (searchTournament != null)
    searchTournament.placeholder = window.dataMap.get('search-tournament');
  const createTournamentName = document.getElementById('create-tournament-name');
  if (createTournamentName != null)
    createTournamentName.placeholder = window.dataMap.get('create-tournament-name');
  const createTournamentButton = document.getElementById('create-tournament-button');
  if (createTournamentButton != null)
    createTournamentButton.textContent = window.dataMap.get('create-tournament-button');
  const tournamentName = document.getElementById('tournament-name').textContent;
  if (tournamentName == 'Aucun Tournoi Sélectionné' || tournamentName == 'Nenhum torneio selecionado' || tournamentName == 'No Tournament Selected')
    document.getElementById('tournament-name').textContent = window.dataMap.get('tournament-name');
  const emptyData = document.getElementById('empty');
  if (emptyData != null)
    emptyData.textContent = window.dataMap.get('empty');
  const readyButton = document.getElementById('ready-button');
  if (readyButton != null)
    readyButton.textContent = window.dataMap.get('ready-button');
  const quitButton = document.getElementById('quit-button');
  if (quitButton != null)
    quitButton.textContent = window.dataMap.get('quit-button');
  const game = document.getElementById('game');
  if (game != null)
    game.textContent = window.dataMap.get('game');
  const gameOptions = document.getElementById('game-options');
  if (gameOptions != null)
    gameOptions.textContent = window.dataMap.get('game-options');
  const chooseOption = document.getElementById('choose-option');
  if (chooseOption != null)
    chooseOption.textContent = window.dataMap.get('choose-option');
  const aiButton = document.getElementById('ai-button');
  if (aiButton != null)
    aiButton.textContent = window.dataMap.get('ai-button');
  const localButton = document.getElementById('local-button');
  if (localButton != null)
    localButton.textContent = window.dataMap.get('local-button');
  const joinRoom = document.getElementById('join-room');
  if (joinRoom != null)
    joinRoom.textContent = window.dataMap.get('join-room');
  const gameOverTxt = document.getElementById('game-over-txt');
  if (gameOverTxt != null)
    gameOverTxt.textContent = window.dataMap.get('game-over-txt');
  const gameOverQuit = document.getElementById('game-over-quit');
  if (gameOverQuit != null)
    gameOverQuit.textContent = window.dataMap.get('game-over-quit');
  const startButton = document.getElementById('start-button');
  if (startButton != null)
    startButton.textContent = window.dataMap.get('start-button');
  const noTournament = document.getElementById('no-tournament');
  if (noTournament != null)
    noTournament.textContent = window.dataMap.get('no-tournament');
  const clientInvite = document.getElementById('client-invite');
  if (clientInvite != null)
    clientInvite.textContent = window.dataMap.get('client-invite');
  const joinRoomTitle = document.getElementById('join-room-title');
  if (joinRoomTitle != null)
    joinRoomTitle.textContent = window.dataMap.get('join-room-title');
  const joinRoomText = document.getElementById('join-room-text');
  if (joinRoomText != null)
    joinRoomText.textContent = window.dataMap.get('join-room-text');
  const joinInputId = document.getElementById('join-input-id');
  if (joinInputId != null)
    joinInputId.placeholder = window.dataMap.get('join-input-id');
  const joinRoomButtonId = document.getElementById('join-room-button-id');
  if (joinRoomButtonId != null)
    joinRoomButtonId.textContent = window.dataMap.get('validate-qr-code-id');
  const friendStat = document.getElementById('friend-stat');
  if (friendStat != null)
    friendStat.textContent = window.dataMap.get('friend-stat');
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
  const trashBinTitle = document.getElementById('trash-bin-title');
  if (trashBinTitle != null)
    trashBinTitle.textContent = window.dataMap.get('trash');
  const userHistory = document.getElementById('user-history');
  if (userHistory != null)
    userHistory.textContent = window.dataMap.get('user-match-history');
  const help = document.getElementById('help');
  if (help != null)
    help.textContent = window.dataMap.get('help');
  const inviteHelp = document.getElementById('invite-help');
  if (inviteHelp != null)
    inviteHelp.textContent = window.dataMap.get('invite-help');
  const addHelp = document.getElementById('add-help');
  if (addHelp != null)
    addHelp.textContent = window.dataMap.get('add-help');
  const acceptHelp = document.getElementById('accept-help');
  if (acceptHelp != null)
    acceptHelp.textContent = window.dataMap.get('accept-help');
  const removeHelp = document.getElementById('remove-help');
  if (removeHelp != null)
    removeHelp.textContent = window.dataMap.get('remove-help');
  const blockHelp = document.getElementById('block-help');
  if (blockHelp != null)
    blockHelp.textContent = window.dataMap.get('block-help');
  const unblockHelp = document.getElementById('unblock-help');
  if (unblockHelp != null)
    unblockHelp.textContent = window.dataMap.get('unblock-help');
  const wHelp = document.getElementById('w-help');
  if (wHelp != null)
    wHelp.textContent = window.dataMap.get('w-help');
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
            translate();
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
            // document.getElementById('login-title').textContent = window.dataMap.get('login-title');
            // document.getElementById('sign-in-button').textContent = window.dataMap.get('sign-in-button');
            // document.getElementById('button-sign-up-page').textContent = window.dataMap.get('button-sign-up-page');
            // document.getElementById('button-register-page').textContent = window.dataMap.get('button-register-page');
            // document.getElementById('button-login-42').textContent = window.dataMap.get('button-login-42');
            // document.getElementById('sign-in-username').placeholder = window.dataMap.get('sign-in-username');
            // document.getElementById('sign-in-password').placeholder = window.dataMap.get('sign-in-password');
            // document.getElementById('sign-up-username').placeholder = window.dataMap.get('sign-up-username');
            // document.getElementById('sign-up-email').placeholder = window.dataMap.get('sign-up-email');
            // document.getElementById('sign-up-password').placeholder = window.dataMap.get('sign-up-password');
            // document.getElementById('sign-up-confirm-password').placeholder = window.dataMap.get('sign-up-confirm-password');
            // document.getElementById('2fa-sign').textContent = window.dataMap.get('2fa-sign');
            // document.getElementById('2fa-text').textContent = window.dataMap.get('2fa-text');
            // document.getElementById('2fa-button').textContent = window.dataMap.get('2fa-button');
            // document.getElementById('desktop').textContent = window.dataMap.get('desktop');
            // document.getElementById('account').textContent = window.dataMap.get('account');
            // document.getElementById('settings').textContent = window.dataMap.get('settings');
            // document.getElementById('quit').textContent = window.dataMap.get('quit');
            // document.getElementById('application-explorer').textContent = window.dataMap.get('application-explorer');
            // document.getElementById('account-window').textContent = window.dataMap.get('account-window');
            // document.getElementById('update-profile').textContent = window.dataMap.get('update-profile');
            // document.getElementById('user-stats').textContent = window.dataMap.get('user-stats');
            // const userFriends = document.getElementById('user-friends');
            // if (userFriends != null)
            //   userFriends.textContent = window.dataMap.get('user-friends');
            // document.getElementById('profile-account').textContent = window.dataMap.get('profile-account');
            // document.getElementById('profile-alias').placeholder = window.dataMap.get('profile-alias');
            // document.getElementById('profile-email').placeholder = window.dataMap.get('profile-email');
            // document.getElementById('profile-old-password').placeholder = window.dataMap.get('profile-old-password');
            // document.getElementById('profile-password').placeholder = window.dataMap.get('profile-password');
            // document.getElementById('profile-confirm-password').placeholder = window.dataMap.get('profile-confirm-password');
            // document.getElementById('update-button').textContent = window.dataMap.get('update-button');
            // document.getElementById('friend-account').textContent = window.dataMap.get('friend-account');
            // document.getElementById('activate-2fa-text').textContent = window.dataMap.get('activate-2fa-text');
            // document.getElementById('enter-code').placeholder = window.dataMap.get('enter-code');
            // document.getElementById('validate-qr-code-id').textContent = window.dataMap.get('validate-qr-code-id');
            // document.getElementById('desktop-image').textContent = window.dataMap.get('desktop-image');
            // document.getElementById('trash').textContent = window.dataMap.get('trash');
            // document.getElementById('general').textContent = window.dataMap.get('general');
            // document.getElementById('add-friends').textContent = window.dataMap.get('add-friends');
            // document.getElementById('search-friends').placeholder = window.dataMap.get('search-friends');
            // document.getElementById('type-message').placeholder = window.dataMap.get('type-message');
            // document.getElementById('send').textContent = window.dataMap.get('send');
            // document.getElementById('client-info').textContent = window.dataMap.get('client-info');
            // document.getElementById('client-msg').textContent = window.dataMap.get('client-msg');
            // document.getElementById('winbook-title').textContent = window.dataMap.get('winbook-title');
            // document.getElementById('search').textContent = window.dataMap.get('search');
            // document.getElementById('create').textContent = window.dataMap.get('create');
            // document.getElementById('search-button').textContent = window.dataMap.get('search-button');
            // document.getElementById('search-tournament').placeholder = window.dataMap.get('search-tournament');
            // document.getElementById('create-tournament-name').placeholder = window.dataMap.get('create-tournament-name');
            // document.getElementById('create-tournament-button').textContent = window.dataMap.get('create-tournament-button');
            // const tournamentName = document.getElementById('tournament-name').textContent;
            // if (tournamentName == 'Aucun Tournoi Sélectionné' || tournamentName == 'Nenhum torneio selecionado' || tournamentName == 'No Tournament Selected')
            //   document.getElementById('tournament-name').textContent = window.dataMap.get('tournament-name');
            // const emptyData = document.getElementById('empty');
            // if (emptyData != null)
            //   emptyData.textContent = window.dataMap.get('empty');
            // document.getElementById('ready-button').textContent = window.dataMap.get('ready-button');
            // document.getElementById('quit-button').textContent = window.dataMap.get('quit-button');
            // document.getElementById('game').textContent = window.dataMap.get('game');
            // document.getElementById('game-options').textContent = window.dataMap.get('game-options');
            // document.getElementById('choose-option').textContent = window.dataMap.get('choose-option');
            // document.getElementById('ai-button').textContent = window.dataMap.get('ai-button');
            // document.getElementById('local-button').textContent = window.dataMap.get('local-button');
            // document.getElementById('join-room').textContent = window.dataMap.get('join-room');
            // document.getElementById('game-over-txt').textContent = window.dataMap.get('game-over-txt');
            // document.getElementById('game-over-quit').textContent = window.dataMap.get('game-over-quit');
            // document.getElementById('start-button').textContent = window.dataMap.get('start-button');
            // const noTournament = document.getElementById('no-tournament');
            // if (noTournament != null)
            //   noTournament.textContent = window.dataMap.get('no-tournament');
            // document.getElementById('client-invite').textContent = window.dataMap.get('client-invite');
            // document.getElementById('join-room-title').textContent = window.dataMap.get('join-room-title');
            // document.getElementById('join-room-text').textContent = window.dataMap.get('join-room-text');
            // document.getElementById('join-input-id').placeholder = window.dataMap.get('join-input-id');
            // document.getElementById('join-room-button-id').textContent = window.dataMap.get('validate-qr-code-id');
            // document.getElementById('friend-stat').textContent = window.dataMap.get('friend-stat');
            // if (window.matchmaking) {
            //   document.getElementById('launch-matchmaking').textContent = window.dataMap.get('launch-matchmaking');
            // } else {
            //   document.getElementById('launch-matchmaking').textContent = window.dataMap.get('stop-matchmaking');
            // }
            // const trashExplorer = document.getElementById('trash-explorer');
            // if (trashExplorer)
            //   trashExplorer.textContent = window.dataMap.get('trash');
            // const desktopExplorer = document.getElementById('desktop-explorer');
            // if (desktopExplorer)
            //   desktopExplorer.textContent = window.dataMap.get('desktop');
            // document.getElementById('trash-bin-title').textContent = window.dataMap.get('trash');
            // document.getElementById('user-history').textContent = window.dataMap.get('user-match-history');
            // document.getElementById('help').textContent = window.dataMap.get('help');
            // document.getElementById('invite-help').textContent = window.dataMap.get('invite-help');
            // document.getElementById('add-help').textContent = window.dataMap.get('add-help');
            // document.getElementById('accept-help').textContent = window.dataMap.get('accept-help');
            // document.getElementById('remove-help').textContent = window.dataMap.get('remove-help');
            // document.getElementById('block-help').textContent = window.dataMap.get('block-help');
            // document.getElementById('w-help').textContent = window.dataMap.get('w-help');
            translate();
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
            translate();
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
            translate();
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
            translate();
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
            translate();
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
            translate();
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
            translate();
          });
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
