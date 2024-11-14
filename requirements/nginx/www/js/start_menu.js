function toogleStartMenu() {
  const startMenu = document.querySelector('.start-menu');
  startMenu.style.display = (startMenu.style.display === 'none') ? 'block' : 'none';
}

document.addEventListener('click', function(event) {
  const startMenu = document.querySelector('.start-menu');
  const startButton = document.querySelector('.start-btn');
  
  if (!startButton.contains(event.target) && !startMenu.contains(event.target)) {
    startMenu.style.display = 'none';
  }
});
