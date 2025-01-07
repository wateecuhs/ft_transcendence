document.getElementById('explorerWindow').querySelector('.close-button').addEventListener('click', function() {
  document.getElementById('explorerWindow').style.display = 'none';
});

function toogleWorkDesk() {
  const work_desk = document.getElementById('explorerWindow');

  work_desk.style.display = (work_desk.style.display == 'none') ? 'block' : 'none';
  work_desk.style.position = 'absolute';
  work_desk.style.top = `${window.innerHeight / 2 - work_desk.offsetHeight / 2}px`;
  work_desk.style.left = `${window.innerWidth / 2 - work_desk.offsetWidth / 2}px`;

  displayDeskInconsInWindow();
}

function displayDeskInconsInWindow() {
  const explorerWindow = document.getElementById('explorerWindow');
  const windowContent = explorerWindow.querySelector('.window-content');

  windowContent.innerHTML = '';

  const desktopIcons = document.querySelectorAll('.desktop-icons .icon');

  desktopIcons.forEach(icon => {

    const imgElement = icon.querySelector('img');
    const textElement = icon.querySelector('.icon-text');

    const newImg = document.createElement('img');
    newImg.src = imgElement.src;
    newImg.alt = imgElement.alt;
    newImg.className = 'list-img';

    const textSpan = document.createElement('span');
    textSpan.className = 'list-text';
    textSpan.textContent = textElement.textContent;

    const listItem = document.createElement('li');
    const ListItemButton = document.createElement('button');
    listItem.classList.add('list-item');


    ListItemButton.appendChild(newImg);
    ListItemButton.appendChild(textSpan);
    listItem.appendChild(ListItemButton);
    windowContent.appendChild(listItem);

    ListItemButton.addEventListener('click', () => {
      if (textSpan.textContent.trim() === 'Msn') {
        toggleMsnWindow();
      }
      if (textSpan.textContent.trim() === 'Winbook') {
        toggleWinbookWindow();
      }

      if (textSpan.textContent.trim() === 'Pong') {
        toogleGameOptionWindow();
      }

      if (textSpan.textContent.trim() === window.dataMap.get('trash')) {
        toogleTrashBin();
      }
    });
  });
}

let currentIndex = 0;
let historyStack = [];

function navigateToPage(pageName) {
  console.log(`Navigate to ${pageName}`);
  if (historyStack.length > 0 && historyStack[currentIndex - 1].page === pageName) {
    return ;
  }
  currentIndex++;

  const fullPath = window.location.pathname + `#${pageName}`;
  history.pushState({ page: pageName, index: currentIndex }, "", fullPath);
  historyStack.push({ page: pageName, index: currentIndex });
}

window.addEventListener('popstate', function (event) {
  console.log('Popstate event triggered');
  console.log('Current URL:', window.location.href);
  console.log('Event state:', JSON.stringify(event.state));

  if (!event.state || !event.state.page) {
    //console.log('No valid state found');
    quitDesk();
    return;
  }

  const currentPage = event.state.page;
  const goingBack = event.state.index < currentIndex;

  console.log(`Going ${goingBack ? 'Back' : 'Forward'} to page: ${currentPage}`);

  currentIndex = event.state.index;

  handlePageTransition(currentPage, goingBack);
  console.log('Updated history stack:', JSON.stringify(historyStack));
  console.log(`currentIndex = ${currentIndex}`);
});

function handlePageTransition(pageName, isBack) {
  console.log('handlePageTransition called with:', { pageName, isBack });
    
  if (isBack) {
      console.log('Going Back');
      let previousPageIndex = currentIndex;

      let previousPage = historyStack[previousPageIndex]?.page || "login";
      console.log(`current = ${pageName} and previous = ${previousPage}`);
      switchPage(previousPage);
  } else {
      console.log('Going Forward');
      switchPage(pageName);
  }
}

function switchPage(pageName) {
  switch (pageName) {
    case "pong":
      toogleGameOptionWindow();
      break;
    case "winbook":
      toggleWinbookWindow();
      break;
    case "msn":
      toggleMsnWindow();
      break;
    case "trash":
      toogleTrashBin();
      break;
    case "desktop":
      //history.replaceState({ page: "desktop", index: currentIndex }, "", window.location.pathname + "#login");
      quitDesk();
      break;
    default:
      console.log("Unknown page:", pageName);
      break;
  }
}
