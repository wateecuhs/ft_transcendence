function togglePongWindow(roomId) {
	const pongWindow = document.getElementById('PongGame');

	if (pongWindow.style.display === 'none') {
	  pongWindow.style.display = 'flex';
	  history.pushState({ page: "pong" }, "", "#pong");
	} else {
	  pongWindow.style.display = 'none';
	  stopGameInstance(roomId);
	}
	pongWindow.querySelector('.close-button').addEventListener('click', function() {
		pongWindow.style.display = 'none';
		stopGameInstance(roomId);
	});
}

// ------------------ Need to find a way to pass room id to event listener ------------------
//   window.addEventListener('popstate', function (event) {
// 	const currentPage = window.location.hash;

// 	if (currentPage === "#pong") {
// 		togglePongWindow('room_ai');
// 	}
//   });

  function stopGameInstance(roomId) {
	// const roomName = "room1"; // Replace with dynamic room name
	// console.log('stopGameInstance called, roomId:', roomId);
	let socket;
	if (roomId === 'room_ai'){
		socket = new WebSocket('wss://' + window.location.host + '/ai_game/rooms/' + roomId + '/');
	}
	else {
		socket = new WebSocket('wss://' + window.location.host + '/game/rooms/' + roomId + '/');
	}
	socket.onopen = function() {
		socket.send(JSON.stringify({ type: 'disconnect' }));
		document.removeEventListener('keydown', handleKeyDown);
		document.removeEventListener('keyup', handleKeyUp);
		socket.close();
	};
 }

 function handleKeyDown(event) {
	commandBuffer.type = 'handler';
	if (event.key === 'w') commandBuffer.move_left_up = true;
	if (event.key === 's') commandBuffer.move_left_down = true;
	if (event.key === 'ArrowUp') commandBuffer.move_right_up = true;
	if (event.key === 'ArrowDown') commandBuffer.move_right_down = true;
}

function handleKeyUp(event) {
	commandBuffer.type = 'handler';
	if (event.key === 'w') commandBuffer.move_left_up = false;
	if (event.key === 's') commandBuffer.move_left_down = false;
	if (event.key === 'ArrowUp') commandBuffer.move_right_up = false;
	if (event.key === 'ArrowDown') commandBuffer.move_right_down = false;
}
