const EMAIL_ENDPOINT = 'https://lee-roy.ch/email_script.php';

/**
 * Sends the contact form data as JSON to the PHP backend.
 * @param {HTMLFormElement} form - The contact form element.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function sendContactForm(form) {
	const payload = {
		name: form.querySelector('#contact-name').value.trim(),
		email: form.querySelector('#contact-email').value.trim(),
		message: form.querySelector('#contact-message').value.trim(),
	};

	const response = await fetch(EMAIL_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	return response.json();
}

/**
 * Shows a toast notification that slides up from the bottom.
 * @param {'success'|'error'} type - The toast type.
 */
function showToast(type) {
	const lang = getStoredLang();
	const key = type === 'success' ? 'toast.success' : 'toast.error';
	const message = translations[lang]?.[key] || translations['en'][key];

	const icon = type === 'success'
		? '<svg class="toast__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
		: '<svg class="toast__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

	const toast = document.createElement('div');
	toast.className = 'toast' + (type === 'error' ? ' toast--error' : ' toast--success');
	toast.innerHTML = icon + '<span>' + message + '</span>';
	document.body.appendChild(toast);

	requestAnimationFrame(() => {
		toast.classList.add('toast--visible');
	});

	setTimeout(() => {
		toast.classList.remove('toast--visible');
		toast.addEventListener('transitionend', () => toast.remove());
	}, 4000);
}
