/* ========== CONTACT FORM ========== */

const FIELD_ERROR_KEYS = {
	'contact-name': 'contact.error.name',
	'contact-email': 'contact.error.email',
	'contact-message': 'contact.error.message'
};

/**
 * Returns the translated error message for a given field.
 * @param {string} fieldId - The element's ID.
 * @returns {string} The localised error message.
 */
function getFieldErrorMessage(fieldId) {
	const lang = getStoredLang();
	const key = FIELD_ERROR_KEYS[fieldId];
	return translations[lang]?.[key] || translations['en'][key];
}

const defaultPlaceholders = {};
const fieldTouched = {};

/**
 * Displays an error message as placeholder and adds the error CSS class.
 * @param {HTMLElement} field - The input or textarea element.
 * @param {string} fieldId - The element's ID used to look up the error message.
 */
function showFieldError(field, fieldId) {
	field.placeholder = getFieldErrorMessage(fieldId);
	field.classList.add('contact__input--error');
}

/**
 * Restores the original placeholder and removes the error CSS class.
 * @param {HTMLElement} field - The input or textarea element.
 * @param {string} fieldId - The element's ID used to look up the original placeholder.
 */
function clearFieldError(field, fieldId) {
	field.placeholder = defaultPlaceholders[fieldId];
	field.classList.remove('contact__input--error');
}

/**
 * Registers focus, blur, and input listeners for live field validation.
 * Shows an error on blur if the field was touched but left empty.
 * Clears the error as soon as the user starts typing.
 * Updates submit button state on every input change.
 * @param {HTMLElement} field - The input or textarea element.
 * @param {string} fieldId - The element's ID.
 */
function addFieldValidationListeners(field, fieldId) {
	field.addEventListener('focus', () => {
		fieldTouched[fieldId] = true;
	});
	field.addEventListener('blur', () => {
		if (fieldTouched[fieldId] && !field.value.trim()) showFieldError(field, fieldId);
	});
	field.addEventListener('input', () => {
		if (field.value.trim()) clearFieldError(field, fieldId);
		updateSubmitState();
	});
}

/**
 * Initializes validation for all contact form fields.
 * Stores each field's default placeholder and attaches validation listeners.
 */
function setupFieldValidation() {
	Object.keys(FIELD_ERROR_KEYS).forEach(fieldId => {
		const field = document.getElementById(fieldId);
		if (!field) return;
		defaultPlaceholders[fieldId] = field.placeholder;
		fieldTouched[fieldId] = false;
		addFieldValidationListeners(field, fieldId);
	});
}

/**
 * Validates a single field: marks it as touched and shows/clears error.
 * @param {string} fieldId - The element's ID.
 * @returns {boolean} True if the field is invalid.
 */
function validateField(fieldId) {
	const field = document.getElementById(fieldId);
	if (!field) return false;
	fieldTouched[fieldId] = true;
	if (!field.value.trim()) {
		showFieldError(field, fieldId);
		return true;
	}
	clearFieldError(field, fieldId);
	return false;
}

/**
 * Validates all contact form fields at once (used on submit).
 * @returns {boolean} True if at least one field is invalid.
 */
function validateAllFields() {
	let hasError = false;
	Object.keys(FIELD_ERROR_KEYS).forEach(fieldId => {
		if (validateField(fieldId)) hasError = true;
	});
	return hasError;
}

/**
 * Checks whether all form fields are filled and the privacy checkbox is checked.
 * Enables or disables the submit button accordingly.
 */
function updateSubmitState() {
	const submitBtn = document.querySelector('.contact__submit');
	const checkbox = document.getElementById('contact-privacy');
	if (!submitBtn || !checkbox) return;
	const allFilled = Object.keys(FIELD_ERROR_KEYS).every(fieldId => {
		const field = document.getElementById(fieldId);
		return field && field.value.trim();
	});
	const emailField = document.getElementById('contact-email');
	const emailValid = emailField && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim());
	submitBtn.disabled = !(allFilled && emailValid && checkbox.checked);
}

/**
 * Toggles the privacy hint visibility when the checkbox is unchecked
 * after having been checked at least once.
 * @param {HTMLElement} checkbox - The privacy checkbox element.
 */
function handlePrivacyToggle(checkbox) {
	let wasCheckedOnce = false;
	const privacyHint = document.querySelector('.contact__privacy-hint');
	checkbox.addEventListener('change', () => {
		if (checkbox.checked) wasCheckedOnce = true;
		if (privacyHint) privacyHint.style.visibility = (!checkbox.checked && wasCheckedOnce) ? 'visible' : 'hidden';
		updateSubmitState();
	});
}

/**
 * Sets up auto-resizing for the message textarea.
 */
function setupAutoResize() {
	const textarea = document.querySelector('.contact__textarea');
	if (!textarea) return;
	const maxHeight = 200;
	const resize = () => {
		textarea.style.height = 'auto';
		const scrollH = textarea.scrollHeight;
		textarea.style.height = Math.min(scrollH, maxHeight) + 'px';
		textarea.style.overflow = scrollH > maxHeight ? 'auto' : 'hidden';
	};
	textarea.addEventListener('input', resize);
}

/**
 * Resets the contact form and shows a success toast after submission.
 * @param {HTMLFormElement} form - The contact form element.
 */
function handleSubmitSuccess(form) {
	form.reset();
	const textarea = document.querySelector('.contact__textarea');
	if (textarea) textarea.style.height = '';
	updateSubmitState();
	showToast('success');
}

/**
 * Updates the submit button state and shows an error toast.
 */
function handleSubmitError() {
	updateSubmitState();
	showToast('error');
}

/**
 * Validates and submits the contact form via the email backend.
 * @param {HTMLFormElement} form - The contact form element.
 * @param {HTMLButtonElement} submitBtn - The submit button element.
 */
async function handleFormSubmit(form, submitBtn) {
	if (validateAllFields()) return;
	submitBtn.disabled = true;
	try {
		const result = await sendContactForm(form);
		if (result.success) handleSubmitSuccess(form);
		else handleSubmitError();
	} catch {
		handleSubmitError();
	}
}

/**
 * Initializes the contact form: enables the submit button via privacy checkbox
 * and sets up field validation with error messages on blur and submit.
 */
function initContactForm() {
	const privacyCheckbox = document.getElementById('contact-privacy');
	const submitButton = document.querySelector('.contact__submit');
	const contactForm = document.querySelector('.contact__form');
	if (!privacyCheckbox || !submitButton || !contactForm) return;
	handlePrivacyToggle(privacyCheckbox);
	setupFieldValidation();
	setupAutoResize();
	contactForm.addEventListener('submit', (e) => {
		e.preventDefault();
		handleFormSubmit(contactForm, submitButton);
	});
}
