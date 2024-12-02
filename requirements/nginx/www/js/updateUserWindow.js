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

function changeUserInfo(token) {
	const userInfo = localStorage.getItem(token);

	if (userInfo) {
		const user = JSON.parse(userInfo);
		
	}
}

document.addEventListener('DOMContentLoaded', function() {

});
