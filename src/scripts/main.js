document.addEventListener('DOMContentLoaded', () => {
	initCustomCursor();
	initNavbarScroll();
	initMobileMenu();
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
	let lastScrollY = window.scrollY;

	window.addEventListener('scroll', () => {
		const currentScrollY = window.scrollY;
		if (currentScrollY > lastScrollY && currentScrollY > 80) {
			navbar.classList.add('navbar--hidden');
		} else {
			navbar.classList.remove('navbar--hidden');
		}
		lastScrollY = currentScrollY;
	}, { passive: true }); // passive improves scroll performance
}

/**
 * Initializes the mobile menu open/close behavior.
 * Opens on burger click, closes on X or link click.
 */
function initMobileMenu() {
	const burger = document.querySelector('.navbar__burger');
	const menu = document.querySelector('.navbar__menu');
	const closeBtn = document.querySelector('.navbar__close');
	if (!burger || !menu || !closeBtn) return;

	const links = menu.querySelectorAll('.navbar__link');

	burger.addEventListener('click', () => {
		menu.classList.remove('is-closing');
		menu.classList.add('is-open');
		menu.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
	});

	function closeMenu() {
		menu.classList.add('is-closing');
		menu.classList.remove('is-open');
		menu.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = '';
		menu.addEventListener('transitionend', () => menu.classList.remove('is-closing'), { once: true });
	}

	closeBtn.addEventListener('click', closeMenu);
	links.forEach((link) => link.addEventListener('click', closeMenu));
}