const translations = {
	de: {
		"navbar.link.about": "Über mich",
		"navbar.link.skills": "Skills",
		"navbar.link.projects": "Projekte",
		"navbar.link.contact": "Kontakt",
		"hero.badge.default": "Hallo Welt",
		"hero.badge.hover": "ICH BIN LEE-ROY ROMANN",
		"hero.cta": "Kontaktiere mich",
		"about.subtitle": "WER IST LEE-ROY?",
		"about.title": "Über mich",
		"about.paper.location": "Wohnhaft in Bern",
		"about.paper.relocation": "Offen für Umzug",
		"about.paper.remote": "Offen für Remote-Arbeit",
		"about.text": "Hey, ich bin Lee-Roy. Ich bin ein Frontend-Entwickler, der es liebt, Ideen in saubere, interaktive Web-Erlebnisse zu verwandeln. Was mich antreibt, ist der Moment, wenn Design und Code nahtlos zusammenfinden und Interfaces entstehen, die nicht nur gut aussehen, sondern sich auch intuitiv anfühlen. Jedes Projekt ist eine Chance, meine Fähigkeiten weiterzuentwickeln und die perfekte Balance zwischen Kreativität und Performance zu finden.",
		"about.text2": "Lass uns zusammenarbeiten und etwas Bemerkenswertes schaffen!",
		"about.cta": "Schreib mir",
	},
	en: {
		"navbar.link.about": "About me",
		"navbar.link.skills": "Skills",
		"navbar.link.projects": "Projects",
		"navbar.link.contact": "Contact",
		"hero.badge.default": "Hello world",
		"hero.badge.hover": "I'M LEE-ROY ROMANN",
		"hero.cta": "Get in Touch",
		"about.subtitle": "WHO'S LEE-ROY?",
		"about.title": "About me",
		"about.paper.location": "Based in Bern",
		"about.paper.relocation": "Open to relocate",
		"about.paper.remote": "Open to work remote",
		"about.text": "Hey there, I'm Lee-Roy. I'm a frontend developer who loves turning ideas into clean, interactive web experiences. What drives me is the moment when design and code come together seamlessly, building interfaces that not only look great but feel intuitive to use. Every project is a chance to push my skills further and find that perfect balance between creativity and performance.",
		"about.text2": "Let's collaborate and build something remarkable together!",
		"about.cta": "Let's talk",
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