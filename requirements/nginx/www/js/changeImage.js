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
                    if (errorData.message.startsWith('failed : access token') || errorData.message === 'failed : access_token is invalid' || errorData.message === 'failed : access_token is expired') {
                        const isRefreshed = await getRefreshToken();
                        if (isRefreshed) {
                          return changeImage();
                        }
                        else {
                            quitDesk();
                            let expired_session = null;
                            if (window.dataMap && window.dataMap.has('expired-session'))
                                expired_session = window.dataMap.get('expired-session');
                            else
                                expired_session = 'Session expired';
                            raiseAlert(expired_session);
                        }
                      } else {
                        raiseAlert('Getuser:' + errorData.message);
                      }
                }
            } catch (error) {
                if (error.message.startsWith("unexpected") || error.message.startsWith("Unexpected")) {
                    let too_big_img = null;
                    if (window.dataMap && window.dataMap.has('too-big-img'))
                        too_big_img = window.dataMap.get('too-big-img');
                    else
                        too_big_img = 'This image is too big';
                    raiseAlert(too_big_img);
                }
                else
                    console.error('Failed to parse JSON response:', error);
            }
        };

        reader.readAsDataURL(file);
    }
}
