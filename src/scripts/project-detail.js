/**
 * Reads the "project" query parameter from the current URL.
 * @returns {string|null} The project id or null.
 */
function getProjectId() {
	return new URLSearchParams(window.location.search).get('project');
}

/**
 * Finds a project object by its id from the projectData array.
 * @param {string} id - The project identifier.
 * @returns {object|undefined} The matching project or undefined.
 */
function findProject(id) {
	return projectData.find((p) => p.id === id);
}

/**
 * Returns the index of a project by its id.
 * @param {string} id - The project identifier.
 * @returns {number} The index in the projectData array.
 */
function getProjectIndex(id) {
	return projectData.findIndex((p) => p.id === id);
}

/**
 * Builds the tech stack HTML for a project and injects it into the container.
 * @param {object[]} techList - Array of {name, icon} objects.
 */
function renderTechStack(techList) {
	const container = document.getElementById('projectTech');
	if (!container) return;
	container.innerHTML = '';
	for (const tech of techList) {
		const item = document.createElement('span');
		item.className = 'project-detail__tech-item';
		item.innerHTML = `<img class="project-detail__tech-icon" src="${tech.icon}" alt="${tech.name}" /><span>${tech.name}</span>`;
		container.appendChild(item);
	}
}

/**
 * Populates all static (non-translated) project fields on the page.
 * @param {object} project - The project data object.
 */
function populateStaticFields(project) {
	document.getElementById('projectTitle').textContent = project.title;
	document.getElementById('projectImage').src = project.image;
	document.getElementById('projectImage').alt = project.title + ' preview';
	document.getElementById('projectGithub').href = project.github;
	document.getElementById('projectLive').href = project.live;
	document.title = project.title + ' – Lee-Roy Romann';
}

/**
 * Shows the featured sticker for Join or the logo sticker for other projects.
 * @param {object} project - The project data object.
 */
function handleSticker(project) {
	const featured = document.getElementById('stickerFeatured');
	const logo = document.getElementById('stickerLogo');
	if (!featured || !logo) return;
	if (project.sticker) {
		featured.style.display = '';
		logo.style.display = 'none';
	} else {
		featured.style.display = 'none';
		logo.style.display = '';
	}
}

/**
 * Sets up the "Next Project" link to point to the next project cyclically.
 * @param {number} currentIndex - Index of the current project.
 */
function setupNextProject(currentIndex) {
	const nextIndex = (currentIndex + 1) % projectData.length;
	const nextProject = projectData[nextIndex];
	const nextLink = document.getElementById('projectNext');
	if (nextLink) {
		nextLink.href = `project.html?project=${nextProject.id}`;
	}
}

/**
 * Sets translated text content for the project's dynamic fields.
 * @param {object} project - The project data object.
 */
function applyProjectTranslations(project) {
	const lang = getStoredLang();
	const dict = translations[lang];
	if (!dict) return;
	setTextIfExists('projectDescription', dict[project.descriptionKey]);
	setTextIfExists('projectImplementation', dict[project.implementationKey]);
	setTextIfExists('projectDuration', dict[project.durationKey]);
}

/**
 * Sets textContent on an element by id if the value exists.
 * @param {string} id - The DOM element id.
 * @param {string|undefined} value - The text to set.
 */
function setTextIfExists(id, value) {
	const el = document.getElementById(id);
	if (el && value !== undefined) el.textContent = value;
}

/**
 * Initializes the project detail page by loading data from the URL parameter.
 */
function initProjectDetail() {
	const id = getProjectId();
	const project = id ? findProject(id) : projectData[0];
	if (!project) return;
	populateStaticFields(project);
	handleSticker(project);
	renderTechStack(project.tech);
	setupNextProject(getProjectIndex(project.id));
	applyProjectTranslations(project);
}

document.addEventListener('DOMContentLoaded', initProjectDetail);
