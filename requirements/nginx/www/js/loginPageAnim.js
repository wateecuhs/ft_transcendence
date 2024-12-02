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

  document.getElementById("button-sign-up-page").addEventListener("click", function () {
	displayRegister();
  });

  function displayRegister() {
	const registerSection = document.querySelector(".register");
	if (registerSection.style.display === "none" || !registerSection.style.display) {
		registerSection.style.display = "flex";
		registerSection.style.animation = "slide-in 0.5s ease forwards";
	} else {
		registerSection.style.animation = "slide-out 0.5s ease forwards";
		setTimeout(() => {
			registerSection.style.display = "none";
		}, 500);
	}
  }
  