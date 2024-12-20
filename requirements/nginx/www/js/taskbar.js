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
        raiseAlert('Change to French');
      } else if (divFlag.id === 'england-flag') {
        raiseAlert('Change to English');
      } else if (divFlag.id === 'portugal-flag') {
        raiseAlert('Change to Portuguese');
      } else if (divFlag.id === 'russia-flag') {
        raiseAlert('Change to Russian');
      }
    });
  });
}
