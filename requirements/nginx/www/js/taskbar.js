function updateTime() {
  const timeElement = document.querySelector('.time');
  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const formattedHours = hours % 12 || 12;

  const timeText = `${formattedHours}:${minutes} ${ampm}`;
  let textSpan = timeElement.querySelector('.time-text');

  if (!textSpan) {
      textSpan = document.createElement('span');
      textSpan.className = 'time-text';
      timeElement.appendChild(textSpan);
  }

  textSpan.innerHTML = '';
  textSpan.textContent = timeText;
}

function toogleLanguageChoices() {
  const languages = document.querySelector('.language-choices');

  if (languages.style.display === 'none' || languages.style.display === '') {
    languages.style.display = 'inline-block';

    const choices = languages.querySelectorAll('ul li');
    choices.forEach((choice, index) => {
      choice.classList.remove('slide-flag-up');
      choice.classList.add('slide-flag-up');
    });
  } else {
    languages.style.display = 'none';
  }

  const choices = languages.querySelectorAll('ul li');
  choices.forEach(choice => {
    const divFlag = choice.querySelector('div');

    divFlag.addEventListener('click', function() {
      if (divFlag.id === 'france-flag') {
        window.dict = 'fr-dict.txt';
        fetch(window.dict)
          .then(response => response.text())
          .then(text => {
            let file = text.split('\n');
            window.dataMap = new Map();
            for (let line of file) {
              let lineSplit = line.split('=');
              window.dataMap.set(lineSplit[0], lineSplit[1]);
            }
          });
        const requestData = {
            language: 'fr',
          };
          const response = fetch('/auth/language/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`,
            },
            body: JSON.stringify(requestData),
          });
      } else if (divFlag.id === 'england-flag') {
        window.dict = 'en-dict.txt';
        fetch(window.dict)
          .then(response => response.text())
          .then(text => {
            let file = text.split('\n');
            window.dataMap = new Map();
            for (let line of file) {
              let lineSplit = line.split('=');
              window.dataMap.set(lineSplit[0], lineSplit[1]);
            }
          });
        const requestData = {
            language: 'en',
          };
          const response = fetch('/auth/language/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`,
            },
            body: JSON.stringify(requestData),
          });
      } else if (divFlag.id === 'portugal-flag') {
        window.dict = 'pt-dict.txt';
        fetch(window.dict)
          .then(response => response.text())
          .then(text => {
            let file = text.split('\n');
            window.dataMap = new Map();
            for (let line of file) {
              let lineSplit = line.split('=');
              window.dataMap.set(lineSplit[0], lineSplit[1]);
            }
          });
        const requestData = {
            language: 'pt',
          };
          const response = fetch('/auth/language/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`,
            },
            body: JSON.stringify(requestData),
          });
      } else if (divFlag.id === 'russia-flag') {
        window.dict = 'rs-dict.txt';
        fetch(window.dict)
          .then(response => response.text())
          .then(text => {
            let file = text.split('\n');
            window.dataMap = new Map();
            for (let line of file) {
              let lineSplit = line.split('=');
              window.dataMap.set(lineSplit[0], lineSplit[1]);
            }
          });
        const requestData = {
          language: 'ru',
        };
        const response = fetch('/auth/language/', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },
          body: JSON.stringify(requestData),
        });
      }
    });
  });
}
