function togglePongWindow() {
	const pongWindow = document.getElementById('PongGame');

	if (pongWindow.style.display === 'none') {
	  pongWindow.style.display = 'flex';
	  history.pushState({ page: "pong" }, "", "#pong");
	  runGame();
	} else {
	  pongWindow.style.display = 'none';
	  stopGameInstance();
	}

	pongWindow.querySelector('.close-button').addEventListener('click', function() {
		pongWindow.style.display = 'none';
		stopGameInstance();
	  });
  }

  window.addEventListener('popstate', function (event) {
	const currentPage = window.location.hash;

	if (currentPage === "#pong") {
		togglePongWindow();
	}
  });

  function stopGameInstance() {
	const roomName = "room1"; // Replace with dynamic room name
	const socket = new WebSocket('wss://' + window.location.host + '/game/rooms/' + roomName + '/');
	socket.onopen = function() {
		socket.send(JSON.stringify({ type: 'disconnect' }));
		document.removeEventListener('keydown', handleKeyDown);
		document.removeEventListener('keyup', handleKeyUp);
		socket.close();
	};
 }
