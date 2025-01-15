function toogleTrashBin() {
  const trashBin = document.querySelector('#trash-bin');

  if (trashBin.style.display === 'none') {
    setWindowIndex();
    trashBin.style.zIndex = 3000;
    trashBin.style.display = 'flex';
    navigateToPage('trash');
  } else {
    trashBin.style.display = 'none';
  }

  trashBin.style.position = 'absolute';
  trashBin.style.top = `${window.innerHeight / 2 - trashBin.offsetHeight / 2}px`;
  trashBin.style.left = `${window.innerWidth / 2 - trashBin.offsetWidth / 2}px`;
}

document.addEventListener("DOMContentLoaded", function() {
  const trashBin = document.querySelector('#trash-bin');
  const trashBinButton = trashBin.querySelector('.close-button');
  trashBinButton.addEventListener('click', toogleTrashBin);
});
