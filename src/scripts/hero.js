document.addEventListener('DOMContentLoaded', () => {
	initLetterHover();
	initIconRoll();
});

const LETTER_SCALE = 1;
const LETTER_GAP = 6;

// Letter Hover

/**
 * Builds the letter markup with an outer box and an inner visual span.
 * @param {string} text - The text to split into letters.
 * @returns {string} The generated letter markup.
 */
function createLetterMarkup(text) {
	let html = '';
	for (const ch of text) {
		html += '<span class="hero__letter" data-original="' + ch + '">';
		html += '<span class="hero__letter-inner">' + ch + '</span>';
		html += '</span>';
	}
	return html;
}

/**
 * Splits a title line into measured hover letters.
 * @param {HTMLElement} el - The title line element.
 * @returns {HTMLSpanElement[]} The created outer letter spans.
 */
function splitTextIntoSpans(el) {
	el.innerHTML = createLetterMarkup(el.textContent.trim());
	return Array.from(el.querySelectorAll('.hero__letter'));
}

/**
 * Creates one hidden measurement letter inside the same line.
 * @param {HTMLElement} line - The line used for style inheritance.
 * @returns {HTMLSpanElement} The hidden measurement letter.
 */
function createMeasureLetter(line) {
	const measure = document.createElement('span');
	measure.className = 'hero__letter hero__letter--measure';
	measure.innerHTML = '<span class="hero__letter-inner"></span>';
	line.appendChild(measure);
	return measure;
}

/**
 * Flips the case of a character.
 * @param {string} original - The original character.
 * @returns {string} The toggled character.
 */
function toggleCase(original) {
	return original === original.toUpperCase()
		? original.toLowerCase()
		: original.toUpperCase();
}

/**
 * Measures the base and hover width for one letter.
 * @param {string} original - The original character.
 * @param {HTMLSpanElement} measure - The hidden measurement letter.
 * @returns {{baseWidth: number, hoverWidth: number}} The measured widths.
 */
function getLetterWidths(original, measure) {
	const inner = measure.querySelector('.hero__letter-inner');
	inner.textContent = original;
	const baseWidth = measure.getBoundingClientRect().width;
	inner.textContent = toggleCase(original);
	const nextWidth = measure.getBoundingClientRect().width;
	const hoverWidth = Math.max(baseWidth, nextWidth) * LETTER_SCALE + LETTER_GAP;
	return { baseWidth, hoverWidth };
}

/**
 * Stores the measured width values on all letters in one line.
 * @param {HTMLSpanElement[]} spans - The outer letter spans.
 * @param {HTMLElement} line - The line containing the letters.
 */
function setLetterWidths(spans, line) {
	const measure = createMeasureLetter(line);
	spans.forEach((span) => {
		const { baseWidth, hoverWidth } = getLetterWidths(span.dataset.original, measure);
		span.style.setProperty('--letter-base-width', `${baseWidth}px`);
		span.style.setProperty('--letter-hover-width', `${hoverWidth}px`);
	});
	measure.remove();
}

/**
 * Activates the hover effect on a single letter span.
 * Toggles the displayed case and adds the hover class.
 * @param {HTMLSpanElement} span - The outer letter span to activate.
 */
function applyHover(span) {
	const inner = span.querySelector('.hero__letter-inner');
	inner.textContent = toggleCase(span.dataset.original);
	span.classList.add('is-hovered');
}

/**
 * Removes the hover effect from a single letter span.
 * Restores the original character and removes the hover class.
 * @param {HTMLSpanElement} span - The outer letter span to reset.
 */
function removeHover(span) {
	const inner = span.querySelector('.hero__letter-inner');
	inner.textContent = span.dataset.original;
	span.classList.remove('is-hovered');
}

/**
 * Adds simple mouseenter and mouseleave listeners to all letters.
 * @param {HTMLSpanElement[]} spans - All outer letter spans.
 */

function addLetterListeners(spans) {
	spans.forEach((span) => {
		span.addEventListener('mouseenter', () => applyHover(span));
		span.addEventListener('mouseleave', () => removeHover(span));
	});
}

/**
 * Recalculates widths for all letter hover lines.
 * @param {Array<{ line: HTMLElement, spans: HTMLSpanElement[] }>} groups - All letter groups.
 */
function refreshLetterWidths(groups) {
	groups.forEach(({ line, spans }) => setLetterWidths(spans, line));
}

/**
 * Initializes the letter hover effect for all elements with [data-letter-hover].
 * Uses measured widths so hover grows the word without overlap or flicker.
 */
function buildLetterGroups() {
	const lines = document.querySelectorAll('[data-letter-hover]');
	const groups = [];
	for (const line of lines) {
		const spans = splitTextIntoSpans(line);
		addLetterListeners(spans);
		groups.push({ line, spans });
	}
	return groups;
}

function initLetterHover() {
	document.fonts.ready.then(() => {
		const groups = buildLetterGroups();
		refreshLetterWidths(groups);
		window.addEventListener('resize', () => refreshLetterWidths(groups));
	});
}


// Badge Icon Roll

/**
 * Measures the natural text width of a hidden clone inside the badge.
 * @param {HTMLElement} badge - The badge element.
 * @param {string} text - The text to measure.
 * @returns {number} The required width including padding.
 */
function measureBadgeText(badge, text) {
	const clone = document.createElement('span');
	clone.className = 'hero__badge-text';
	clone.style.position = 'absolute';
	clone.style.visibility = 'hidden';
	clone.style.whiteSpace = 'nowrap';
	clone.textContent = text;
	badge.appendChild(clone);
	const width = clone.getBoundingClientRect().width;
	clone.remove();
	return width;
}

/**
 * Sets --badge-width-default and --badge-width-hover on the badge
 * based on the actual text content of both spans.
 * @param {HTMLElement} badge - The badge element.
 */
function setBadgeWidths(badge) {
	const defaultText = badge.querySelector('.hero__badge-text--default').textContent;
	const hoverText = badge.querySelector('.hero__badge-text--hover').textContent;
	const padding = 48;
	badge.style.setProperty('--badge-width-default', measureBadgeText(badge, defaultText) + padding + 'px');
	badge.style.setProperty('--badge-width-hover', measureBadgeText(badge, hoverText) + padding + 'px');
}

/**
 * Expands the badge and starts the hand roll-in animation.
 * @param {HTMLElement} wrapper - The badge wrapper element.
 * @param {HTMLElement} badge - The badge element inside the wrapper.
 */
function startBadgeExpand(wrapper, badge) {
	wrapper.classList.add('is-hovered');
	wrapper.classList.remove('is-leaving');
	badge.classList.add('is-expanded');
}

/**
 * Shrinks the badge and starts the hand roll-out animation.
 * @param {HTMLElement} wrapper - The badge wrapper element.
 * @param {HTMLElement} badge - The badge element inside the wrapper.
 */
function startBadgeShrink(wrapper, badge) {
	wrapper.classList.remove('is-hovered');
	wrapper.classList.add('is-leaving');
	badge.classList.remove('is-expanded');
}

/**
 * Removes a CSS class from an element when a specific animation finishes.
 * @param {HTMLElement} el - The element to listen on.
 * @param {string} animationName - The CSS animation name to wait for.
 * @param {string} className - The class to remove after the animation ends.
 */
function cleanUpAnimation(el, animationName, className) {
	el.addEventListener('animationend', (e) => {
		if (e.animationName === animationName) {
			el.classList.remove(className);
		}
	});
}

/**
 * Initializes the badge hover effect with hand icon roll animation.
 * Measures text widths so the badge adapts dynamically to content.
 */
function initIconRoll() {
	document.querySelectorAll('.hero__badge-wrapper').forEach((wrapper) => {
		const badge = wrapper.querySelector('.hero__badge');
		setBadgeWidths(badge);

		wrapper.addEventListener('mouseenter', () => startBadgeExpand(wrapper, badge));
		wrapper.addEventListener('mouseleave', () => startBadgeShrink(wrapper, badge));

		cleanUpAnimation(wrapper, 'hero-icon-roll-left', 'is-leaving');
	});
}
