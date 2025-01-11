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
        if (window.matchmaking === false) {
          raiseAlert('You are already in matchmaking, please stop matchmaking first.');
          return ;
        }
        let game_ai = new PongWindow('ai', 0);
        game_ai.run();
      }
      else if (buttonId === 'local-button') {
        if (window.matchmaking === false) {
          raiseAlert('You are already in matchmaking, please stop matchmaking first.');
          return ;
        }
        let game_local = new PongWindow('local', 0);
        game_local.run();
      }
      else if (buttonId === 'create-room') {
        if (window.matchmaking === false) {
          raiseAlert('You are already in matchmaking, please stop matchmaking first.');
          return ;
        }
        let game_remote = new PongWindow('remote', 0);
        raiseAlert('Room created: ' + game_remote.roomNumber);
        window.createRoom = true;
        game_remote.run();
      }
      else if (buttonId === 'join-room') {
        if (window.matchmaking === false) {
          raiseAlert('You are already in matchmaking, please stop matchmaking first.');
          return ;
        }
        let roomNumber = prompt('Enter room number:');
        if (!roomNumber) return;
        let game = new PongWindow('remote', roomNumber);
        game.run();
      }
      else if (buttonId === 'launch-matchmaking') {
        if (window.createRoom === true) {
          raiseAlert('You have already created a room, please stop creating room first.');
          return ;
        }
        if (window.matchmaking) {
          addPlayerMatchmaking();
          button.textContent = window.dataMap.get('stop-matchmaking');
          window.matchmaking = false;
        } else {
          removePlayerMatchmaking();
          button.textContent = window.dataMap.get('launch-matchmaking');
          window.matchmaking = true;
        }
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
