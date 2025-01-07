function toogleGameOptionWindow() {
  const optionWin = document.getElementById('game-option');
  if (optionWin.style.display === 'none') {
    optionWin.style.display = 'flex';
    optionWin.style.position = 'absolute';
    optionWin.style.top = `${window.innerHeight / 2 - optionWin.offsetHeight / 2}px`;
    optionWin.style.left = `${window.innerWidth / 2 - optionWin.offsetWidth / 2}px`;
    navigateToPage("pong");
  } else {
    optionWin.style.display = 'none'
  }
}

function game_option_button() {
  const optionWin = document.getElementById('game-option');
  const buttonAi = optionWin.querySelectorAll('button');
  buttonAi.forEach((button) => {
    button.addEventListener('click', () => {
      const buttonId = button.id;

      if (buttonId === 'ai-button') {
        // let win = togglePongWindow('room_ai');
        runAIGame();
      } else if (buttonId === 'local-button') {
        // togglePongWindow('room_local');
        runLocalGame();
      } else if (buttonId === 'create-room') {
        let roomNumber = createRoom();
        // togglePongWindow('room_' + roomNumber);
        runRemoteGame(roomNumber);
      } else if (buttonId === 'join-room') {
        joinRoom();
      }
    });
  });
  optionWin.querySelector('.close-button').addEventListener('click', function() {
    optionWin.style.display = 'none';
  });
}

document.addEventListener("DOMContentLoaded", function() {
  game_option_button();
});
