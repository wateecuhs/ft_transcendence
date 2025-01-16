document.getElementById('explorerWindow').querySelector('.close-button').addEventListener('click', function() {
  document.getElementById('explorerWindow').style.display = 'none';
});

function toogleWorkDesk() {
  const work_desk = document.getElementById('explorerWindow');

  if (work_desk.style.display === 'none') {
    setWindowIndex();
    work_desk.style.zIndex = 3000;
  }
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

    if (textElement.textContent.trim() === window.dataMap.get('trash')) {
      textSpan.id = 'trash-explorer';
    }
    if (textElement.textContent.trim() === window.dataMap.get('desktop')) {
      textSpan.id = 'desktop-explorer';
    }

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
  if (pageName === "pong") {
    if (historyStack.length > 0 && historyStack[currentIndex - 1]?.page === "pong") {
      history.replaceState({ page: pageName, index: currentIndex }, "", window.location.pathname + `#${pageName}`);
      historyStack[currentIndex] = { page: pageName, index: currentIndex };
    } else {
      currentIndex++;
      const fullPath = window.location.pathname + `#${pageName}`;
      history.pushState({ page: pageName, index: currentIndex }, "", fullPath);
      historyStack.push({ page: pageName, index: currentIndex });
    }
    return;
  }

  if (historyStack.length > 0 && currentIndex > 0 && historyStack[currentIndex - 1].page === pageName) {
    return;
  }

  currentIndex++;

  const fullPath = window.location.pathname + `#${pageName}`;
  history.pushState({ page: pageName, index: currentIndex }, "", fullPath);
  historyStack.push({ page: pageName, index: currentIndex });
}

window.addEventListener('popstate', function (event) {

  if (!event.state || !event.state.page) {
    quitDesk();
    raiseAlert(window.dataMap.get('expired-session'));
    return;
  }

  const currentPage = event.state.page;
  const goingBack = event.state.index < currentIndex;


  currentIndex = event.state.index;

  handlePageTransition(currentPage, goingBack);
});

function handlePageTransition(pageName, isBack) {

  if (isBack) {
      let previousPageIndex = currentIndex;

      let previousPage = historyStack[previousPageIndex]?.page || "login";
      switchPage(previousPage);
  } else {
      switchPage(pageName);
  }
}

function switchPage(pageName) {
  switch (pageName) {
    case "pong-option":
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
      raiseAlert(window.dataMap.get('expired-session'));
      break;
    case "pong":

      break;
    default:
      console.log("Unknown page:", pageName);
      break;
  }
}
