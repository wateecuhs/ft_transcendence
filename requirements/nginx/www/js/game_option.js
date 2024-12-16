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
        togglePongWindow();
        aiGame();
      } else if (buttonId === 'multi-button') {
        togglePongWindow();
        runGame();
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
