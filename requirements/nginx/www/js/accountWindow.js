const accountWindow = document.getElementById('accountWindow');
let currentPage = 0;

accountWindow.querySelector('.close-button').addEventListener('click', function() {
  accountWindow.style.display = 'none';
});

function displayStylePage(pageIndex) {
 const totalPages = document.querySelectorAll('.account-page');

 totalPages.forEach((page, index) => {
  page.style.display = (index === pageIndex) ? 'block' : 'none';
 });

 const numberPages = document.querySelector("#accountWindow .number-pages");
 numberPages.innerHTML = '';
 numberPages.textContent = `${pageIndex + 1}/3`;
}

accountWindow.querySelector('.right-arrow').addEventListener('click', function() {
  if (currentPage < 2) {
    currentPage++;
  }
  displayStylePage(currentPage);
});

accountWindow.querySelector('.left-arrow').addEventListener('click', function() {
  if (currentPage > 0) {
    currentPage--;
  }
  displayStylePage(currentPage);
});

async function toogleAccountWindow() {
  updateMatchHistory();
  updateUserStat();

  const work_desk = accountWindow;

  if (work_desk.style.display === 'none') {
    setWindowIndex();
    work_desk.style.zIndex = 3000;
  }
  work_desk.style.display = (work_desk.style.display === 'none') ? 'block' : 'none';
  work_desk.style.position = 'absolute';
  work_desk.style.top = `${window.innerHeight / 2 - work_desk.offsetHeight / 2}px`;
  work_desk.style.left = `${window.innerWidth / 2 - work_desk.offsetWidth / 2}px`;

  displayDeskInconsInWindow();
  displayStylePage(currentPage);
}

document.addEventListener("DOMContentLoaded", () => {
  const button_2fa = document.getElementById('user2FA');
  const button_account = document.getElementById('account');

  if (button_account != null) {
    button_account.addEventListener('click', toogleAccountWindow);
  }

	if (button_2fa != null) {
		button_2fa.addEventListener('click', activate_2fa);
	}

  const arrows = document.querySelectorAll('#accountWindow .arrow-buttons');
  if (arrows.length > 0) {
    arrows.forEach(button => {
      button.addEventListener('mouseover', function() {
        document.querySelector('#accountWindow .number-pages').style.fontWeight = 'bold';
        document.querySelector('#accountWindow .number-pages').style.fontSize = '13px';
      });
      button.addEventListener('mouseout', function() {
        document.querySelector('#accountWindow .number-pages').style.fontWeight = 'normal';
        document.querySelector('#accountWindow .number-pages').style.fontSize = '12px';
      });
    });
  }
});
