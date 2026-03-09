const translations = {
	de: {
		"navbar.link.about": "Über mich",
		"navbar.link.skills": "Skills",
		"navbar.link.projects": "Projekte",
		"navbar.link.contact": "Kontakt",
		"hero.badge.default": "Hallo Welt",
		"hero.badge.hover": "ICH BIN LEE-ROY ROMANN",
		"hero.cta": "Kontaktiere mich",
	},
	en: {
		"navbar.link.about": "About me",
		"navbar.link.skills": "Skills",
		"navbar.link.projects": "Projects",
		"navbar.link.contact": "Contact",
		"hero.badge.default": "Hello world",
		"hero.badge.hover": "I'M LEE-ROY ROMANN",
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
	document.querySelectorAll('.navbar__lang-knob').forEach((knob) => {
		knob.classList.toggle('navbar__lang-knob--right', lang === 'de');
	});
	document.querySelectorAll('.navbar__lang--left').forEach((el) => {
		el.classList.toggle('navbar__lang--active', lang === 'en');
	});
	document.querySelectorAll('.navbar__lang--right').forEach((el) => {
		el.classList.toggle('navbar__lang--active', lang === 'de');
	});
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