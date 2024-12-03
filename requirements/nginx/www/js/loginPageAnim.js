function slideUp() {
	const loginPage = document.getElementById('login-id-page');

	loginPage.classList.add('slide-up');
	setTimeout(function() {
	  loginPage.style.display = 'none';
	}, 1000);
}

function slideBack() {
	const loginPage = document.getElementById('login-id-page');

	loginPage.style.display = 'flex';
	loginPage.classList.add('slide-back');
}

function displayRegister() {
	const loginPage = document.getElementById('login-id-page')
	const registerSection = loginPage.querySelector('.register');
	if (registerSection.style.display === 'none') {
		registerSection.style.display = 'flex';
		registerSection.style.animation = "slide-in 0.5s ease forwards";
	} else {
		registerSection.style.animation = "slide-out 0.5s ease forwards";
		setTimeout(() => {
			registerSection.style.display = 'none';
		}, 500);
	}
}

document.getElementById("button-sign-up-page").addEventListener("click", function () {
	displayRegister();
});
  