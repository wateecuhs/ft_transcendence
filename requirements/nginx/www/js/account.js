/*async function updateUserInfo(accesUsername) {
	const userInfo = localStorage.getItem(accesUsername);
	console.log("Test " + userInfo);
	if (userInfo) {
		const user = JSON.parse(userInfo);

		document.querySelector("#account-page-0 .user-img span").textContent = user.alias || 'default pseudo';
    	document.querySelector("#account-page-0 ul li:nth-child(1)").textContent = `${window.dataMap.get('account-name')}: ${user.username || 'default'}`;
    	document.querySelector("#account-page-0 ul li:nth-child(2)").textContent = `${window.dataMap.get('sign-up-email')}: ${user.email || 'default@gmail.com'}`;
		document.querySelector("#account-page-0 ul li:nth-child(3)").textContent = `${window.dataMap.get('account-42')}: ${user.is_42_account || 'false'}`;
    	document.querySelector("#account-page-0 ul li:nth-child(4)").textContent = `${window.dataMap.get('account-alias')}: ${user.alias || 'default_alias'}`;

		const avatarImg = document.querySelector("#account-page-0 .user-img img");
		alert(user.avatar_path);
		avatarImg.src = user.avatar_path || 'img/png/game_spider-0.png';
		console.log(user.avatar_path);
	} else {
		console.error('Impossible de récupérer les informations utilisateur.');
	}
}*/
