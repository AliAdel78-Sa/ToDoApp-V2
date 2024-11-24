/**
 * Alias Function for Selecting DOM Elements
 * @param {string} selector The CSS Selector of an html element
 * @returns An Element From The Html By The Selector
 */
const $ = function (selector) {
	try {
		const element = document.querySelector(selector);
		if (!element) {
			console.warn(
				`Warning: Element not found for selector "${selector}".`
			);
		} else {
			return element;
		}
	} catch (e) {
		console.log(`Couldn't Get "${selector}"`);
	}
};

export const addListBtn = $("#listBtn");
export const listsContainer = $("#listsContainer");
export const pageTitle = $("#pageTitle");
export const mainListContainer = $("#mainLists");
export const listOptions = $(".list-options-menu");
export const deleteListBtn = $("#deleteListBtn");
export const pinListOptionBtn = $("#pinListOption");
export const renameListOptionBtn = $("#renameListOption");
export const renameInputField = $("#renameInputField");
export const deleteListTitle = $("#delete-list-title");
export const deleteListConfirmBtn = $("#delete-list");
export const deleteListCancelBtn = $("#cancel-list-btn");
export const preloader = $("#preloader");
export const menuBar = $("#menu");
export const nav = $("nav");
export const close = $("#close");
export const listOverlay = $("#listOverlay");
export const deleteListOverlay = $("#delete-list-overlay");
export const navOverlay = $(".nav-overlay");
export const pinOrunpin = $("#pin-unpin");
export const PinIcon = $("#keep");
export const unPinIcon = $("#keepOff");
