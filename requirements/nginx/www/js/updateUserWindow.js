const userWindow = document.getElementById('updateUserWindow');

function displayUserUpdateWindow() {
	userWindow.style.display = (userWindow.style.display == 'none') ? 'block' : 'none';
	userWindow.style.position = 'absolute';
	userWindow.style.top = `${window.innerHeight / 2 - userWindow.offsetHeight / 2}px`;
	userWindow.style.left = `${window.innerWidth / 2 - userWindow.offsetWidth / 2}px`;
}

userWindow.querySelector('.close-button').addEventListener('click', function() {
	userWindow.style.display = 'none';
});

async function updateUser() {
	try {
			const accountWin = document.getElementById("accountWindow");
			const fullNameText = accountWin.querySelector("#account-page-0 ul li:nth-child(1)").textContent.trim();
			const userNameText = fullNameText.replace("Name: ", "").trim();

			const storedUserInfo = localStorage.getItem(userNameText);
			if (!storedUserInfo) {
					alert("Erreur : Impossible de récupérer l'utilisateur.");
					return;
			}
			const user = JSON.parse(storedUserInfo);

			const updateUserWindow = document.getElementById("updateUserWindow");
			const inputAlias = updateUserWindow.querySelector('.window-content input:nth-child(1)');
			const inputEmail = updateUserWindow.querySelector('.window-content input:nth-child(2)');
			const inputOldPassword = updateUserWindow.querySelector('.window-content input:nth-child(3)');
			const inputPassword = updateUserWindow.querySelector('.window-content input:nth-child(4)');
			const inputConfirmPassword = updateUserWindow.querySelector('.window-content input:nth-child(5)');

			const aliasText = inputAlias.value.trim();
			const emailText = inputEmail.value.trim();
			const oldPasswordText = inputOldPassword.value.trim();
			const passwordText = inputPassword.value.trim();
			const confirmPasswordText = inputConfirmPassword.value.trim();

			const requestData = {
					new_alias: aliasText,
					new_email: emailText,
					old_password: oldPasswordText,
					new_password: passwordText,
					confirmation_password: confirmPasswordText,
			};

			const response = await fetch('/auth/user/me/', {
					method: 'PUT',
					headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${user.access_token}`,
					},
					body: JSON.stringify(requestData),
			});

			const data = await response.json();
			if (response.ok && data.message === 'Success') {
					alert('Les informations ont été changées avec succès.');

					const updatedUserInfo = await getUserInfo(user.access_token);
					if (updatedUserInfo) {
							localStorage.setItem(userNameText, JSON.stringify(updatedUserInfo));
							updateUserInfo(userNameText);
					}

					alert(userNameText);

					inputAlias.value = '';
					inputEmail.value = '';
					inputPassword.value = '';
					inputConfirmPassword.value = '';
			} else {
					alert('Échec : ' + (data.message || 'Erreur inconnue.'));
			}
	} catch (error) {
			alert('Une erreur est survenue lors de la mise à jour des informations utilisateur.');
			console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const updateButton = document.getElementById('updateButton');
	if (updateButton) {
		console.log('test');
		updateButton.addEventListener('click', updateUser);
	} else {
			console.error("Update button not found in the DOM.");
	}
});