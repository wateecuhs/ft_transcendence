function togglePongWindow() {
	const pongWindow = document.getElementById('PongGame');

	if (pongWindow.style.display === 'none') {
	  pongWindow.style.display = 'flex';
	  history.pushState({ page: "pong" }, "", "#pong");
	} else {
	  pongWindow.style.display = 'none';
	}
  }

  window.addEventListener('popstate', function (event) {
	const currentPage = window.location.hash;

	if (currentPage === "#pong") {
		togglePongWindow();
	}
  });
