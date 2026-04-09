document.addEventListener('DOMContentLoaded', () => {
	initCustomCursor();
	initNavbarScroll();
	initMobileMenu();
	initPeelOff();
	initFloatingCard();
});

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
	const targets = document.querySelectorAll('a, button, [role="button"], [onclick], .navbar__logo, .skills__peel-off');
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
		const isDark = !!e.target.closest('[data-cursor-dark]');
		dot.classList.toggle('cursor-dot--dark', isDark);
		outline.classList.toggle('cursor-outline--dark', isDark);
	});
}

/**
 * Initializes the custom cursor with a dot and a trailing outline circle.
 * Only active on devices that support hover (no touch screens).
 */
function initCustomCursor() {
	if (!matchMedia('(hover: hover)').matches) return;
	const dot = document.querySelector('.cursor-dot');
	const outline = document.querySelector('.cursor-outline');
	if (!dot || !outline) return;
	const target = { x: 0, y: 0 };
	handleMouseMove(dot, outline, target);
	animateOutline(outline, target);
	setupHoverTargets(dot, outline);
	setupVisibility(dot, outline);
}

/* ========== NAVBAR SCROLL ========== */

/**
 * Handles scroll events to show or hide the navbar based on direction.
 * @param {HTMLElement} navbar - The navbar element.
 * @param {object} state - Shared scroll state with lastScrollY and locked flag.
 */
function handleScroll(navbar, state) {
	const y = window.scrollY;
	if (state.locked) {
		state.lastScrollY = y;
		navbar.classList.toggle('navbar--scrolled', y > 0);
		return;
	}
	if (y > state.lastScrollY && y > 80) navbar.classList.add('navbar--hidden');
	else navbar.classList.remove('navbar--hidden');
	navbar.classList.toggle('navbar--scrolled', y > 0);
	state.lastScrollY = y;
}

/**
 * Temporarily locks the navbar in visible state after a navigation click.
 * @param {HTMLElement} navbar - The navbar element.
 * @param {object} state - Shared scroll state.
 */
function lockNavbarScroll(navbar, state) {
	state.locked = true;
	navbar.classList.remove('navbar--hidden');
	setTimeout(() => {
		state.locked = false;
		state.lastScrollY = window.scrollY;
	}, 800);
}

/**
 * Hides the navbar when clicking outside of it.
 * @param {HTMLElement} navbar - The navbar element.
 * @param {object} state - Shared scroll state.
 */
function setupNavbarClickAway(navbar, state) {
	document.addEventListener('click', (e) => {
		if (!navbar.contains(e.target) && !navbar.classList.contains('navbar--hidden')) {
			navbar.classList.add('navbar--hidden');
			state.lastScrollY = window.scrollY;
		}
	});
}

/**
 * Initializes the navbar hide/show behavior based on scroll direction.
 */
function initNavbarScroll() {
	const navbar = document.querySelector('.navbar');
	if (!navbar) return;
	const state = { lastScrollY: window.scrollY, locked: false };
	window.addEventListener('scroll', () => handleScroll(navbar, state), { passive: true });
	navbar.querySelectorAll('.navbar__link, .navbar__lang, .navbar__lang-toggle').forEach(el => {
		el.addEventListener('click', () => lockNavbarScroll(navbar, state));
	});
	setupNavbarClickAway(navbar, state);
}

/* ========== MOBILE MENU ========== */

/**
 * Opens the mobile navigation menu and prevents body scrolling.
 * @param {HTMLElement} menu - The mobile menu element.
 */
function openMenu(menu) {
	menu.classList.remove('is-closing');
	menu.classList.add('is-open');
	menu.setAttribute('aria-hidden', 'false');
	document.body.style.overflow = 'hidden';
}

/**
 * Closes the mobile menu with a transition animation and restores scrolling.
 * @param {HTMLElement} menu - The mobile menu element.
 */
function closeMenu(menu) {
	if (!menu.classList.contains('is-open')) return;
	menu.classList.add('is-closing');
	menu.classList.remove('is-open');
	menu.setAttribute('aria-hidden', 'true');
	document.body.style.overflow = '';
	const fallback = setTimeout(() => menu.classList.remove('is-closing'), 500);
	menu.addEventListener('transitionend', () => {
		clearTimeout(fallback);
		menu.classList.remove('is-closing');
	}, { once: true });
}

/**
 * Closes the menu automatically when resizing above the mobile breakpoint.
 * @param {HTMLElement} menu - The mobile menu element.
 */
function setupMenuResize(menu) {
	window.addEventListener('resize', () => {
		if (window.innerWidth > 740 && menu.classList.contains('is-open')) {
			menu.classList.remove('is-open', 'is-closing');
			menu.setAttribute('aria-hidden', 'true');
			document.body.style.overflow = '';
		}
	}, { passive: true });
}

/**
 * Initializes the mobile menu open/close behavior.
 */
function initMobileMenu() {
	const burger = document.querySelector('.navbar__burger');
	const menu = document.querySelector('.navbar__menu');
	const closeBtn = document.querySelector('.navbar__close');
	if (!burger || !menu || !closeBtn) return;
	burger.addEventListener('click', () => openMenu(menu));
	closeBtn.addEventListener('click', () => closeMenu(menu));
	menu.querySelectorAll('.navbar__link').forEach(link => {
		link.addEventListener('click', () => closeMenu(menu));
	});
	setupMenuResize(menu);
}

/* ========== PEEL OFF ========== */

/**
 * Initializes the peel-off sticker interaction in the skills section.
 */
function initPeelOff() {
	const peelOff = document.querySelector('.skills__peel-off');
	if (!peelOff) return;
	peelOff.addEventListener('click', () => {
		if (peelOff.classList.contains('is-peeled')) return;
		if (peelOff.classList.contains('is-peeling')) return;
		peelOff.classList.add('is-peeling');
		setTimeout(() => {
			peelOff.classList.remove('is-peeling');
			peelOff.classList.add('is-peeled');
		}, 150);
	});
}

/* ========== FLOATING CARD (JOIN) ========== */

const FLOAT_TOP = -5;
const FLOAT_BOTTOM = 25;
const FLOAT_DURATION = 3000;

/**
 * Performs a single frame of the floating animation using a sine curve.
 * @param {HTMLElement} img - The image element to animate.
 * @param {object} state - Shared animation state with hovering and animId.
 * @param {number} startTime - Timestamp when the animation loop started.
 * @param {number} time - Current frame timestamp from requestAnimationFrame.
 */
function floatStep(img, state, startTime, time) {
	if (state.hovering) return;
	const elapsed = (time - startTime) % FLOAT_DURATION;
	const progress = elapsed / FLOAT_DURATION;
	const t = (1 - Math.cos(progress * 2 * Math.PI)) / 2;
	const y = FLOAT_TOP + t * (FLOAT_BOTTOM - FLOAT_TOP);
	img.style.transform = `translateY(${y}px)`;
	state.animId = requestAnimationFrame((next) => floatStep(img, state, startTime, next));
}

/**
 * Starts the floating animation loop for the Join project card.
 * @param {HTMLElement} img - The image element to animate.
 * @param {object} state - Shared animation state.
 */
function startFloatLoop(img, state) {
	const start = performance.now();
	state.animId = requestAnimationFrame((time) => floatStep(img, state, start, time));
}

/**
 * Stops the float animation and smoothly scales the image on hover.
 * Only active above the mobile breakpoint (740px).
 * @param {HTMLElement} img - The image element.
 * @param {object} state - Shared animation state.
 */
function handleFloatEnter(img, state) {
	if (window.innerWidth <= 740) return;
	state.hovering = true;
	if (state.animId) cancelAnimationFrame(state.animId);
	img.style.transition = 'transform 0.3s ease';
	img.style.transform = 'scale(1.1) translateX(-25px)';
}

/**
 * Resets the image position and restarts the float animation after hover.
 * Only active above the mobile breakpoint (740px).
 * @param {HTMLElement} img - The image element.
 * @param {object} state - Shared animation state.
 */
function handleFloatLeave(img, state) {
	if (window.innerWidth <= 740) return;
	img.style.transition = 'transform 0.3s ease';
	img.style.transform = 'translateY(0)';
	setTimeout(() => {
		img.style.transition = '';
		state.hovering = false;
		startFloatLoop(img, state);
	}, 300);
}

/**
 * Animates the Join project card with a floating up/down motion.
 * On hover the float stops smoothly and transitions to scale.
 */
function initFloatingCard() {
	const container = document.querySelector('.projects__card-image--float');
	if (!container) return;
	const img = container.querySelector('.projects__card-img');
	if (!img) return;
	const state = { hovering: false, animId: null };
	startFloatLoop(img, state);
	container.addEventListener('mouseenter', () => handleFloatEnter(img, state));
	container.addEventListener('mouseleave', () => handleFloatLeave(img, state));
}