const popUp = document.getElementById('pop-up-message');

function showPopUp(text) {
  popUp.classList.remove('slide-right');
  popUp.classList.add('slide-left');

  const textPopUp = popUp.querySelector('.pop-up-text');
  textPopUp.textContent = text;

  setTimeout(hidePopUp, 4000);
}

function hidePopUp() {
  popUp.classList.remove('slide-left');
  popUp.classList.add('slide-right');
}

function adjustPopUpPosition() {
  popUp.style.top = `${2 * window.innerHeight / 100}px`;
  popUp.style.right = `${2 * window.innerWidth / 100}px`;
}

window.addEventListener('resize', adjustPopUpPosition);

document.addEventListener("DOMContentLoaded", function() {
  adjustPopUpPosition();
});
