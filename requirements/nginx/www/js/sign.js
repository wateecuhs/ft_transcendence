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
		alert('Veuillez remplir tous les champs.');
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

			updateUserInfo(textUsername);

			slideUp();
		  } else {
			alert('Échec : ' + (data.message || 'Erreur inconnue.'));
		  }
		} else {

		  const errorData = await response.json();
		  alert('Erreur : ' + (errorData.message || 'Problème de connexion au serveur.'));
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
		alert('Veuillez remplir tous les champs.');
		return ;
	  }

	  if (!(textPassword === textConfirmPassword)) {
		alert('Les mots de passe envoyes ne sont pas les memes.');
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
				alert('Inscription reussie');
				displayRegister();
				document.cookie = `access_token=${data.access_token}; path=/`;
			} else {
				alert('Echec : ' + (data.errors || 'Erreur incconue.'));
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

function SignIn42() {
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
		location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-8f558fa017dd0199841b4f9f6f35bb6dbe31e92375f37af4993b088964ae26f1&redirect_uri=https%3A%2F%2Flocalhost%3A8443%2Fauth%2Ftoken%2F&response_type=code'
	});
}

async function getAuthCodeAndRequestToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const access_token = urlParams.get('code');
	console.log(access_token);

    if (!access_token) {
        console.error('Code d\'autorisation non trouvé dans l\'URL');
        return;
    }

	try {
		window.location.replace('https://localhost:8843');
		const userInfo = await getUserInfo(access_token);
		if (userInfo) {
			localStorage.setItem(userInfo.username, JSON.stringify(userInfo));
			updateUserInfo(userInfo.username);
		}
		slideUp();
	} catch (error) {
		console.error('Erreur lors de la gestion du token:', error);
	}
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.href.includes('/auth/token/')) {
		alert('test44');
        getAuthCodeAndRequestToken();
    }
});

document.addEventListener('DOMContentLoaded', function() {
	SignIn();
	SignUp();
	SignIn42();
  });
