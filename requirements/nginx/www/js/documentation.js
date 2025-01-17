const docsWindow = document.getElementById('docs-window');
let currentPageDocs = 0;

docsWindow.querySelector('.close-button').addEventListener('click', function() {
  docsWindow.style.display = 'none';
});

function displayDocPage(pageIndex) {
	const totalPages = document.querySelectorAll('.docs-page');

	totalPages.forEach((page, index) => {
	page.style.display = (index === pageIndex) ? 'block' : 'none';
});

const numberPages = document.querySelector("#docs-window .number-pages");
	numberPages.innerHTML = '';
	numberPages.textContent = `${pageIndex + 1}/6`;
}

docsWindow.querySelector('.right-arrow').addEventListener('click', function() {
  if (currentPageDocs < 5) {
    currentPageDocs++;
  }
  displayDocPage(currentPageDocs);
});

docsWindow.querySelector('.left-arrow').addEventListener('click', function() {
  if (currentPageDocs > 0) {
    currentPageDocs--;
  }
  displayDocPage(currentPageDocs);
});

async function toogleDocsWindow() {

  if (docsWindow.style.display === 'none') {
    setWindowIndex();
    docsWindow.style.zIndex = 3000;
  }
  docsWindow.style.display = (docsWindow.style.display === 'none') ? 'block' : 'none';
  docsWindow.style.position = 'absolute';
  docsWindow.style.top = `${window.innerHeight / 2 - docsWindow.offsetHeight / 2}px`;
  docsWindow.style.left = `${window.innerWidth / 2 - docsWindow.offsetWidth / 2}px`;

  displayDocPage(currentPageDocs);
}

document.addEventListener("DOMContentLoaded", () => {

  const arrows = document.querySelectorAll('#docs-window .arrow-buttons');
  if (arrows.length > 0) {
    arrows.forEach(button => {
      button.addEventListener('mouseover', function() {
        document.querySelector('#docs-window .number-pages').style.fontWeight = 'bold';
        document.querySelector('#docs-window .number-pages').style.fontSize = '13px';
      });
      button.addEventListener('mouseout', function() {
        document.querySelector('#docs-window .number-pages').style.fontWeight = 'normal';
        document.querySelector('#docs-window .number-pages').style.fontSize = '12px';
      });
    });
  }
});