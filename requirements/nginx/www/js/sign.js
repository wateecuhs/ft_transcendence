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
	  console.error('Cant find some elements of the login form.');
	  return;
	}

	signInButton.addEventListener('click', async function() {
	  const textUsername = usernameInput.value.trim();
	  const textPassword = passwordInput.value.trim();

	  if (!textUsername || !textPassword) {
		let fill_fields = null;
		if (window.dataMap && window.dataMap.has('fill-fields'))
			fill_fields = window.dataMap.get('fill-fields');
		else
			fill_fields = 'All fields are required';
		raiseAlert(fill_fields);
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
					translate();
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
		let credentials_error = null;
		if (window.dataMap && window.dataMap.has('credentials-error'))
			credentials_error = window.dataMap.get('credentials-error');
		else
			credentials_error = 'Invalid credentials';
		raiseAlert(credentials_error);
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
	  console.error('Cant find some elements of the register form.');
	  return;
	}

	signUpButton.addEventListener('click', async function() {
	const textUsername = usernameInput.value.trim();
	const textEmail = emailInput.value.trim();
	const textPassword = passwordInput.value.trim();
	const textConfirmPassword = confirmPasswordInput.value.trim();

	if (usernameInput == '' || emailInput == '' || passwordInput == '' || confirmPasswordInput == '') {
		let fill_fields = null;
		if (window.dataMap && window.dataMap.has('fill-fields'))
			fill_fields = window.dataMap.get('fill-fields');
		else
			fill_fields = 'All fields are required';
		raiseAlert(fill_fields);
		return ;
	}
	if (!(textPassword === textConfirmPassword)) {
		let not_same_pwd = null;
		if (window.dataMap && window.dataMap.has('not-same-pwd'))
			not_same_pwd = window.dataMap.get('not-same-pwd');
		else
			not_same_pwd = "Passwords don't match.";
		raiseAlert(not_same_pwd);
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
				let register_success = null;
				if (window.dataMap && window.dataMap.has('register-success'))
					register_success = window.dataMap.get('register-success');
				else
					register_success = 'Registration successful.';
				raiseAlert(register_success);
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
			alert('Erreur : ' + (errorData.message || 'Login error'));
		  }
		}
	} catch (error) {
		alert('Login error');
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
		try {
			const response = await fetch('/auth/redirect/', {
				method: 'GET'
			});
			if (response.ok) {
				const data = await response.json();
				if (data.message === 'Success')
					location.href = data.link;
			} else {
				console.error('Network error:', response);
			}
		} catch (error) {
			console.error(error);
		}
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
										translate();
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
								}
							} else {
									raiseAlert('Token was not valid');
							}
					} else {
							raiseAlert('Sign42: ' + data.message);
					}
			} else {
					raiseAlert(window.dataMap.get('response-42'));
			}
		} catch (error) {
				console.error('Network error:', error);
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
					translate();
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
	document.cookie = "access_token=; path=/; SameSite=None; Secure";
	document.cookie = "refresh_token=; path=/; SameSite=None; Secure";

  	const button = document.getElementById('launch-matchmaking');
	let launchMatchmaking = null;
	if (window.dataMap && window.dataMap.has('launch-matchmaking'))
		launchMatchmaking = window.dataMap.get('launch-matchmaking');
	else
		launchMatchmaking = 'Launch matchmaking';
	button.textContent = launchMatchmaking;
    window.matchmaking = true;

	const pong = document.getElementById('PongGame');
	pong.style.display = 'none';
	history.replaceState({}, "", window.location.pathname);

	if (window.mmws) window.mmws.close();
	if (window.ws) window.ws.close();
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

		const data = await response.json();
		if (response.ok) {
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
					translate();
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

				console.log('2FA verified');
				window.mmws = initMMWebSocket();
				window.ws = initWebSocket();
				loadMessageHistory();
				navigateToPage('desktop');
				slideUp();
			} else {
				raiseAlert(data.message);
			}
		} else {
			if (data.message === 'failed : wrong 2FA code') {
				raiseAlert('Wrong code');
			}
			else if (errorData.message.startsWith('failed : access token') || errorData.message === 'failed : access_token is invalid' || errorData.message === 'failed : access_token is expired') {
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
