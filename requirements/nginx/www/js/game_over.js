function triggerGameOverWindows() {
  const game_over = document.querySelector('.all-game-over');
  if (game_over.style.display === 'none') {
    game_over.style.display = 'flex';
    const windows = game_over.querySelectorAll('.all-game-over li');
    windows.forEach((error_win, index) => {
      error_win.classList.remove('game-over-slide');
      error_win.classList.add('game-over-slide');
    });
  } else {
    game_over.style.display = 'none';
    return ;
  }

  windows.forEach((error_win, index) => {
    setTimeout(() => {
      error_win.style.display = 'flex';
    }, index * 100);
  });
}
