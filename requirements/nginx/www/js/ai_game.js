function initAIGame() {

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let paddleWidth = 20;
let paddleHeight = 100;
let ballRadius = 10;
const winWidth = 800;
const winHeight = 600;

const roomName = "room1"; // Replace with dynamic room name if needed
const socket = new WebSocket('wss://' + window.location.host + '/ai_game/ws/ai_game/' + roomName + '/');

socket.onopen = function() {
    console.log('WebSocket connection established');
};

socket.onerror = function(error) {
    console.error('WebSocket error:', error);
};

socket.onmessage = function(event) {
    console.log('Received message:', event.data);
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

function resizeCanvas() {
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;
    canvas.width = width;
    canvas.height = height;

    // Adjust paddle and ball sizes based on new canvas size
    paddleWidth = width * 0.025;
    paddleHeight = height * 0.15;
    ballRadius = width * 0.0125;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawGame(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "white";
    ctx.fillRect(state.paddle_left.x / winWidth * canvas.width, state.paddle_left.y / winHeight * canvas.height, paddleWidth, paddleHeight);
    ctx.fillRect(state.paddle_right.x / winWidth * canvas.width, state.paddle_right.y / winHeight * canvas.height, paddleWidth, paddleHeight);

    // Draw ball
    ctx.beginPath();
    ctx.arc(state.ball.x / winWidth * canvas.width, state.ball.y / winHeight * canvas.height, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // Draw score
    ctx.font = `${canvas.width * 0.05}px Arial`;
    ctx.fillText(state.score[0], canvas.width / 4, canvas.height * 0.1);
    ctx.fillText(state.score[1], canvas.width * 3 / 4, canvas.height * 0.1);

    requestAnimationFrame(() => drawGame(state));
}

requestAnimationFrame(() => drawGame({}));

}