function openFileSelector() {
	document.getElementById('file-input').click();
  }

	async function changeImage() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = async function (event) {
        const accountWin = document.getElementById("accountWindow");
        const fullNameText = accountWin.querySelector("#account-page-0 ul li:nth-child(1)").textContent.trim();
        const userNameText = fullNameText.replace("Name: ", "").trim();
        const storedUserInfo = localStorage.getItem(userNameText);

            if (!storedUserInfo) {
                alert("Erreur : Impossible de récupérer l'utilisateur.");
                return;
            }

            let access_token = getTokenCookie();

            const requestData = {
                new_pp: event.target.result
            };

            const response = await fetch('/auth/user/me/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: JSON.stringify(requestData),
            });

            try {
                    const data = await response.json();
                    if (response.ok && data.message === 'Success') {
                        const updatedUserInfo = await getUserInfo(access_token);

                        if (updatedUserInfo) {
                            localStorage.setItem(userNameText, JSON.stringify(updatedUserInfo));
                            updateUserInfo(userNameText);
                        }
                    } else {
                        raiseAlert(data.message);
                    }
            } catch (error) {
                console.error('Failed to parse JSON response:', error);
                const rawResponse = await response.text();
                console.error('Response body as text:', rawResponse);
            }
        };

        reader.readAsDataURL(file);
    }
}
