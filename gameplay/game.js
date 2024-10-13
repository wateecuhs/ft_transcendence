const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 20;
const paddleHeight = 100;
const ballRadius = 10;

const socket = new WebSocket('ws://localhost:6789');

socket.onmessage = function(event) {
	const gameState = JSON.parse(event.data);
	drawGame(gameState);
};

document.addEventListener('keydown', (event) => {
    const command = {};
    if (event.key === 'w') command.move_left_up = true;
    if (event.key === 's') command.move_left_down = true;
    if (event.key === 'ArrowUp') command.move_right_up = true;
    if (event.key === 'ArrowDown') command.move_right_down = true;
    socket.send(JSON.stringify(command));
});

document.addEventListener('keyup', (event) => {
    const command = {};
    if (event.key === 'w') command.move_left_up = false;
    if (event.key === 's') command.move_left_down = false;
    if (event.key === 'ArrowUp') command.move_right_up = false;
    if (event.key === 'ArrowDown') command.move_right_down = false;
    socket.send(JSON.stringify(command));
});

function drawGame(state) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw paddles
	ctx.fillStyle = "white";
	ctx.fillRect(state.paddle_left.x, state.paddle_left.y, paddleWidth, paddleHeight);
	ctx.fillRect(state.paddle_right.x, state.paddle_right.y, paddleWidth, paddleHeight);

	// Draw ball
	ctx.beginPath();
	ctx.arc(state.ball.x, state.ball.y, ballRadius, 0, Math.PI * 2);
	ctx.fill();
	ctx.closePath();

	// Draw score
	ctx.font = "40px Arial";
	ctx.fillText(state.score[0], canvas.width / 4, 50);
	ctx.fillText(state.score[1], canvas.width * 3 / 4, 50);
}
