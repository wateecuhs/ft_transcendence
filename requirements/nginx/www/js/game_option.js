function toogleGameOptionWindow() {
  const optionWin = document.getElementById('game-option');
  if (optionWin.style.display === 'none') {
    setWindowIndex();
    optionWin.style.zIndex = 3000;
    optionWin.style.display = 'flex';
    optionWin.style.position = 'absolute';
    optionWin.style.top = `${window.innerHeight / 2 - optionWin.offsetHeight / 2}px`;
    optionWin.style.left = `${window.innerWidth / 2 - optionWin.offsetWidth / 2}px`;
    navigateToPage("pong-option");
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
          let already_match = null;
          if (window.dataMap && window.dataMap.has('already-match'))
            already_match = window.dataMap.get('already-match');
          else
            already_match = 'You have already matched, please stop matchmaking first.';
          raiseAlert(already_match);
          return ;
        }
        navigateToPage("pong");
        optionWin.style.display = 'none';
        let game_ai = new PongWindow('ai');
        game_ai.run();
      }
      else if (buttonId === 'local-button') {
        if (window.matchmaking === false) {
          let already_match = null;
          if (window.dataMap && window.dataMap.has('already-match'))
            already_match = window.dataMap.get('already-match');
          else
            already_match = 'You have already matched, please stop matchmaking first.';
          raiseAlert(already_match);
          return ;
        }
        navigateToPage("pong");
        optionWin.style.display = 'none';
        let game_local = new PongWindow('local');
        game_local.run();
      }
      else if (buttonId === 'join-room') {
        if (window.matchmaking === false) {
          let already_match = null;
          if (window.dataMap && window.dataMap.has('already-match'))
            already_match = window.dataMap.get('already-match');
          else
            already_match = 'You have already matched, please stop matchmaking first.';
          raiseAlert(already_match);
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
          let stopMatchmaking = null;
          if (window.dataMap && window.dataMap.has('stop-matchmaking'))
            stopMatchmaking = window.dataMap.get('stop-matchmaking');
          else
            stopMatchmaking = 'Stop matchmaking';
          button.textContent = stopMatchmaking;
          window.matchmaking = false;
        } else {
          removePlayerMatchmaking();
          let launchMatchmaking = null;
          if (window.dataMap && window.dataMap.has('launch-matchmaking'))
            launchMatchmaking = window.dataMap.get('launch-matchmaking');
          else
            launchMatchmaking = 'Launch matchmaking';
          button.textContent = launchMatchmaking;
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

  const joinRoom = document.getElementById('window-join-room');
  const joinRoomInput = document.getElementById('join-input-id');
  const joinRoomButton = document.getElementById('join-room-button-id');

  document.getElementById('window-join-room').querySelector('.close-button').addEventListener('click', function() {
    toogleJoinRoom();
  });

  joinRoomButton.addEventListener('click', function() {
    if (window.matchmaking === false) {
      let already_match = null;
      if (window.dataMap && window.dataMap.has('already-match'))
        already_match = window.dataMap.get('already-match');
      else
        already_match = 'You have already matched, please stop matchmaking first.';
      raiseAlert(already_match);
      return ;
    }
    let roomNumber = joinRoomInput.value;
    if (!roomNumber) {
      let enterRoomNumber = null;
      if (window.dataMap && window.dataMap.has('enter-room-number'))
        enterRoomNumber = window.dataMap.get('enter-room-number');
      else
        enterRoomNumber = 'Please enter a room number';
      raiseAlert(enterRoomNumber);
      return ;
    }
    joinRoom.style.display = 'none';
    let game = new PongWindow('remote', roomNumber);
    game.run();
  });
});
