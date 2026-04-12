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
		"skills.subtitle": "MEIN STACK",
		"skills.title": "Skill set",
		"skills.description": "In Projekten sammelte ich praxisnahe Frontend-Erfahrung, übersetzte Konzepte in responsive Interfaces, arbeitete in strukturierten Workflows und schärfte meinen Entwicklungsansatz kontinuierlich.",
		"skills.peel.title": "Ausserdem interessiere ich mich für:",
		"projects.subtitle": "MEINE ARBEIT",
		"projects.title": "Projekte",
		"projects.description": "Wirf einen Blick auf meine Projekte und erlebe sie interaktiv. Mein Fokus liegt auf responsiven, nutzerfreundlichen Anwendungen mit effizientem Code.",
		"projects.btn": "Projektdetails",
		"projects.join.text": "Aufgabenmanager nach dem Kanban-Prinzip. Erstelle und organisiere Aufgaben per Drag & Drop, weise Nutzer und Kategorien zu.",
		"projects.eplc.text": "Ein Jump-and-Run-Spiel auf Basis objektorientierter Programmierung. Hilf Pepe, Münzen und Tabasco-Salsa zu finden, um gegen das verrückte Huhn zu kämpfen.",
		"projects.dabubble.text": "Diese App ist ein Slack-Klon. Sie revolutioniert Teamkommunikation und Zusammenarbeit mit einer intuitiven Oberfläche, Echtzeit-Nachrichten und einer durchdachten Kanalstruktur.",
		"testimonials.subtitle": "IN IHREN WORTEN:",
		"testimonials.title": "Stimmen von Kollegen",
		"testimonials.profile": "Profil",
		"testimonials.quote1": "Lee-Roy hat das Team mit seiner grossartigen Organisation und klaren Kommunikation wirklich zusammengehalten. Ohne seinen Einsatz wären wir nicht so weit gekommen.",
		"testimonials.role1": "Frontend-Entwickler",
		"testimonials.quote2": "Es war eine Freude, mit Lee-Roy zu arbeiten. Er weiss, wie man Teammitglieder motiviert und ermutigt, ihr Bestes zu geben, und bringt immer neue Ideen in jedes Brainstorming ein. Was das Wohlbefinden anderer betrifft, war er stets präsent und bereit zu helfen – mit viel Humor obendrein.",
		"testimonials.role2": "Frontend-Entwickler",
		"testimonials.quote3": "Lee-Roy war ein herausragender Teamkollege bei DA. Seine positive Einstellung und seine Bereitschaft, Herausforderungen anzunehmen, haben massgeblich dazu beigetragen, dass wir unsere Ziele erreicht haben.",
		"testimonials.role3": "Entwicklerin",
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
		"skills.subtitle": "MY STACK",
		"skills.title": "Skill set",
		"skills.description": "Across projects, I gained hands-on frontend experience, turning concepts into responsive interfaces, collaborating in structured workflows, and refining my development approach.",
		"skills.peel.title": "Also, I'm interested in diving into:",
		"projects.subtitle": "MY CRAFT",
		"projects.title": "Projects",
		"projects.description": "Take a look at my projects and experience them interactively. My focus is on responsive, user-friendly applications with efficient code.",
		"projects.btn": "Project details",
		"projects.join.text": "Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.",
		"projects.eplc.text": "Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tabasco salsa to fight against the crazy hen.",
		"projects.dabubble.text": "This App is a Slack Clone App. It revolutionizes team communication and collaboration with its intuitive interface, real-time messaging, and robust channel organization.",
		"testimonials.subtitle": "IN THEIR WORDS:",
		"testimonials.title": "Colleagues' Thoughts",
		"testimonials.profile": "Profile",
		"testimonials.quote1": "Lee-Roy really kept the team together with his great organization and clear communication. We wouldn't have got this far without his commitment.",
		"testimonials.role1": "Frontend Developer",
		"testimonials.quote2": "It was a pleasure to work with Lee-Roy. He knows how to motivate and encourage team members to deliver their best work possible, always adding new ideas to every brainstorm. Regarding the well-being of others, he was always present and willing to reach out and help others, with a great sense of humor as well.",
		"testimonials.role2": "Frontend Developer",
		"testimonials.quote3": "Lee-Roy was an outstanding team colleague at DA. His positive attitude and willingness to take on challenges made a significant contribution to us achieving our goals.",
		"testimonials.role3": "Developer",
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