export const storage = {
	set: (itemName, itemToSet) => {
		window.localStorage.setItem(itemName, JSON.stringify(itemToSet));
	},
	get: (itemToGet, alternateItem) => {
		return (
			JSON.parse(window.localStorage.getItem(itemToGet)) || alternateItem
		);
	},
	clear: () => {
		window.localStorage.clear();
	},
	remove: (itemToRemove) => {
		window.localStorage.removeItem(itemToRemove);
	},
};

export function saveLists(lists) {
	storage.set("totalLists", lists);
}
export function savePageId(pageId) {
	storage.set("currentPageId", pageId);
}
