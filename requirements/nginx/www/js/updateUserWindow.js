const userWindow = document.getElementById('updateUserWindow');

function displayUserUpdateWindow() {
	if (userWindow.style.display === 'none') {
		setWindowIndex();
		userWindow.style.zIndex = 3000;
	}
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

			let access_token = getTokenCookie();

			try {
				const userInfo = await getUserInfo(access_token);
				if (userInfo.is_42_account && (oldPasswordText || passwordText || confirmPasswordText)) {
					raiseAlert("Your account is linked to 42, can't change password");
					return ;
				}
			} catch (error) {
				console.error(error);
				return ;
			}

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
							'Authorization': `Bearer ${getTokenCookie()}`,
					},
					body: JSON.stringify(requestData),
			});

			const data = await response.json();
			if (response.ok && data.message === 'Success') {
					raiseAlert(window.dataMap.get('change-info'));

					updateUserInfo();

					inputAlias.value = '';
					inputEmail.value = '';
					inputOldPassword.value='';
					inputPassword.value = '';
					inputConfirmPassword.value = '';
			} else {
					if (data.errors) {
						let errorMessage = '';
						let field_txt = '';
						let messages_txt = '';
						for (const [field, messages] of Object.entries(data.errors)) {
							if (field === 'new_alias') {
								field_txt = window.dataMap.get('error-alias');
							}
							if (field === 'new_email') {
								field_txt = window.dataMap.get('sign-up-email');
							}
							if (field === 'new_password') {
								field_txt = window.dataMap.get('sign-up-password');
							}
							if (field === 'confirmation_password') {
								field_txt = window.dataMap.get('sign-up-confirm-password');
							}
							if (Array.isArray(messages) && messages.includes("Ensure this field has at least 2 characters.")) {
								messages_txt = window.dataMap.get('min-characters-error');
							}
							if (Array.isArray(messages) && messages.includes("Ensure this field has no more than 20 characters.")) {
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
							if (Array.isArray(messages) && messages.includes("Bad old password")) {
								field_txt = window.dataMap.get('old-password');
								messages_txt = window.dataMap.get('bad-old-password');
							}
							if (Array.isArray(messages) && messages.includes('All change password fields are not filled')) {
								field_txt = window.dataMap.get('profile-password');
								messages_txt = window.dataMap.get('password-empty');
							}
							if (Array.isArray(messages) && messages.includes('New password and Confirm New Password are different')) {
								field_txt = window.dataMap.get('profile-password');
								messages_txt = window.dataMap.get('different-pwd');
							}
							if (Array.isArray(messages) && messages.includes("You can't use 42 email to create an account. Please use 42 connection.")) {
								messages_txt = window.dataMap.get('no-42-email');
								field_txt = window.dataMap.get('sign-up-email');
							}
							if (Array.isArray(messages) && messages.includes("This email is already taken.")) {
								messages_txt = window.dataMap.get('email-taken');
								field_txt = window.dataMap.get('sign-up-email');
							}
							if (Array.isArray(messages) && messages.includes("This alias is already taken.")) {
								messages_txt = window.dataMap.get('alias-taken');
								field_txt = window.dataMap.get('error-alias');
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
					}
			}
	} catch (error) {
			raiseAlert('Update Error');
			console.error('Update Error', error);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const updateButton = document.getElementById('update-button');
	if (updateButton) {
		updateButton.addEventListener('click', updateUser);
	} else {
			console.error("Update button not found in the DOM.");
	}
});