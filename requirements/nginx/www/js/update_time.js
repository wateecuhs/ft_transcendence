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
