// let room_ai = null;
// let room_local = null;
// let rooms = {};

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
        let room_ai = new PongWindow('ai', 0);
        room_ai.run();
      } else if (buttonId === 'local-button') {
        // togglePongWindow('room_local');
        // runLocalGame();
        let room_local = new PongWindow('local', 0);
        room_local.run();
      } else if (buttonId === 'create-room') {
        // let roomNumber = createRoom();
        // togglePongWindow('room_' + roomNumber);
        // runRemoteGame(roomNumber);
        let room_remote = new PongWindow('remote', 0);
        // rooms[room_remote.roomNumber] = room_remote;        
        alert('Room created: ' + room_remote.roomNumber);   // make GameInstance contents private, replace with getter
        // console.log(rooms);
        room_remote.run();
      } else if (buttonId === 'join-room') {
        // joinRoom();
        let roomNumber = prompt('Enter room number:');
        // console.log(rooms);
        if (!roomNumber) return;
        // if (rooms[roomNumber] === undefined) {
        //   alert('Room not found');
        //   return;
        // }
        // rooms[roomNumber].run();
        let room = new PongWindow('remote', roomNumber);
        room.run();
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
