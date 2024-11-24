// ===========
// Import Stuff
// ===========

// Import DOM Elements
import {
	addListBtn,
	listOptions,
	listsContainer,
	mainListContainer,
	pageTitle,
	listOverlay,
	deleteListBtn,
	pinListOptionBtn,
	renameListOptionBtn,
	renameInputField,
	deleteListOverlay,
	deleteListConfirmBtn,
	deleteListTitle,
	deleteListCancelBtn,
	preloader,
	menuBar,
	nav,
	close,
	navOverlay,
	pinOrunpin,
	PinIcon,
	unPinIcon,
} from "./modules/elements.js";
// Import Storage
import { storage, saveLists, savePageId } from "./modules/storage.js";

// Variables
let lists = storage.get("totalLists", []);
let currentPageId = storage.get("currentPageId", 1);
let listCounter = storage.get("listCounter", 1);
let contextListItem = null;
const LIST_IDS = {
	MY_DAY: 1,
	IMPORTANT: 2,
	COMPLETED: 3,
	ALL_TASKS: 4,
};

// ===============
// Event Listeners
// ===============

// Preventing Context Menu Of The Browser
window.addEventListener("contextmenu", (e) => {
	e.preventDefault();
});
// Display a Preloader when page is loading
window.addEventListener("load", () => {
	preloader.style.opacity = "0";
	preloader.style.pointerEvents = "none";
});
// Navigation Bar Events handling
menuBar.addEventListener("click", () => {
	handleNavigationBar(false);
});
close.addEventListener("click", () => {
	handleNavigationBar(true);
});
navOverlay.addEventListener("click", () => {
	handleNavigationBar(true);
});
// Adding A New List
addListBtn.addEventListener("click", () => {
	addList();
	handleNavigationBar(true);
});
// Delete List Button Event
deleteListBtn.addEventListener("click", () => {
	if (!contextListItem) return;
	deleteListOverlay.classList.add("pop");
	deleteListTitle.innerHTML = `"${contextListItem.textContent}" will be permenantly deleted`;
	undisplayingListMenuOverlay();
});
deleteListOverlay.addEventListener("click", () => {
	deleteListOverlay.classList.remove("pop");
});
deleteListCancelBtn.addEventListener("click", () => {
	deleteListOverlay.classList.remove("pop");
});
deleteListConfirmBtn.addEventListener("click", () => {
	lists = lists.filter((list) => {
		return (
			Number(contextListItem.getAttribute("data-id")) !=
			Number(list.settings.id)
		);
	});
	if (
		Number(currentPageId) ===
		Number(contextListItem.getAttribute("data-id"))
	) {
		if (contextListItem.previousSibling !== null) {
			currentPageId =
				contextListItem.previousSibling.getAttribute("data-id");
			savePageId(currentPageId);
		}
		if (contextListItem.previousSibling === null) {
			if (contextListItem.nextSibling !== null) {
				currentPageId =
					contextListItem.nextSibling.getAttribute("data-id");
				savePageId(currentPageId);
			} else {
				currentPageId = 4;
				savePageId(currentPageId);
			}
		}
	}
	displayData();
	saveLists(lists);
	deleteListOverlay.classList.remove("pop");
});
// Unpinning Or Pinning List
pinListOptionBtn.addEventListener("click", () => {
	if (!contextListItem) return;
	togglePinnedState();
});
// Renaming List Events
renameListOptionBtn.addEventListener("click", () => {
	if (!contextListItem) return;
	renameList();
});
renameInputField.addEventListener("input", (e) => {
	lists.forEach((list) => {
		if (Number(currentPageId) === Number(list.settings.id)) {
			list.settings.title = renameInputField.value.trim();
		}
	});
	saveLists(lists);
	displayData();
});
renameInputField.addEventListener("keydown", (e) => {
	if (e.key === "Enter") renameInputField.blur();
});
renameInputField.addEventListener("focus", () => {
	renameInputField.value = pageTitle.innerHTML;
});
renameInputField.addEventListener("blur", () => {
	renameInputField.style.display = "none";
	pageTitle.style.display = "block";
});

// =========
// Functions
// =========

function handleNavigationBar(close) {
	if (close) {
		nav.classList.remove("opened");
		navOverlay.classList.add("display");
		undisplayingListMenuOverlay();
	} else {
		nav.classList.add("opened");
		navOverlay.classList.add("active");
		navOverlay.classList.remove("display");
	}
}
function togglePinnedState() {
	contextListItem.classList.toggle("pinned");
	undisplayingListMenuOverlay();
	lists.forEach((list) => {
		if (
			Number(contextListItem.getAttribute("data-id")) ===
			Number(list.settings.id)
		) {
			if (list.settings.pinned) {
				list.settings.pinned = false;
			} else {
				list.settings.pinned = true;
			}
		}
	});
	saveLists(lists);
	displayData();
}
function renameList() {
	renameInputField.classList.add("active");
	renameInputField.style.display = "block";
	pageTitle.style.display = "none";
	nav.classList.remove("opened");
	renameInputField.focus();
	renameInputField.select();
	undisplayingListMenuOverlay();
}
function undisplayingListMenuOverlay() {
	listOverlay.classList.remove("active");
	listOptions.classList.remove("active");
}
function buildListUI(list, isCurrent) {
	// Creating Elements
	const listItem = document.createElement("li");
	const iconContainer = document.createElement("div");
	const pinIcon = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"svg"
	);
	const pinIconPath = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"path"
	);
	const listTitle = document.createElement("div");
	pinIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	pinIcon.setAttribute("height", "20px");
	pinIcon.setAttribute("width", "20px");
	pinIcon.setAttribute("fill", "var(--font)");
	pinIcon.setAttribute("viewBox", "0 -960 960 960");
	if (Number(list.settings.id) === LIST_IDS.COMPLETED) {
		generateListIcons(true, iconContainer, LIST_IDS.COMPLETED);
	} else if (Number(list.settings.id) === LIST_IDS.MY_DAY) {
		generateListIcons(true, iconContainer, LIST_IDS.MY_DAY);
	} else if (Number(list.settings.id) === LIST_IDS.ALL_TASKS) {
		generateListIcons(false, iconContainer, LIST_IDS.ALL_TASKS);
	} else if (Number(list.settings.id) === LIST_IDS.IMPORTANT) {
		generateListIcons(false, iconContainer, LIST_IDS.IMPORTANT);
	} else {
		generateListIcons(true, iconContainer);
	}
	pinIconPath.setAttribute(
		"d",
		"m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z"
	);
	listItem.setAttribute("data-id", list.settings.id || "default-id");
	listItem.classList.add("list-item");
	listTitle.classList.add("text");
	pinIcon.style.display = "none";
	pinIcon.style.marginLeft = "auto";
	listTitle.textContent = list.settings.title || "Untitled";
	if (list.settings.pinned) {
		listItem.classList.add("pinned");
		pinIcon.style.display = "block";
	}
	// Appending
	pinIcon.appendChild(pinIconPath);
	listItem.append(iconContainer, listTitle, pinIcon);
	if (isCurrent) {
		listItem.classList.add("active");
	}
	listItem.addEventListener("click", () => {
		handleNavigationBar(true);
		currentPageId = listItem.getAttribute("data-id");
		savePageId(currentPageId);
		displayData();
	});
	if (!list.settings.isMain) {
		listItem.addEventListener("contextmenu", (e) => {
			e.preventDefault();
			listOptions.style.top = `${e.pageY}px`;
			listOptions.classList.add("active");
			listOverlay.classList.add("active");
			contextListItem = listItem;
			listOverlay.addEventListener("click", () => {
				undisplayingListMenuOverlay();
			});
			listOverlay.addEventListener("contextmenu", () => {
				undisplayingListMenuOverlay();
			});
			if (contextListItem.classList.contains("pinned")) {
				pinOrunpin.textContent = "Unpin list";
				PinIcon.style.display = "none";
				unPinIcon.style.display = "block";
			} else {
				pinOrunpin.textContent = "Pin list";
				PinIcon.style.display = "block";
				unPinIcon.style.display = "none";
			}
		});
	}
	return listItem;
}
function displayData() {
	listsContainer.innerHTML = "";
	mainListContainer.innerHTML = "";
	for (let i = 0; i < lists.length; i++) {
		const list = lists[i];
		const isCurrentPage =
			Number(list.settings.id) === Number(currentPageId);
		if (isCurrentPage) {
			pageTitle.textContent = list.settings.title || "Untitled";
		}
		if (list.settings.isMain) {
			mainListContainer.appendChild(buildListUI(list, isCurrentPage));
		} else {
			listsContainer.appendChild(buildListUI(list, isCurrentPage));
		}
	}
	if (
		Number(currentPageId) != LIST_IDS.MY_DAY &&
		Number(currentPageId) != LIST_IDS.IMPORTANT &&
		Number(currentPageId) != LIST_IDS.ALL_TASKS &&
		Number(currentPageId) != LIST_IDS.COMPLETED
	) {
		pageTitle.addEventListener("click", renameList);
	} else {
		pageTitle.removeEventListener("click", renameList);
	}
}
function initialLists() {
	if (lists.length === 0) {
		let dayTasksList = {
			settings: {
				id: 1,
				theme: "blue",
				title: `My Day`,
				pinned: null,
				isMain: true,
			},
			tasks: [],
		};
		let importantList = {
			settings: {
				id: 2,
				theme: "blue",
				title: `Important Tasks`,
				pinned: null,
				isMain: true,
			},
			tasks: [],
		};
		let completedLists = {
			settings: {
				id: 3,
				theme: "blue",
				title: `Completed Tasks`,
				pinned: null,
				isMain: true,
			},
			tasks: [],
		};
		let allTasksList = {
			settings: {
				id: 4,
				theme: "blue",
				title: `All Tasks`,
				pinned: null,
				isMain: true,
			},
			tasks: [],
		};
		lists.push(dayTasksList, importantList, completedLists, allTasksList);
		saveLists(lists, []);
	}
}
function generateListIcons(svg, iconContainer, id) {
	let icon;
	iconContainer.classList.add("icon");
	if (svg) {
		icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		const iconPath = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"path"
		);
		icon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		icon.setAttribute("height", "20px");
		icon.setAttribute("width", "20px");
		icon.setAttribute("fill", "var(--font)");
		icon.setAttribute("viewBox", "0 -960 960 960");
		if (id === LIST_IDS.MY_DAY) {
			iconPath.setAttribute(
				"d",
				"M440-800v-120h80v120h-80Zm0 760v-120h80v120h-80Zm360-400v-80h120v80H800Zm-760 0v-80h120v80H40Zm708-252-56-56 70-72 58 58-72 70ZM198-140l-58-58 72-70 56 56-70 72Zm564 0-70-72 56-56 72 70-58 58ZM212-692l-72-70 58-58 70 72-56 56Zm268 452q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q67 0 113.5-46.5T640-480q0-67-46.5-113.5T480-640q-67 0-113.5 46.5T320-480q0 67 46.5 113.5T480-320Zm0-160Z"
			);
		} else if (id === LIST_IDS.COMPLETED) {
			iconPath.setAttribute(
				"d",
				"m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
			);
		} else {
			iconPath.setAttribute(
				"d",
				"M144-264v-72h672v72H144Zm0-180v-72h672v72H144Zm0-180v-72h672v72H144Z"
			);
		}
		icon.appendChild(iconPath);
	} else {
		icon = document.createElement("i");
		if (id === LIST_IDS.IMPORTANT) {
			icon.classList.add("bx", "bx-infinite");
		} else if (id === LIST_IDS.ALL_TASKS) {
			icon.classList.add("bx", "bx-star");
		}
	}
	iconContainer.appendChild(icon);
}
function addList() {
	const list = {
		settings: {
			id: Date.now(),
			theme: "blue",
			title: `Untitled List (${listCounter})`,
			pinned: false,
			isMain: false,
		},
		tasks: [],
	};
	lists.push(list);
	currentPageId = list.settings.id;
	listCounter++;
	storage.set("listCounter", listCounter);
	savePageId(currentPageId);
	saveLists(lists);
	displayData();
}
// Initial Render
initialLists();
displayData();
