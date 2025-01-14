function SignIn() {
	const loginPage = document.getElementById('login-id-page');
	if (!loginPage) {
	  console.error('login-id-page introuvable.');
	  return;
	}

	const usernameInput = loginPage.querySelector('#sign-in-username');
	const passwordInput = loginPage.querySelector('#sign-in-password');
	const signInButton = loginPage.querySelector('#sign-in-button');

	if (!usernameInput || !passwordInput || !signInButton) {
	  console.error('Certains éléments du formulaire de connexion sont introuvables.');
	  return;
	}

	signInButton.addEventListener('click', async function() {
	  const textUsername = usernameInput.value.trim();
	  const textPassword = passwordInput.value.trim();

	  if (!textUsername || !textPassword) {
		raiseAlert(window.dataMap.get('fill-fields'));
		return;
	  }

	  const requestData = {
		username: textUsername,
		password: textPassword,
	  };

	  try {
		const response = await fetch('/auth/login/', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(requestData),
		});

		if (response.ok) {
		  const data = await response.json();

		  if (data.message === 'success') {
			document.cookie = `access_token=${data.access_token}; path=/; SameSite=None; Secure`;
			const userInfo = await getUserInfo(data.access_token);

			if (userInfo) {
			  localStorage.setItem(textUsername, JSON.stringify(userInfo));
			}

			if (userInfo.is_2FA === true) {
				const win_2fa = loginPage.querySelector('#window-2fa-sign');
				win_2fa.style.display = 'flex';
			} else {
				window.dict = `${userInfo.language}-dict.txt`;
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
					if (tournamentName != 'Aucun Tournoi Sélectionné' && tournamentName != 'Nenhum torneio selecionado' && tournamentName != 'No Tournament Selected')
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
					document.getElementById('client-invite').textContent = window.dataMap.get('client-invite');
					if (window.matchmaking) {
						document.getElementById('launch-matchmaking').textContent = window.dataMap.get('launch-matchmaking');
					  } else {
						document.getElementById('launch-matchmaking').textContent = window.dataMap.get('stop-matchmaking');
					}
					document.getElementById('join-room-title').textContent = window.dataMap.get('join-room-title');
					document.getElementById('join-room-text').textContent = window.dataMap.get('join-room-text');
					document.getElementById('join-input-id').placeholder = window.dataMap.get('join-input-id');
					document.getElementById('join-room-button-id').textContent = window.dataMap.get('validate-qr-code-id');
					document.getElementById('friend-stat').textContent = window.dataMap.get('friend-stat');
					const trashExplorer = document.getElementById('trash-explorer');
          if (trashExplorer)
            trashExplorer.textContent = window.dataMap.get('trash');
          const desktopExplorer = document.getElementById('desktop-explorer');
          if (desktopExplorer)
            desktopExplorer.textContent = window.dataMap.get('desktop');
				});

				let langageUrl = null;
				if (userInfo.language === 'fr') langageUrl = '../img/france_flag.png';
				else if (userInfo.language === 'en') langageUrl = '../img/uk_flag.png';
				else if (userInfo.language === 'pt') langageUrl = '../img/portugal_flag.png';
				else if (userInfo.language === 'ru') langageUrl = '../img/russia_flag.png';

				const flagIcon = document.querySelector('.flag-icon');
				if (flagIcon) {
					flagIcon.style.background = `url(${langageUrl})`;
					flagIcon.style.backgroundSize = "contain";
					flagIcon.style.backgroundRepeat = "no-repeat";
					flagIcon.style.backgroundPosition = "center";
					flagIcon.style.width = "32px";
					flagIcon.style.height = "32px";
				}

				updateUserInfo();
				updateUserStat();
				updateUserFriend(textUsername);
				updateMatchHistory();

				window.mmws = initMMWebSocket();
				window.ws = initWebSocket();
				loadMessageHistory();
				navigateToPage('desktop');
				slideUp();
			}

		  } else {
			raiseAlert('SignIn: ' + data.message);
		  }
		} else {
		  raiseAlert('SignIn: ' + data.error);
		}
	  } catch (error) {
		raiseAlert(window.dataMap.get('credentials-error'));
	  }
	});

	usernameInput.addEventListener('keypress', function(event) {
		if (event.key === 'Enter') {
			signInButton.click();
		}
	});

	passwordInput.addEventListener('keypress', function(event) {
		if (event.key === 'Enter') {
			signInButton.click();
		}
	});
  }

  function SignUp() {
	const loginPage = document.getElementById('login-id-page');

	if (!loginPage) {
	  console.error('login-id-page introuvable.');
	  return;
	}

	const usernameInput = loginPage.querySelector('#sign-up-username');
	const emailInput = loginPage.querySelector('#sign-up-email');
	const passwordInput = loginPage.querySelector('#sign-up-password');
	const confirmPasswordInput = loginPage.querySelector('#sign-up-confirm-password');
	const signUpButton = loginPage.querySelector('#button-register-page');

	if (!usernameInput || !emailInput || !passwordInput || !signUpButton) {
	  console.error('Certains éléments du formulaire de connexion sont introuvables.');
	  return;
	}

	signUpButton.addEventListener('click', async function() {
	const textUsername = usernameInput.value.trim();
	const textEmail = emailInput.value.trim();
	const textPassword = passwordInput.value.trim();
	const textConfirmPassword = confirmPasswordInput.value.trim();

	if (usernameInput == '' || emailInput == '' || passwordInput == '' || confirmPasswordInput == '') {
		raiseAlert(window.dataMap.get('fill-fields'));
		return ;
	}
	if (!(textPassword === textConfirmPassword)) {
		raiseAlert(window.dataMap.get('not-same-pwd'));
		return ;
	}

	const requestData = {
		username: textUsername,
		email: textEmail,
		password: textPassword,
		confirmation_password: textConfirmPassword,
	}

	try {
		const response = await fetch('/auth/register/', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(requestData),
		});

		if (response.ok) {
		  const data = await response.json();

		  if (data.message === 'success') {
				raiseAlert(window.dataMap.get('register-success'));
				displayRegister();
				document.cookie = `access_token=${data.access_token}; path=/; SameSite=None; Secure`;
			} else {
				raiseAlert('Signup: ' + data.message);
			}
		} else {
		  const errorData = await response.json();

		  if (errorData.errors) {
			let errorMessage = '';
			let field_txt = '';
			let messages_txt = '';
			for (const [field, messages] of Object.entries(errorData.errors)) {
				if (field === 'username') {
					field_txt = window.dataMap.get('sign-up-username');
				}
				if (field === 'email') {
					field_txt = window.dataMap.get('sign-up-email');
				}
				if (field === 'password') {
					field_txt = window.dataMap.get('sign-up-password');
				}
			  if (field === 'confirmation_password') {
					field_txt = window.dataMap.get('sign-up-confirm-password');
				}
				if (Array.isArray(messages) && messages.includes("Ensure this field has at least 2 characters.")) {
					messages_txt = window.dataMap.get('min-characters-error');
				}
				if (Array.isArray(messages) && messages.includes("Ensure this field has no more than 30 characters.")) {
					messages_txt = window.dataMap.get('max-characters-username-error');
				}
			  if (Array.isArray(messages) && messages.includes("This username is already taken.")) {
					messages_txt = window.dataMap.get('username-taken');
				}
				if (Array.isArray(messages) && messages.includes("This email is already taken.")) {
					messages_txt = window.dataMap.get('email-taken');
				}
				if (Array.isArray(messages) && messages.includes("Enter a valid email address.")) {
					messages_txt = window.dataMap.get('valid-email');
				}
				if (Array.isArray(messages) && messages.includes("The username can only contain alphanumeric characters or underscores.")) {
					messages_txt = window.dataMap.get('alphanumeric-username');
				}
				if (Array.isArray(messages) && messages.includes("You can't use 42 email to create an account. Please use 42 connection.")) {
					messages_txt = window.dataMap.get('no-42-email');
				}
				errorMessage += `${field_txt}: ${messages_txt}\n`;
				if (Array.isArray(messages) && messages.includes("Password too short")) {
					errorMessage = window.dataMap.get('too-short-pwd');
				}
				if (Array.isArray(messages) && messages.includes("No uppercase in password")) {
					errorMessage = window.dataMap.get('no-uppercase-pwd');
				}
				if (Array.isArray(messages) && messages.includes("No digit in password")) {
					errorMessage = window.dataMap.get('no-digit-pwd');
				}
				if (Array.isArray(messages) && messages.includes("This field may not be blank.")) {
					errorMessage = window.dataMap.get('fill-fields');
				}
			}
			raiseAlert(errorMessage);
		  } else {
			alert('Erreur : ' + (errorData.message || 'Problème de connexion au serveur.'));
		  }
		}
	} catch (error) {
		alert('Une erreur est survenue lors de la connexion au serveur.');
		console.error('Error:', error);
	}
});

	usernameInput.addEventListener('keypress', function(event) {
		if (event.key === 'Enter') {
			signUpButton.click();
		}
	});

	emailInput.addEventListener('keypress', function(event) {
		if (event.key === 'Enter') {
			signUpButton.click();
		}
	});

	passwordInput.addEventListener('keypress', function(event) {
		if (event.key === 'Enter') {
			signUpButton.click();
		}
	});

	confirmPasswordInput.addEventListener('keypress', function(event) {
		if (event.key === 'Enter') {
			signUpButton.click();
		}
	});

  }

async function SignIn42() {
	const loginPage = document.getElementById('login-id-page');

	if (!loginPage) {
			console.error('login-id-page introuvable.');
			return;
	}

	const login42 = loginPage.querySelector('.button-login-42');

	if (!login42) {
			console.error('login42 button introuvable');
			return;
	}

	login42.addEventListener('click', async function () {
			location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-8f558fa017dd0199841b4f9f6f35bb6dbe31e92375f37af4993b088964ae26f1&redirect_uri=https%3A%2F%2Flocalhost%3A8443&response_type=code';
	});

	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get('code');

	if (code) {
		urlParams.delete('code');
		window.history.replaceState({}, '', window.location.pathname + '?' + urlParams.toString());

		try {
			const response = await fetch('/auth/token/', {
					method: 'POST',
					headers: {
							'Content-Type': 'application/json',
					},
					body: JSON.stringify({ code: code }),
			});

			if (response.ok) {
					const data = await response.json();

					if (data.message === 'Success') {
							const userInfo = await getUserInfo(data.access_token);

							if (userInfo) {
								document.cookie = `access_token=${data.access_token}; path=/; SameSite=None; Secure`;
									localStorage.setItem(userInfo.username, JSON.stringify(userInfo));

									window.dict = `${userInfo.language}-dict.txt`;
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
										document.getElementById('create-room').textContent = window.dataMap.get('create-room');
										document.getElementById('join-room').textContent = window.dataMap.get('join-room');
										document.getElementById('game-over-txt').textContent = window.dataMap.get('game-over-txt');
										document.getElementById('game-over-quit').textContent = window.dataMap.get('game-over-quit');
										document.getElementById('start-button').textContent = window.dataMap.get('start-button');
										const noTournament = document.getElementById('no-tournament');
										if (noTournament != null)
											noTournament.textContent = window.dataMap.get('no-tournament');
										document.getElementById('client-invite').textContent = window.dataMap.get('client-invite');
										if (window.matchmaking) {
											document.getElementById('launch-matchmaking').textContent = window.dataMap.get('launch-matchmaking');
										  } else {
											document.getElementById('launch-matchmaking').textContent = window.dataMap.get('stop-matchmaking');
										}
										document.getElementById('join-room-title').textContent = window.dataMap.get('join-room-title');
										document.getElementById('join-room-text').textContent = window.dataMap.get('join-room-text');
										document.getElementById('join-input-id').placeholder = window.dataMap.get('join-input-id');
										document.getElementById('join-room-button-id').textContent = window.dataMap.get('validate-qr-code-id');
										document.getElementById('friend-stat').textContent = window.dataMap.get('friend-stat');
										const trashExplorer = document.getElementById('trash-explorer');
										if (trashExplorer)
											trashExplorer.textContent = window.dataMap.get('trash');
										const desktopExplorer = document.getElementById('desktop-explorer');
										if (desktopExplorer)
											desktopExplorer.textContent = window.dataMap.get('desktop');
									});

									let langageUrl = null;
									if (userInfo.language === 'fr') langageUrl = '../img/france_flag.png';
									else if (userInfo.language === 'en') langageUrl = '../img/uk_flag.png';
									else if (userInfo.language === 'pt') langageUrl = '../img/portugal_flag.png';
									else if (userInfo.language === 'ru') langageUrl = '../img/russia_flag.png';

									const flagIcon = document.querySelector('.flag-icon');
									if (flagIcon) {
										flagIcon.style.background = `url(${langageUrl})`;
										flagIcon.style.backgroundSize = "contain";
										flagIcon.style.backgroundRepeat = "no-repeat";
										flagIcon.style.backgroundPosition = "center";
										flagIcon.style.width = "32px";
										flagIcon.style.height = "32px";
									}

									updateUserInfo();
									updateUserStat();
									updateUserFriend(userInfo.username);
									updateMatchHistory();

									window.mmws = initMMWebSocket();
									window.ws = initWebSocket();
									loadMessageHistory();
									navigateToPage('desktop');

									slideUp();
							} else {
									raiseAlert('Token was not valid');
							}
					} else {
							raiseAlert('Sign42: ' + data.message);
					}
			} else {
					raiseAlert('Error: response 42 is not ok');
			}
		} catch (error) {
				console.error('Erreur réseau:', error);
		}
	}
}

async function can_sign_in() {
	try {
		const access_token = getTokenCookie();
		if (access_token) {
			const userInfo = await getUserInfo(access_token);

			if (userInfo) {
				updateUserInfo();
				updateUserStat();
				updateUserFriend(userInfo.username);
				updateMatchHistory();

				window.mmws = initMMWebSocket();
				window.ws = initWebSocket();
				loadMessageHistory();

				window.dict = `${userInfo.language}-dict.txt`;
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
					document.getElementById('create-room').textContent = window.dataMap.get('create-room');

					document.getElementById('join-room').textContent = window.dataMap.get('join-room');

					document.getElementById('game-over-txt').textContent = window.dataMap.get('game-over-txt');
					document.getElementById('game-over-quit').textContent = window.dataMap.get('game-over-quit');
					document.getElementById('start-button').textContent = window.dataMap.get('start-button');
					const noTournament = document.getElementById('no-tournament');
					if (noTournament != null)
						noTournament.textContent = window.dataMap.get('no-tournament');
					document.getElementById('client-invite').textContent = window.dataMap.get('client-invite');
					if (window.matchmaking) {
						document.getElementById('launch-matchmaking').textContent = window.dataMap.get('launch-matchmaking');
					  } else {
						document.getElementById('launch-matchmaking').textContent = window.dataMap.get('stop-matchmaking');
					}
					document.getElementById('join-room-title').textContent = window.dataMap.get('join-room-title');
					document.getElementById('join-room-text').textContent = window.dataMap.get('join-room-text');
					document.getElementById('join-input-id').placeholder = window.dataMap.get('join-input-id');
					document.getElementById('join-room-button-id').textContent = window.dataMap.get('validate-qr-code-id');
					document.getElementById('friend-stat').textContent = window.dataMap.get('friend-stat');
					const trashExplorer = document.getElementById('trash-explorer');
          if (trashExplorer)
            trashExplorer.textContent = window.dataMap.get('trash');
          const desktopExplorer = document.getElementById('desktop-explorer');
          if (desktopExplorer)
            desktopExplorer.textContent = window.dataMap.get('desktop');
				});

				let langageUrl = null;
				if (userInfo.language === 'fr') langageUrl = '../img/france_flag.png';
				else if (userInfo.language === 'en') langageUrl = '../img/uk_flag.png';
				else if (userInfo.language === 'pt') langageUrl = '../img/portugal_flag.png';
				else if (userInfo.language === 'ru') langageUrl = '../img/russia_flag.png';

				const flagIcon = document.querySelector('.flag-icon');
				if (flagIcon) {
					flagIcon.style.background = `url(${langageUrl})`;
					flagIcon.style.backgroundSize = "contain";
					flagIcon.style.backgroundRepeat = "no-repeat";
					flagIcon.style.backgroundPosition = "center";
					flagIcon.style.width = "32px";
					flagIcon.style.height = "32px";
				}

				const loginPage = document.getElementById('login-id-page');
				loginPage.style.display = 'none';
				navigateToPage('desktop');
			}
		}
	} catch (error) {
		console.error(error);
	}
}

function quitDesk() {
	document.cookie = "access_token=; path=/";
	document.cookie = "refresh_token=; path=/";
	history.replaceState({}, "", window.location.pathname);
	slideBack();
}

async function verify2FA() {
	const access_token = getTokenCookie();

	const loginPage = document.getElementById('login-id-page');
	const win_content = loginPage.querySelector('.window-content');
	const inputText = win_content.querySelector('.input-login-page');
	const code = inputText.value.trim();

	request_data = {
		otp_code: code
	};

	try {
		const response = await fetch('/auth/2FA/verify/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${access_token}`,
			},
			body: JSON.stringify(request_data)
		});

		if (response.ok) {
			const data = await response.json();
			if (data.message === 'Success') {
				const userInfo = await getUserInfo(access_token);
				window.dict = `${userInfo.language}-dict.txt`;
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
					if (tournamentName != 'Aucun Tournoi Sélectionné' && tournamentName != 'Nenhum torneio selecionado' && tournamentName != 'No Tournament Selected')
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
					document.getElementById('client-invite').textContent = window.dataMap.get('client-invite');
					if (window.matchmaking) {
						document.getElementById('launch-matchmaking').textContent = window.dataMap.get('launch-matchmaking');
					} else {
						document.getElementById('launch-matchmaking').textContent = window.dataMap.get('stop-matchmaking');
					}
					document.getElementById('join-room-title').textContent = window.dataMap.get('join-room-title');
					document.getElementById('join-room-text').textContent = window.dataMap.get('join-room-text');
					document.getElementById('join-input-id').placeholder = window.dataMap.get('join-input-id');
					document.getElementById('join-room-button-id').textContent = window.dataMap.get('validate-qr-code-id');
					document.getElementById('friend-stat').textContent = window.dataMap.get('friend-stat');
					const trashExplorer = document.getElementById('trash-explorer');
          if (trashExplorer)
            trashExplorer.textContent = window.dataMap.get('trash');
          const desktopExplorer = document.getElementById('desktop-explorer');
          if (desktopExplorer)
            desktopExplorer.textContent = window.dataMap.get('desktop');
				});

				let langageUrl = null;
				if (userInfo.language === 'fr') langageUrl = '../img/france_flag.png';
				else if (userInfo.language === 'en') langageUrl = '../img/uk_flag.png';
				else if (userInfo.language === 'pt') langageUrl = '../img/portugal_flag.png';
				else if (userInfo.language === 'ru') langageUrl = '../img/russia_flag.png';

				const flagIcon = document.querySelector('.flag-icon');
				if (flagIcon) {
					flagIcon.style.background = `url(${langageUrl})`;
					flagIcon.style.backgroundSize = "contain";
					flagIcon.style.backgroundRepeat = "no-repeat";
					flagIcon.style.backgroundPosition = "center";
					flagIcon.style.width = "32px";
					flagIcon.style.height = "32px";
				}

				updateUserInfo();
				updateUserStat();
				updateUserFriend(textUsername);
				updateMatchHistory();

				window.mmws = initMMWebSocket();
				window.ws = initWebSocket();
				loadMessageHistory();
				navigateToPage('desktop');
				slideUp();
			} else {
				raiseAlert(data.message);
			}
		} else {
			if (errorMessage.message === 'failed : wrong 2FA code') {
				raiseAlert('Wrong code');
			}
			else if (errorData.message === 'failed : access_token is invalid' || errorData.message === 'failed : access_token is expired') {
				const isRefreshed = await getRefreshToken();
				if (isRefreshed) {
					return await verify2FA();
				}
			} else {
				console.error(errorData.message);
			}
		}
	} catch(error) {
		console.error(error);
	}
}

document.addEventListener('DOMContentLoaded', function() {
	can_sign_in();
	SignIn();
	SignUp();
	SignIn42();

    const button_2fa = document.getElementById('2fa-button');
	button_2fa.addEventListener('click', verify2FA);
});
