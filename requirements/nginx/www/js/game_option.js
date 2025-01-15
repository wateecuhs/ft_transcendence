function toogleGameOptionWindow() {
  const optionWin = document.getElementById('game-option');
  if (optionWin.style.display === 'none') {
    setWindowIndex();
    optionWin.style.zIndex = 3000;
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
          raiseAlert(window.dataMap.get('already-match'));
          return ;
        }
        optionWin.style.display = 'none';
        let game_ai = new PongWindow('ai');
        game_ai.run();
      }
      else if (buttonId === 'local-button') {
        if (window.matchmaking === false) {
          raiseAlert(window.dataMap.get('already-match'));
          return ;
        }
        optionWin.style.display = 'none';
        let game_local = new PongWindow('local');
        game_local.run();
      }
      else if (buttonId === 'join-room') {
        if (window.matchmaking === false) {
          raiseAlert(window.dataMap.get('already-match'));
          return ;
        }
        optionWin.style.display = 'none';
        toogleJoinRoom();
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

function toogleJoinRoom() {
  const joinRoom = document.getElementById('window-join-room');
  if (joinRoom.style.display === 'none') {
    joinRoom.style.display = 'flex';
    joinRoom.style.position = 'absolute';
    joinRoom.style.top = `${window.innerHeight / 2 - joinRoom.offsetHeight / 2}px`;
    joinRoom.style.left = `${window.innerWidth / 2 - joinRoom.offsetWidth / 2}px`;
  } else {
    joinRoom.style.display = 'none';
  }
}

document.addEventListener("DOMContentLoaded", function() {
  game_option_button();

  const joinRoomInput = document.getElementById('join-input-id');
  const joinRoomButton = document.getElementById('join-room-button-id');

  document.getElementById('window-join-room').querySelector('.close-button').addEventListener('click', function() {
    toogleJoinRoom();
  });

  joinRoomButton.addEventListener('click', function() {
    if (window.matchmaking === false) {
      raiseAlert(window.dataMap.get('already-match'));
      return ;
    }
    let roomNumber = joinRoomInput.value;
    if (!roomNumber) {
      raiseAlert(window.dataMap.get('enter-room-number'));
      return ;
    }
    let game = new PongWindow('remote', roomNumber);
    game.run();
  });
});
