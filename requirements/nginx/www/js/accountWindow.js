document.getElementById('accountWindow').querySelector('.close-button').addEventListener('click', function() {
  document.getElementById('accountWindow').style.display = 'none';
});

let currentPage = 0;

function displayStylePage(pageIndex) {
 const totalPages = document.querySelectorAll('.account-page');

 totalPages.forEach((page, index) => {
  page.style.display = (index === pageIndex) ? 'block' : 'none';
 });

 const numberPages = document.querySelector(".number-pages");
 numberPages.innerHTML = '';
 numberPages.textContent = `${pageIndex + 1}/4`;
}

document.getElementById('accountWindow').querySelector('.right-arrow').addEventListener('click', function() {
  if (currentPage < 3) {
    currentPage++;
  }
  displayStylePage(currentPage);
});

document.getElementById('accountWindow').querySelector('.left-arrow').addEventListener('click', function() {
  if (currentPage > 0) {
    currentPage--;
  }
  displayStylePage(currentPage);
});

function toogleAccountWindow() {
  const work_desk = document.getElementById('accountWindow');

  work_desk.style.display = (work_desk.style.display == 'none') ? 'block' : 'none';
  work_desk.style.position = 'absolute';
  work_desk.style.top = `${window.innerHeight / 2 - work_desk.offsetHeight / 2}px`;
  work_desk.style.left = `${window.innerWidth / 2 - work_desk.offsetWidth / 2}px`;

  displayDeskInconsInWindow();
  displayStylePage(currentPage);
}
