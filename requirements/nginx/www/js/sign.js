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
			document.cookie = `acces_token=${data.access_token}; path=/`;
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
	  try {
		const response = await fetch('/auth/token/', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		});

		if (response.ok) {
		  const data = await response.json();
		  alert('Connexion réussie !');
		  document.cookie = `access_token=${data.access_token}; path=/`;
		} else {
		  const errorData = await response.json();
		  alert('Erreur : ' + (errorData.message_error || 'Échec de la connexion.'));
		  console.error('Erreur API 42:', errorData);
		}
	  } catch (error) {
		alert('Une erreur est survenue lors de la tentative de connexion.');
		console.error('Erreur de requête:', error);
	  }
	});
  }

  document.addEventListener('DOMContentLoaded', function() {
	SignIn();
	SignUp();
	SignIn42();
  });