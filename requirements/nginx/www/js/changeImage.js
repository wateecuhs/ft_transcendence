function openFileSelector() {
	document.getElementById('file-input').click();
  }
function changeImage() {
	const fileInput = document.getElementById('file-input');
	const file = fileInput.files[0];

	if (file) {
	  const reader = new FileReader();

	  reader.onload = function(event) {
		const accountWin = document.getElementById("accountWindow");
		const fullNameText = accountWin.querySelector("#account-page-0 ul li:nth-child(1)").textContent.trim();
		const userNameText = fullNameText.replace("Name: ", "").trim();
		const storedUserInfo = localStorage.getItem(userNameText);

		if (!storedUserInfo) {
				alert("Erreur : Impossible de récupérer l'utilisateur.");
				return;
		}
		const user = JSON.parse(storedUserInfo);

		const requestData = {
			new_pp: event.target.result
		};

		const response = fetch('/auth/user/me', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${user.access_token}`,
			},
			body: JSON.stringify(requestData),
		})

		const data = response.json();
		if (response.ok && data.message === 'Success') {
			const updatedUserInfo = getUserInfo(user.access_token);
			if (updatedUserInfo) {
					localStorage.setItem(userNameText, JSON.stringify(updatedUserInfo));
					updateUserInfo(userNameText);
			}
		} else {
			console.error('Echec: ' + (data.message || 'Erreur inconnue.'));
		}
	  };

	  reader.readAsDataURL(file);
	}
  }
