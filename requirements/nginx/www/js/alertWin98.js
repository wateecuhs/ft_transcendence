const alertWindow = document.getElementById('window-alert');

alertWindow.querySelector('.close-button-alert').addEventListener('click', function() {
	alertWindow.style.display = 'none';
});

alertWindow.querySelector('.warning-text').addEventListener('click', function() {
	alertWindow.style.display = 'none';
});

function raiseAlert(message_alert) {
	const alertWindow = document.getElementById('window-alert');

	if (alertWindow.style.display === 'none') {
		alertWindow.style.display = 'flex';
	}
	alertWindow.style.top = `${window.innerHeight / 2.7 - alertWindow.offsetHeight / 2}px`;
	alertWindow.style.left = `${window.innerWidth / 2.15 - alertWindow.offsetWidth / 2}px`;
	const message = alertWindow.querySelector('.warning-text');
	message.innerHTML = '';
	message.textContent = message_alert;
}
