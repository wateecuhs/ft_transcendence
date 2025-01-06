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

