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

 const numberPages = document.querySelector(".number-pages");
 numberPages.innerHTML = '';
 numberPages.textContent = `${pageIndex + 1}/4`;
}

accountWindow.querySelector('.right-arrow').addEventListener('click', function() {
  if (currentPage < 3) {
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

function toogleAccountWindow() {
  const work_desk = accountWindow;

  work_desk.style.display = (work_desk.style.display == 'none') ? 'block' : 'none';
  work_desk.style.position = 'absolute';
  work_desk.style.top = `${window.innerHeight / 2 - work_desk.offsetHeight / 2}px`;
  work_desk.style.left = `${window.innerWidth / 2 - work_desk.offsetWidth / 2}px`;

  displayDeskInconsInWindow();
  displayStylePage(currentPage);
}

function setUserInfo() {
  const page0 = accountWindow.querySelector('#account-page-0 .account-page');
}