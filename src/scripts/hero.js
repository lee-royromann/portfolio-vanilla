document.addEventListener('DOMContentLoaded', () => {
	initLetterHover();
	initIconRoll();
});

const LETTER_GAP = 6;

// Letter Hover

/**
 * Flips the case of a character.
 * @param {string} ch - The character to toggle.
 * @returns {string} The toggled character.
 */
function toggleCase(ch) {
	return ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase();
}

/**
 * Creates a hidden measurement span inside a line for width calculations.
 * @param {HTMLElement} line - The line to append the measurement span to.
 * @returns {{ measure: HTMLSpanElement, mInner: HTMLSpanElement }}
 */
function createMeasureSpan(line) {
	const measure = document.createElement('span');
	measure.className = 'hero__letter hero__letter--measure';
	measure.innerHTML = '<span class="hero__letter-inner"></span>';
	line.appendChild(measure);
	return { measure, mInner: measure.querySelector('.hero__letter-inner') };
}

/**
 * Measures base and hover widths for all letter spans in a line
 * using a single hidden measurement element.
 * @param {HTMLElement} line - The title line containing the letter spans.
 */
function measureLetterWidths(line) {
	const { measure, mInner } = createMeasureSpan(line);

	for (const span of line.querySelectorAll('.hero__letter:not(.hero__letter--measure)')) {
		const ch = span.dataset.original;
		mInner.textContent = ch;
		const baseW = measure.getBoundingClientRect().width;
		mInner.textContent = toggleCase(ch);
		const hoverW = Math.max(baseW, measure.getBoundingClientRect().width) + LETTER_GAP;
		span.style.setProperty('--letter-base-width', `${baseW}px`);
		span.style.setProperty('--letter-hover-width', `${hoverW}px`);
	}
	measure.remove();
}

/**
 * Replaces a line's text with individual letter spans for hover interaction.
 * @param {HTMLElement} line - The title line element.
 */
function splitIntoLetterSpans(line) {
	const text = line.textContent.trim();
	line.innerHTML = [...text]
		.map((ch) => `<span class="hero__letter" data-original="${ch}"><span class="hero__letter-inner">${ch}</span></span>`)
		.join('');
}

/**
 * Adds hover listeners that toggle each letter's case and highlight it.
 * @param {HTMLElement} line - The title line containing the letter spans.
 */
function addLetterListeners(line) {
	for (const span of line.querySelectorAll('.hero__letter')) {
		const inner = span.querySelector('.hero__letter-inner');
		const ch = span.dataset.original;
		span.addEventListener('mouseenter', () => {
			inner.textContent = toggleCase(ch);
			span.classList.add('is-hovered');
		});
		span.addEventListener('mouseleave', () => {
			inner.textContent = ch;
			span.classList.remove('is-hovered');
		});
	}
}

/**
 * Initializes the letter hover effect for all elements with [data-letter-hover].
 * Splits text into individual spans, measures widths, and adds hover listeners.
 */
function initLetterHover() {
	document.fonts.ready.then(() => {
		const lines = document.querySelectorAll('[data-letter-hover]');
		lines.forEach((line) => {
			splitIntoLetterSpans(line);
			measureLetterWidths(line);
			addLetterListeners(line);
		});
		window.addEventListener('resize', () => {
			lines.forEach((line) => measureLetterWidths(line));
		});
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