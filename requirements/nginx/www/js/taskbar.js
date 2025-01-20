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
  if ((tournamentName != null) && (tournamentName == 'Aucun Tournoi Sélectionné' || tournamentName == 'Nenhum torneio selecionado' || tournamentName == 'No Tournament Selected' || tournamentName == 'Турнир не выбран'))
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
  const docsWindowTitle = document.getElementById('docs-window-title');
  if (docsWindowTitle != null)
    docsWindowTitle.textContent = window.dataMap.get('docs-window-title');
  const closeButton = document.getElementById('close-button');
  if (closeButton != null)
    closeButton.textContent = window.dataMap.get('close-button');
  const documentationPage = document.getElementById('documentation-page');
  if (documentationPage != null)
    documentationPage.textContent = window.dataMap.get('documentation-page');
  const findEverything = document.getElementById('find-everything');
  if (findEverything != null)
    findEverything.textContent = window.dataMap.get('find-everything');
  const pressArrow = document.getElementById('press-arrow');
  if (pressArrow != null)
    pressArrow.textContent = window.dataMap.get('press-arrow');
  const docsPage1TitleId = document.getElementById('docs-page-1-title-id');
  if (docsPage1TitleId != null)
    docsPage1TitleId.textContent = window.dataMap.get('docs-page-1-title-id');
  const gi1 = document.getElementById('gi-1');
  if (gi1 != null)
    gi1.textContent = window.dataMap.get('gi-1');
  const gi2 = document.getElementById('gi-2');
  if (gi2 != null)
    gi2.textContent = window.dataMap.get('gi-2');
  const gi3 = document.getElementById('gi-3');
  if (gi3 != null)
    gi3.textContent = window.dataMap.get('gi-3');
  const docsPage2TitleId = document.getElementById('docs-page-2-title-id');
  if (docsPage2TitleId != null)
    docsPage2TitleId.textContent = window.dataMap.get('docs-page-2-title-id');
  const msn1 = document.getElementById('msn-1');
  if (msn1 != null)
    msn1.textContent = window.dataMap.get('msn-1');
  const msn2 = document.getElementById('msn-2');
  if (msn2 != null)
    msn2.textContent = window.dataMap.get('msn-2');
  const msn3 = document.getElementById('msn-3');
  if (msn3 != null)
    msn3.textContent = window.dataMap.get('msn-3');
  const docsPage3TitleId = document.getElementById('docs-page-3-title-id');
  if (docsPage3TitleId != null)
    docsPage3TitleId.textContent = window.dataMap.get('docs-page-3-title-id');
  const wb1 = document.getElementById('wb-1');
  if (wb1 != null)
    wb1.textContent = window.dataMap.get('wb-1');
  const wb2 = document.getElementById('wb-2');
  if (wb2 != null)
    wb2.textContent = window.dataMap.get('wb-2');
  const wb3 = document.getElementById('wb-3');
  if (wb3 != null)
    wb3.textContent = window.dataMap.get('wb-3');
  const docsPage4TitleId = document.getElementById('docs-page-4-title-id');
  if (docsPage4TitleId != null)
    docsPage4TitleId.textContent = window.dataMap.get('docs-page-4-title-id');
  const pong1 = document.getElementById('pong-1');
  if (pong1 != null)
    pong1.textContent = window.dataMap.get('pong-1');
  const pong2 = document.getElementById('pong-2');
  if (pong2 != null)
    pong2.textContent = window.dataMap.get('pong-2');
  const pong3 = document.getElementById('pong-3');
  if (pong3 != null)
    pong3.textContent = window.dataMap.get('pong-3');
  const pong4 = document.getElementById('pong-4');
  if (pong4 != null)
    pong4.textContent = window.dataMap.get('pong-4');
  const docsPage5TitleId = document.getElementById('docs-page-5-title-id');
  if (docsPage5TitleId != null)
    docsPage5TitleId.textContent = window.dataMap.get('docs-page-5-title-id');
  const trash1 = document.getElementById('trash-1');
  if (trash1 != null)
    trash1.textContent = window.dataMap.get('trash-1');
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
      languages.style.display = 'none';
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
