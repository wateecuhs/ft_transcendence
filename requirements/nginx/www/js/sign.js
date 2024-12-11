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
		raiseAlert('Veuillez remplir tous les champs.');
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
			document.cookie = `access_token=${data.access_token}; path=/`;
			const userInfo = await getUserInfo(data.access_token);

			if (userInfo) {
			  localStorage.setItem(textUsername, JSON.stringify(userInfo));
			}

			if (userInfo.is_2FA === true) {
				const win_2fa = loginPage.querySelector('#window-2fa-sign');
				win_2fa.style.display = 'flex';
			} else {
				updateUserInfo(textUsername);
				updateUserStat();
				slideUp();
			}

		  } else {
			raiseAlert(data.message);
		  }
		} else {
		  raiseAlert(errorData.message);
		}
	  } catch (error) {
		alert('Une erreur est survenue lors de la connexion au serveur.');
		console.error('Error:', error);
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

	  if (!usernameInput || !emailInput || !passwordInput || !signUpButton) {
		raiseAlert('Veuillez remplir tous les champs.');
		return ;
	  }

	  if (!(textPassword === textConfirmPassword)) {
		raiseAlert('Les mots de passe envoyes ne sont pas les memes.');
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
				raiseAlert('Inscription reussie');
				displayRegister();
				document.cookie = `access_token=${data.access_token}; path=/`;
			} else {
				raiseAlert(data.message);
			}
		} else {
		  const errorData = await response.json();

		  if (errorData.errors) {
			let errorMessage = 'Erreur de validation :\n';
			for (const [field, messages] of Object.entries(errorData.errors)) {
			  errorMessage += `${field}: ${messages.join(', ')}\n`;
			}
			alert(errorMessage);
		  } else {
			alert('Erreur : ' + (errorData.message || 'Problème de connexion au serveur.'));
		  }
		}
	  } catch (error) {
		alert('Une erreur est survenue lors de la connexion au serveur.');
		console.error('Error:', error);
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
	  return ;
	}

	login42.addEventListener('click', async function () {
		location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-8f558fa017dd0199841b4f9f6f35bb6dbe31e92375f37af4993b088964ae26f1&redirect_uri=https%3A%2F%2Flocalhost%3A8443&response_type=code'
	});

	const urlParams = new URLSearchParams(window.location.search);

	const code = urlParams.get('code');

	if (code) {
        console.log('Code récupéré:', code);

        try {
            const response = await fetch('/auth/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: code })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.message === 'Success') {
					const userInfo = await getUserInfo(data.access_token);

					if (userInfo) {
						document.cookie = `access_token=${data.access_token}; path=/`;
						localStorage.setItem(userInfo.username, JSON.stringify(userInfo));
						updateUserInfo(userInfo.username);
						updateUserStat();
						slideUp();
					} else {
						raiseAlert('Token was not valid');
					}
                } else {
                    raiseAlert(data);
                }
            } else {
				raiseAlert('Error: response 42 is not ok');
			}
        } catch (error) {
            console.error('Erreur réseau:', error);
        }
    } else {
        console.error('Aucun code trouvé dans l\'URL');
    }
}

async function can_sign_in() {
	try {
		const access_token = getTokenCookie();
		if (access_token) {
			const userInfo = await getUserInfo(access_token);
			if (userInfo) {
				updateUserInfo(userInfo.username);
				updateUserStat();
				const loginPage = document.getElementById('login-id-page');
				loginPage.style.display = 'none';
			}
		}
	} catch (error) {
		console.log(error);
	}
}

document.addEventListener('DOMContentLoaded', function() {
	can_sign_in();
	SignIn();
	SignUp();
	SignIn42();

	const loginPage = document.getElementById('login-id-page');
    const win_content = loginPage.querySelector('.window-content');
    const button_2fa = win_content.querySelector('.button-login-page');


	button_2fa.addEventListener('click', async function() {

		const access_token = getTokenCookie();
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
					const user = await getUserInfo(access_token);
					updateUserInfo(user.username);
					slideUp();
				} else {
					raiseAlert(data.message);
				}
			} else {
				raiseAlert('Wrong 2FA code');
			}
		} catch(error) {
			console.log(error);
		}
	});
});
