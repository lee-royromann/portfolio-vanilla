/**
 * Moves an element to the given screen coordinates using CSS transform.
 * @param {HTMLElement} el - The element to move.
 * @param {number} x - Horizontal position in pixels.
 * @param {number} y - Vertical position in pixels.
 */
function moveTo(el, x, y) {
	el.style.left = x + 'px';
	el.style.top = y + 'px';
}

/**
 * Makes the outline circle follow the dot with a smooth delay.
 * Uses requestAnimationFrame for fluid animation.
 */
function updateOutlinePosition(outline, pos, target) {
	pos.x += (target.x - pos.x) * 0.15;
	pos.y += (target.y - pos.y) * 0.15;
	moveTo(outline, pos.x, pos.y);
	requestAnimationFrame(() => updateOutlinePosition(outline, pos, target));
}

/**
 * Starts the outline follow animation by initializing position tracking.
 * @param {HTMLElement} outline - The outline circle element.
 * @param {object} target - Object with current x and y mouse coordinates.
 */
function animateOutline(outline, target) {
	const pos = { x: target.x, y: target.y };
	requestAnimationFrame(() => updateOutlinePosition(outline, pos, target));
}

/**
 * Hides both custom cursor elements when hovering over clickable elements,
 * so the native pointer cursor is visible.
 */
function setupHoverTargets(dot, outline) {
	const targets = document.querySelectorAll('a, button, [role="button"], [onclick], .navbar__logo, .skills__peel-off, .testimonials__card, .contact__submit, .contact__input, .contact__checkbox, .contact__privacy-link');
	targets.forEach((el) => {
		el.addEventListener('mouseenter', () => {
			outline.classList.add('cursor-outline--hover');
			dot.classList.add('cursor-dot--hover');
		});
		el.addEventListener('mouseleave', () => {
			outline.classList.remove('cursor-outline--hover');
			dot.classList.remove('cursor-dot--hover');
		});
	});
}

/**
 * Hides both cursor elements when the mouse leaves the viewport
 * and shows them again on re-entry.
 * @param {HTMLElement} dot - The dot cursor element.
 * @param {HTMLElement} outline - The outline circle element.
 */
function setupVisibility(dot, outline) {
	document.addEventListener('mouseleave', () => {
		dot.classList.add('cursor-dot--hidden');
		outline.classList.add('cursor-outline--hidden');
	});
	document.addEventListener('mouseenter', () => {
		dot.classList.remove('cursor-dot--hidden');
		outline.classList.remove('cursor-outline--hidden');
	});
}

/**
 * Checks whether the current page should use blend-mode cursor colors.
 * @returns {boolean} True when the current page uses blend-mode cursors.
 */
function usesBlendCursorTheme() {
	return document.body.classList.contains('page--project-detail')
		|| document.body.classList.contains('page--home');
}

/**
 * Applies the correct color mode to the custom cursor.
 * @param {MouseEvent} e - The current mouse event.
 * @param {HTMLElement} dot - The dot cursor element.
 * @param {HTMLElement} outline - The outline circle element.
 */
function syncCursorTheme(e, dot, outline) {
	if (usesBlendCursorTheme()) {
		dot.classList.remove('cursor-dot--dark');
		outline.classList.remove('cursor-outline--dark');
		return;
	}
	const isDark = !!e.target.closest('[data-cursor-dark]');
	dot.classList.toggle('cursor-dot--dark', isDark);
	outline.classList.toggle('cursor-outline--dark', isDark);
}

/**
 * Tracks mouse movement to update dot position and cursor color mode.
 * @param {HTMLElement} dot - The dot cursor element.
 * @param {HTMLElement} outline - The outline circle element.
 * @param {object} target - Object storing current mouse coordinates.
 */
function handleMouseMove(dot, outline, target) {
	document.addEventListener('mousemove', (e) => {
		target.x = e.clientX;
		target.y = e.clientY;
		moveTo(dot, e.clientX, e.clientY);
		syncCursorTheme(e, dot, outline);
	});
}

/**
 * Initializes the custom cursor with a dot and a trailing outline circle.
 * Only active on devices that support hover (no touch screens).
 */
function initCustomCursor() {
	if (!matchMedia('(pointer: fine) and (hover: hover)').matches) return;
	const dot = document.querySelector('.cursor-dot');
	const outline = document.querySelector('.cursor-outline');
	if (!dot || !outline) return;
	const target = { x: 0, y: 0 };
	handleMouseMove(dot, outline, target);
	animateOutline(outline, target);
	setupHoverTargets(dot, outline);
	setupVisibility(dot, outline);
}
