const components = [
  'Taskbar',
  'ExplorerWindow',
  'AccountWindow',
  'DesktopIcons'
]

const path = './components';
for (const name of components) {
  fetch(`${path}/${name}.html`)
    .then(response => response.text())
    .then(data => {
      const doc = document.querySelector(name);
      if (doc) {
        doc.innerHTML = data;
      }
    })
}



document.addEventListener('DOMContentLoaded', function() {
  const scripts = [
    '/js/render.js',
    '/js/explorerWindow.js',
    'js/accountWindow.js',
    '/js/start_menu.js',
    '/js/move_icon.js',
    '/js/update_time.js'
  ];

  loadScripts(scripts).then(() => {

    updateTime();
    setInterval(updateTime, 60000);
  }).catch(error => {
    console.error('Erreur lors du chargement des scripts:', error);
  });
});
