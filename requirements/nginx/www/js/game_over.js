function triggerGameOverWindows(message) {
  const gameOver = document.querySelector('.all-game-over');
  if (gameOver.style.display === 'none' || gameOver.style.display === '') {
    gameOver.style.display = 'flex';
    const textGameOver = gameOver.querySelector('#game-over-5 .game-over-text');
    textGameOver.textContent = message;

    const windows = gameOver.querySelectorAll('li');
    windows.forEach((window, index) => {
      setTimeout(() => {
        window.classList.add('show');
      }, index * 100);
    });
  }
}

document.querySelector('.game-over-button').addEventListener('click', function() {
  document.querySelector('.all-game-over').style.display = 'none';
});
