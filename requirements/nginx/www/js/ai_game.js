function runAIGame() {

console.log('runAIGame() called');

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let paddleWidth = 20;
let paddleHeight = 100;
let ballRadius = 10;
const winWidth = 800;
const winHeight = 600;

const roomName = "room1"; // Replace with dynamic room name if needed
const socket = new WebSocket('wss://' + window.location.host + '/ai_game/rooms/' + roomName + '/');

// let lastGameState = null;
// let lastUpdateTime = null;

socket.onopen = function() {
    console.log('WebSocket connection established');
    console.log('socket', socket);
};

socket.onerror = function(error) {
    console.error('WebSocket error:', error);
    console.error('window.location.host:', window.location.host);
};

// let gameState = {};

socket.onmessage = function(event) {
    // console.log('Received message:', event.data);
    const gameState = JSON.parse(event.data);
    if (gameState.type === 'handler') {
        return;
    }
    lastGameState = gameState;
    lastUpdateTime = performance.now();
    // requestAnimationFrame(() => drawGame(gameState));
    drawGame(gameState);
};

// function getPredictedState() {
//     if (!lastGameState || !lastUpdateTime) {
//         return null;
//     }

//     const currentTime = performance.now();
//     const deltaTime = (currentTime - lastUpdateTime) / 1000; // Convert to seconds

//     // const predictedState = JSON.parse(JSON.stringify(lastGameState)); // Deep copy the last known state
//     const predictedState = lastGameState; // Shallow copy the last known state

//     // Predict paddle positions
//     if (lastGameState.paddle_left.dy) {
//         predictedState.paddle_left.y += lastGameState.paddle_left.dy * deltaTime;
//     }
//     if (lastGameState.paddle_right.dy) {
//         predictedState.paddle_right.y += lastGameState.paddle_right.dy * deltaTime;
//     }

//     // Predict ball position
//     predictedState.ball.x += lastGameState.ball.dx * deltaTime;
//     predictedState.ball.y += lastGameState.ball.dy * deltaTime;

//     return predictedState;
// }

// function throttle(func, limit) {
//     let inThrottle;
//     return function() {
//       const args = arguments;
//       const context = this;
//       if (!inThrottle) {
//         func.apply(context, args);
//         inThrottle = true;
//         setTimeout(() => inThrottle = false, limit);
//       }
//     }
//   }

let commandBuffer = {};

// function handleKeyDown(event) {
//     const command = { type: 'handler'};
//     if (event.key === 'w') command.move_left_up = true;
//     if (event.key === 's') command.move_left_down = true;
//     if (event.key === 'ArrowUp') command.move_right_up = true;
//     if (event.key === 'ArrowDown') command.move_right_down = true;
//     socket.send(JSON.stringify(command));
//   }
  
// function handleKeyUp(event) {
//     const command = { type: 'handler'};
//     if (event.key === 'w') command.move_left_up = false;
//     if (event.key === 's') command.move_left_down = false;
//     if (event.key === 'ArrowUp') command.move_right_up = false;
//     if (event.key === 'ArrowDown') command.move_right_down = false;
//     socket.send(JSON.stringify(command));
//     }

function handleKeyDown(event) {
    // const command = { type: 'handler'};
    commandBuffer.type = 'handler';
    if (event.key === 'w') commandBuffer.move_left_up = true;
    if (event.key === 's') commandBuffer.move_left_down = true;
    if (event.key === 'ArrowUp') commandBuffer.move_right_up = true;
    if (event.key === 'ArrowDown') commandBuffer.move_right_down = true;
}

function handleKeyUp(event) {
    // const command = { type: 'handler'};
    commandBuffer.type = 'handler';
    if (event.key === 'w') commandBuffer.move_left_up = false;
    if (event.key === 's') commandBuffer.move_left_down = false;
    if (event.key === 'ArrowUp') commandBuffer.move_right_up = false;
    if (event.key === 'ArrowDown') commandBuffer.move_right_down = false;
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

setInterval(() => {
    if (Object.keys(commandBuffer).length > 0) {
        socket.send(JSON.stringify(commandBuffer));
        commandBuffer = {};
    }
}, 16); // Send commands every 16ms

// document.addEventListener('keydown', (event) => {
//     const command = {};
//     if (event.key === 'w') command.move_left_up = true;
//     if (event.key === 's') command.move_left_down = true;
//     if (event.key === 'ArrowUp') command.move_right_up = true;
//     if (event.key === 'ArrowDown') command.move_right_down = true;
//     socket.send(JSON.stringify(command));
// });

// document.addEventListener('keyup', (event) => {
//     const command = {};
//     if (event.key === 'w') command.move_left_up = false;
//     if (event.key === 's') command.move_left_down = false;
//     if (event.key === 'ArrowUp') command.move_right_up = false;
//     if (event.key === 'ArrowDown') command.move_right_down = false;
//     socket.send(JSON.stringify(command));
// });

// setInterval(() => {
//     const predictedState = getPredictedState();
//     if (predictedState) {
//         drawGame(predictedState);
//     }
// }, 8); // Update predicted state every 8ms

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
    if (!state || !state.paddle_left || !state.paddle_right || !state.ball || !state.score) {
        console.error('Invalid game state:', state);
        return;
    }

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

    // requestAnimationFrame(() => drawGame(state));
}

// requestAnimationFrame(() => drawGame({}));

}