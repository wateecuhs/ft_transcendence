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
