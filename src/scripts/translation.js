const translations = {
	de: {
		"hero.badge.default": "Hallo Welt",
		"hero.badge.hover": "ICH BIN LEE-ROY ROMANN",
        "hero.title.sub": "ENTWICKLER",
		"hero.cta": "Kontaktiere mich",
	},
	en: {
		"hero.badge.default": "Hello world",
		"hero.badge.hover": "I'M LEE-ROY ROMANN",
        "hero.title.sub": "DEVELOPER",
		"hero.cta": "Get in Touch",
	},
};

/**
 * Returns the currently active language from localStorage or falls back to 'de'.
 * @returns {'de'|'en'} The active language code.
 */
function getStoredLang() {
	return localStorage.getItem('lang') || 'de';
}

/**
 * Rebuilds the letter-hover spans and widths for the given title lines.
 * @param {Element[]} lines - Elements that need letter-hover re-init.
 */
function rebuildLetterHover(lines) {
	if (!lines.length) return;
	if (typeof splitTextIntoSpans !== 'function') return; // defined in hero.js
	const groups = [];
	for (const line of lines) {
		const spans = splitTextIntoSpans(line);
		addLetterListeners(spans);
		groups.push({ line, spans });
	}
	refreshLetterWidths(groups);
}

/**
 * Translates all elements with a [data-lang-key] attribute to the given language.
 * @param {'de'|'en'} lang - The target language.
 */
function translatePage(lang) {
	const dict = translations[lang];
	if (!dict) return;
	const letterHoverLines = [];
	document.querySelectorAll('[data-lang-key]').forEach((el) => {
		const key = el.dataset.langKey;
		if (dict[key] === undefined) return;
		el.textContent = dict[key];
		if (el.hasAttribute('data-letter-hover')) letterHoverLines.push(el);
	});
	rebuildLetterHover(letterHoverLines);
}

/**
 * Updates the visual state of the language switch (knob position and active label).
 * @param {'de'|'en'} lang - The active language.
 */
function updateSwitchUI(lang) {
	const knob = document.querySelector('.navbar__lang-knob');
	const langLeft = document.querySelector('.navbar__lang--left');
	const langRight = document.querySelector('.navbar__lang--right');
	if (!knob || !langLeft || !langRight) return;

	if (lang === 'en') {
		knob.classList.remove('navbar__lang-knob--right');
		langLeft.classList.add('navbar__lang--active');
		langRight.classList.remove('navbar__lang--active');
	} else {
		knob.classList.add('navbar__lang-knob--right');
		langLeft.classList.remove('navbar__lang--active');
		langRight.classList.add('navbar__lang--active');
	}
}

/**
 * Sets the language site-wide: translates content, updates the toggle UI,
 * sets the html lang attribute and persists the choice in localStorage.
 * @param {'de'|'en'} lang - The language to activate.
 */
function setLang(lang) {
	document.documentElement.lang = lang;
	translatePage(lang);
	updateSwitchUI(lang);
	localStorage.setItem('lang', lang);

	document.querySelectorAll('.hero__badge').forEach((badge) => {
		if (typeof setBadgeWidths === 'function') setBadgeWidths(badge); // defined in hero.js
	});
}

/**
 * Toggles between 'de' and 'en'.
 */
function toggleLang() {
	setLang(getStoredLang() === 'de' ? 'en' : 'de');
}

// Restore saved language on page load
document.addEventListener('DOMContentLoaded', () => {
	setLang(getStoredLang());
});