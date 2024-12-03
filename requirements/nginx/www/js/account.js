async function updateUserInfo(accesUsername) {
	const userInfo = localStorage.getItem(accesUsername);

	if (userInfo) {
		const user = JSON.parse(userInfo);

		document.querySelector("#account-page-0 .user-img span").textContent = user.alias || 'default pseudo';
    document.querySelector("#account-page-0 ul li:nth-child(1)").textContent = `Name: ${user.username || 'default'}`;
    document.querySelector("#account-page-0 ul li:nth-child(2)").textContent = `Email address: ${user.email || 'default@gmail.com'}`;
		document.querySelector("#account-page-0 ul li:nth-child(3)").textContent = `42 Member: ${user.is_42_account || 'false'}`;
    document.querySelector("#account-page-0 ul li:nth-child(4)").textContent = `Alias: ${user.alias || 'defuat_alias'}`;

		const avatarImg = document.querySelector("#account-page-0 .user-img img");
		avatarImg.src = user.avatar_path || 'img/png/game_spider-0.png';
		console.log(user.avatar_path);
	} else {
		console.error('Impossible de récupérer les informations utilisateur.');
	}
}
