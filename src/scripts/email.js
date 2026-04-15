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
 * Returns the translated toast message for the given type.
 * @param {'success'|'error'} type - The toast type.
 * @returns {string}
 */
function getToastMessage(type) {
	const lang = getStoredLang();
	const key = type === 'success' ? 'toast.success' : 'toast.error';
	return translations[lang]?.[key] || translations['en'][key];
}

/**
 * Returns the SVG icon HTML for the given toast type.
 * @param {'success'|'error'} type - The toast type.
 * @returns {string}
 */
function getToastIcon(type) {
	return type === 'success'
		? '<svg class="toast__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
		: '<svg class="toast__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

/**
 * Creates a toast DOM element and appends it to the body.
 * @param {'success'|'error'} type - The toast type.
 * @returns {HTMLDivElement}
 */
function createToastElement(type) {
	const closeBtn = '<button class="toast__close" aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
	const toast = document.createElement('div');
	toast.className = 'toast' + (type === 'error' ? ' toast--error' : ' toast--success');
	toast.innerHTML = getToastIcon(type) + '<span>' + getToastMessage(type) + '</span>' + closeBtn;
	document.body.appendChild(toast);
	return toast;
}

/**
 * Removes a toast element with a fade-out transition.
 * @param {HTMLDivElement} toast - The toast element to hide.
 */
function hideToast(toast) {
	toast.classList.remove('toast--visible');
	toast.addEventListener('transitionend', () => toast.remove());
}

/**
 * Shows a toast notification that slides up from the bottom.
 * @param {'success'|'error'} type - The toast type.
 */
function showToast(type) {
	const toast = createToastElement(type);
	toast.querySelector('.toast__close').addEventListener('click', () => hideToast(toast));
	requestAnimationFrame(() => toast.classList.add('toast--visible'));
	setTimeout(() => hideToast(toast), 4000);
}
