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
        const userNameText = fullNameText.replace(`${window.dataMap.get("account-name")}: `, "").trim();
        const storedUserInfo = localStorage.getItem(userNameText);

            if (!storedUserInfo) {
                raiseAlert("Error : user not found.");
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
                if (response.ok) {
                    const data = await response.json();
                    if (data.message === 'Success') {
                        updateUserInfo();
                    } else {
                        raiseAlert(data.message);
                    }
                } else {
                    const errorData = await response.json();
                    if (errorData.message === 'failed : access_token is invalid' || errorData.message === 'failed : access_token is expired') {
                        const isRefreshed = await getRefreshToken();
                        if (isRefreshed) {
                          return changeImage();
                        }
                      } else {
                        raiseAlert('Getuser:' + errorData.message);
                      }
                }
            } catch (error) {
                if (error.message.startsWith("Unexpected")) {
                    raiseAlert(window.dataMap.get('too-big-img'));
                }
                else
                    console.error('Failed to parse JSON response:', error);
            }
        };

        reader.readAsDataURL(file);
    }
}
