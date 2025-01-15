function raiseAlert(message_alert) {
	const alertWindow = document.getElementById('window-alert');

	if (alertWindow.style.display === 'none') {
		setWindowIndex();
		alertWindow.style.zIndex = 3000;
		alertWindow.style.display = 'flex';
	}

	alertWindow.style.top = `${window.innerHeight / 2.7 - alertWindow.offsetHeight / 2}px`;
	alertWindow.style.left = `${window.innerWidth / 2.15 - alertWindow.offsetWidth / 2}px`;
	const message = alertWindow.querySelector('.warning-text');
	message.innerHTML = '';
	message.textContent = message_alert;
}

document.addEventListener('DOMContentLoaded', function() {
	const alertWindow = document.getElementById('window-alert');
	const closeButton = alertWindow.querySelector('.close-button');
	const closeButtonAlert = alertWindow.querySelector('.close-button-alert');

	closeButton.addEventListener('click', function() {
		alertWindow.style.display = 'none';
	});

	closeButtonAlert.addEventListener('click', function() {
		alertWindow.style.display = 'none';
	});
});
