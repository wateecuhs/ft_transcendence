const icons = document.querySelectorAll('.icon');
const gridSize = 128;

icons.forEach(icon => {

  icon.addEventListener('dblclick', function(e) {
    const iconElement = icon.querySelector('.icon-text');
    const iconName = iconElement ? iconElement.textContent.trim() : '';

    if (iconName === 'Msn') toggleMsnWindow();
    else if (iconName === 'Winbook') toggleWinbookWindow();
    else if (iconName === 'Pong') toogleGameOptionWindow();
    else if (iconName === window.dataMap.get('trash')) toogleTrashBin();
    else if (iconName === window.dataMap.get('desktop')) cleanDesktop();
  });

  let offsetX, offsetY;

  icon.addEventListener('mousedown', function(e) {
    e.preventDefault();

    const iconRect = icon.getBoundingClientRect();
    offsetX = e.clientX - iconRect.left;
    offsetY = e.clientY - iconRect.top;

    icon.style.position = 'absolute';
    icon.style.zIndex = '9999';

    moveIcon(e);

    document.addEventListener('mousemove', moveIcon);
    document.addEventListener('mouseup', releaseIcon);
  });

  function moveIcon(e) {
    icon.style.left = `${e.clientX - offsetX}px`;
    icon.style.top = `${e.clientY - offsetY}px`;
  }

  function releaseIcon(e) {
    document.removeEventListener('mousemove', moveIcon);
    document.removeEventListener('mouseup', releaseIcon);

    const container = document.querySelector('.desktop-icons');
    const containerRect = container.getBoundingClientRect();

    const paddingLeft = parseInt(window.getComputedStyle(container).paddingLeft);
    const paddingTop = parseInt(window.getComputedStyle(container).paddingTop);

    let gridX = Math.round((e.clientX - offsetX - containerRect.left - paddingLeft) / gridSize) * gridSize + paddingLeft;
    let gridY = Math.round((e.clientY - offsetY - containerRect.top - paddingTop) / gridSize) * gridSize + paddingTop;

    icon.style.left = `${gridX}px`;
    icon.style.top = `${gridY}px`;

    icon.style.zIndex = 'auto';
  }
});

const windows = document.querySelectorAll('#explorerWindow, \
#accountWindow, \
#msnWindow, \
#updateUserWindow, \
#activate-2fa, \
#window-alert, \
#game-option, \
#tree-matchmaking, \
#clientWindow, \
#pop-up-message, \
#client-action, \
#trash-bin, \
#winBook, \
#window-join-room, \
#information-window');

windows.forEach(window => {
    const header = window.querySelector('.window-header');
    let offsetX, offsetY;

    header.addEventListener('mousedown', function(e) {
        e.preventDefault();

        setWindowIndex();
        window.style.zIndex = 3000;

        offsetX = e.clientX - window.getBoundingClientRect().left;
        offsetY = e.clientY - window.getBoundingClientRect().top;

        document.addEventListener('mousemove', moveWindow);
        document.addEventListener('mouseup', releaseWindow);
    });

    function moveWindow(e) {
        window.style.position = 'absolute';
        window.zIndex = '9999';
        window.style.left = `${e.clientX - offsetX}px`;
        window.style.top = `${e.clientY - offsetY}px`;
    }

    function releaseWindow() {

        document.removeEventListener('mousemove', moveWindow);
        document.removeEventListener('mouseup', releaseWindow);
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const icons = document.querySelectorAll('.desktop-icons .icon');
  const gridSize = 128;
  organizeIcons(icons, gridSize);
});

window.addEventListener('resize', () => {
  const icons = document.querySelectorAll('.desktop-icons .icon');
  const gridSize = 128;
  organizeIcons(icons, gridSize);
});

function organizeIcons(icons, gridSize) {
  const container = document.querySelector('.desktop-icons');
  const paddingLeft = parseInt(window.getComputedStyle(container).paddingLeft);
  const paddingTop = parseInt(window.getComputedStyle(container).paddingTop);

  const containerHeight = container.clientHeight;

  const iconsPerColumn = Math.floor((containerHeight - paddingTop * 2) / gridSize);

  let currentRow = 0;

  icons.forEach(icon => {
    icon.style.position = 'absolute';

    const xPos = paddingLeft;

    const yPos = paddingTop + currentRow * gridSize;

    icon.style.left = `${xPos}px`;
    icon.style.top = `${yPos}px`;

    currentRow++;

    if (currentRow >= iconsPerColumn) {
      return;
    }
  });
}

function setWindowIndex() {
  const windows = document.querySelectorAll('#explorerWindow, \
  #accountWindow, \
  #msnWindow, \
  #updateUserWindow, \
  #activate-2fa, \
  #game-option, \
  #tree-matchmaking, \
  #clientWindow, \
  #pop-up-message, \
  #client-action, \
  #trash-bin, \
  #winBook, \
  #window-join-room, \
  #information-window');

  windows.forEach(window => {
      window.style.zIndex = 2000;
  });
}
