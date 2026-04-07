document.addEventListener('DOMContentLoaded', () => {
	initCustomCursor();
	initNavbarScroll();
	initMobileMenu();
	initPeelOff();
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
 * @param {HTMLElement} outline - The outline circle element.
 * @param {object} target - Object with current x and y mouse coordinates.
 */
function animateOutline(outline, target) {
	const pos = { x: target.x, y: target.y };
	const speed = 0.15;

	function update() {
		pos.x += (target.x - pos.x) * speed;
		pos.y += (target.y - pos.y) * speed;
		moveTo(outline, pos.x, pos.y);
		requestAnimationFrame(update); // calls itself every frame (~60fps)
	}
	update();
}

/**
 * Adds hover detection to all clickable elements.
 * Enlarges the outline circle when hovering over links or buttons.
 * @param {HTMLElement} outline - The outline circle element.
 */
function setupHoverTargets(outline) {
	const targets = document.querySelectorAll('a, button, [role="button"], [onclick], .navbar__logo');
	targets.forEach((el) => {
		el.addEventListener('mouseenter', () => outline.classList.add('cursor-outline--hover'));
		el.addEventListener('mouseleave', () => outline.classList.remove('cursor-outline--hover'));
	});
}

/**
 * Hides both cursor elements when the mouse leaves the page.
 * Shows them again when the mouse re-enters.
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
 * Initializes the custom cursor with a dot and a trailing outline circle.
 * Only active on devices that support hover (no touch screens).
 */
function initCustomCursor() {
	if (!matchMedia('(hover: hover)').matches) return;

	const dot = document.querySelector('.cursor-dot');
	const outline = document.querySelector('.cursor-outline');
	const target = { x: 0, y: 0 };
	if (!dot || !outline) return;

	document.addEventListener('mousemove', (e) => {
		target.x = e.clientX;
		target.y = e.clientY;
		moveTo(dot, e.clientX, e.clientY);

		const isDark = !!e.target.closest('[data-cursor-dark]');
		dot.classList.toggle('cursor-dot--dark', isDark);
		outline.classList.toggle('cursor-outline--dark', isDark);
	});

	animateOutline(outline, target);
	setupHoverTargets(outline);
	setupVisibility(dot, outline);
}

/**
 * Initializes the navbar hide/show behavior based on scroll direction.
 * The navbar hides when scrolling down and reappears when scrolling up.
 */
function initNavbarScroll() {
	const navbar = document.querySelector('.navbar');
	if (!navbar) return;
	const hero = document.querySelector('.hero');
	let lastScrollY = window.scrollY;
	let scrollLocked = false;

	window.addEventListener('scroll', () => {
		const currentScrollY = window.scrollY;

		if (scrollLocked) {
			lastScrollY = currentScrollY;
			navbar.classList.toggle('navbar--scrolled', currentScrollY > 0);
			return;
		}

		if (currentScrollY > lastScrollY && currentScrollY > 80) {
			navbar.classList.add('navbar--hidden');
		} else {
			navbar.classList.remove('navbar--hidden');
		}

		navbar.classList.toggle('navbar--scrolled', currentScrollY > 0);

		lastScrollY = currentScrollY;
	}, { passive: true });

	function lockScroll() {
		scrollLocked = true;
		navbar.classList.remove('navbar--hidden');
		setTimeout(() => {
			scrollLocked = false;
			lastScrollY = window.scrollY;
		}, 800);
	}

	navbar.querySelectorAll('.navbar__link, .navbar__lang, .navbar__lang-toggle').forEach(el => {
		el.addEventListener('click', lockScroll);
	});

	document.addEventListener('click', (e) => {
		if (!navbar.contains(e.target) && !navbar.classList.contains('navbar--hidden')) {
			navbar.classList.add('navbar--hidden');
			lastScrollY = window.scrollY;
		}
	});
}

/**
 * Initializes the mobile menu open/close behavior.
 * Opens on burger click, closes on X or link click.
 */
/**
 * Initializes the peel-off sticker interaction in the skills section.
 * Clicking the sticker transitions through default → transition → final state.
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

function initMobileMenu() {
	const burger = document.querySelector('.navbar__burger');
	const menu = document.querySelector('.navbar__menu');
	const closeBtn = document.querySelector('.navbar__close');
	if (!burger || !menu || !closeBtn) return;

	const links = menu.querySelectorAll('.navbar__link');
	const MOBILE_BP = 740;

	burger.addEventListener('click', () => {
		menu.classList.remove('is-closing');
		menu.classList.add('is-open');
		menu.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
	});

	function closeMenu() {
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

	closeBtn.addEventListener('click', closeMenu);
	links.forEach((link) => link.addEventListener('click', closeMenu));

	window.addEventListener('resize', () => {
		if (window.innerWidth > MOBILE_BP && menu.classList.contains('is-open')) {
			menu.classList.remove('is-open', 'is-closing');
			menu.setAttribute('aria-hidden', 'true');
			document.body.style.overflow = '';
		}
	}, { passive: true });
}