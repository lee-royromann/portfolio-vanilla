document.addEventListener('DOMContentLoaded', () => {
	initCustomCursor();
	initNavbarScroll();
	initMobileMenu();
	initPeelOff();
	initFloatingCard();
	if (typeof initContactForm === 'function') initContactForm();
	initGitHubIconRoll();
});

/* ========== NAVBAR SCROLL ========== */

/**
 * Shows or hides the navbar based on scroll direction and threshold.
 * @param {HTMLElement} navbar - The navbar element.
 * @param {object} state - Shared scroll state with lastScrollY.
 * @param {number} y - Current scroll position.
 */
function applyScrollDirection(navbar, state, y) {
	const SCROLL_THRESHOLD = 40;
	const delta = y - state.lastScrollY;
	if (delta > SCROLL_THRESHOLD && y > 80) {
		navbar.classList.add('navbar--hidden');
		state.lastScrollY = y;
	} else if (delta < -SCROLL_THRESHOLD) {
		navbar.classList.remove('navbar--hidden');
		state.lastScrollY = y;
	}
}

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
	applyScrollDirection(navbar, state, y);
	navbar.classList.toggle('navbar--scrolled', y > 0);
}

/**
 * Detects when smooth scrolling has stopped using debounced scroll events.
 * @param {function} callback - Called once scrolling has fully stopped.
 */
function onScrollEnd(callback) {
	let timer = null;
	const onScroll = () => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			window.removeEventListener('scroll', onScroll);
			callback();
		}, 150);
	};
	window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Hides the navbar after a navigation click once smooth scrolling finishes.
 * @param {HTMLElement} navbar - The navbar element.
 * @param {object} state - Shared scroll state.
 */
function lockNavbarScroll(navbar, state) {
	state.locked = true;
	onScrollEnd(() => {
		state.lastScrollY = window.scrollY;
		if (window.scrollY > 80) {
			navbar.classList.add('navbar--hidden');
		}
		setTimeout(() => {
			state.locked = false;
			state.lastScrollY = window.scrollY;
		}, 300);
	});
}

/**
 * Hides the navbar when clicking outside of it.
 * @param {HTMLElement} navbar - The navbar element.
 * @param {object} state - Shared scroll state.
 */
function setupNavbarClickAway(navbar, state) {
	document.addEventListener('click', (e) => {
		if (navbar.contains(e.target)) return;
		const menu = document.querySelector('.navbar__menu');
		if (menu && menu.classList.contains('is-open')) {
			closeMenu(menu);
			return;
		}
		if (window.scrollY > 80 && !navbar.classList.contains('navbar--hidden')) {
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

/**
 * Attaches hover and animation listeners for one icon-roll wrapper.
 * @param {HTMLElement} wrapper - The icon-roll wrapper element.
 */
function addIconRollListeners(wrapper) {
	wrapper.addEventListener('mouseenter', () => {
		wrapper.classList.add('is-hovered');
		wrapper.classList.remove('is-leaving');
	});
	wrapper.addEventListener('mouseleave', () => {
		wrapper.classList.remove('is-hovered');
		wrapper.classList.add('is-leaving');
	});
	wrapper.addEventListener('animationend', (e) => {
		if (e.animationName === 'icon-roll-out') wrapper.classList.remove('is-leaving');
	});
}

/**
 * Initializes the icon-roll hover effect for footer links (GitHub, LinkedIn).
 */
function initGitHubIconRoll() {
	document.querySelectorAll('.contact__icon-roll-wrapper').forEach(addIconRollListeners);
}