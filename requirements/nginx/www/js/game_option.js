let room_ai = null;
let room_local = null;
let rooms = {};

function toogleGameOptionWindow() {
  const optionWin = document.getElementById('game-option');
  if (optionWin.style.display === 'none') {
    optionWin.style.display = 'flex';
    optionWin.style.position = 'absolute';
    optionWin.style.top = `${window.innerHeight / 2 - optionWin.offsetHeight / 2}px`;
    optionWin.style.left = `${window.innerWidth / 2 - optionWin.offsetWidth / 2}px`;
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
        // runAIGame();
        room_ai = new GameInstance('ai');
        room_ai.run();
      } else if (buttonId === 'local-button') {
        // togglePongWindow('room_local');
        // runLocalGame();
        room_local = new GameInstance('local');
        room_local.run();
      } else if (buttonId === 'create-room') {
        // let roomNumber = createRoom();
        // togglePongWindow('room_' + roomNumber);
        // runRemoteGame(roomNumber);
        let room_remote = new GameInstance('remote');
        rooms[room_remote.roomNumber] = room_remote;        
        alert('Room created: ' + room_remote.roomNumber);   // make GameInstance contents private, replace with getter
        room_remote.run();
      } else if (buttonId === 'join-room') {
        // joinRoom();
        let roomNumber = prompt('Enter room number:');
        if (!roomNumber) return;
        // if (rooms[roomNumber] === undefined) {
        //   alert('Room not found');
        //   return;
        // }
        rooms[roomNumber].run();
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
