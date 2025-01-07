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
let oldPage = null;

function navigateToPage(pageName) {
  if (historyStack.length > 0 && historyStack[currentIndex - 1].page === pageName) {
    return ;
  }
  currentIndex++;
  history.pushState({ page: pageName, index: currentIndex }, "", "");
  historyStack.push({ page: pageName, index: currentIndex });

  window.oldPage = pageName;
};

window.addEventListener('popstate', function (event) {
  if (!event.state || !event.state.page) {
    return ;
  }

  const currentPage = event.state.page;
  const goingBack = event.state.index < currentIndex;
  oldPage = this.window.oldPage;
  currentIndex = event.state.index;


  if (!goingBack) {
    this.alert('Going Forward');
    if (currentPage === "pong") {
      toogleGameOptionWindow("roomId");
      navigateToPage("pong");
    } else if (currentPage === "winbook") {
      toggleWinbookWindow();
      navigateToPage("winbook");
    } else if (currentPage === "msn") {
      toggleMsnWindow();
      navigateToPage("msn");
    } else if (currentPage === "trash") {
      toogleTrashBin();
      navigateToPage("trash");
    } else if (currentPage === "desktop") {
      //quitDesk();
      historyStack.pop();
    }
  } else {

    let toPage = "login";
    if (historyStack.length > 0) {
      oldPage = historyStack[currentIndex].page;
      toPage = historyStack[currentIndex - 1].page;
      historyStack.pop();
    }

    if (oldPage === "pong") {
      toogleGameOptionWindow("roomId");
      navigateToPage(toPage);
    } else if (oldPage === "winbook") {
      toggleWinbookWindow();
      navigateToPage(toPage);
    } else if (oldPage === "msn") {
      toggleMsnWindow();
      navigateToPage(toPage);
    } else if (oldPage === "trash") {
      toogleTrashBin();
      navigateToPage(toPage);
    } else if (oldPage === "desktop") {
      quitDesk();
      navigateToPage("login");
    }
  }
});

function handleTransistion(fromPage, toPage, isBack = false) {

}
