export const CALL_STATUS_REQUESTED = 'requested';
export const CALL_STATUS_FAILED_HYPIXEL = 'failed-hypixel';
export const CALL_STATUS_FAILED_MOJANG = 'failed-mojang';
export const CALL_STATUS_RECEIVED = 'received';

/*
* Returns 1 if the number is zero
*
* @param {number} number
* @return {number} 1 if number is 0, otherwise the number itself
*/
export function set1If0(number) {
	if (number === 0) {
		return 1;
	}
	return number;
}

/*
* Returns 0 if the value passed is falsy
*
* @param {any} val
* @return {any} 0 if val is falsy, otherwise val itself
*/
export function default0(val) {
	if (!val || val === undefined || isNaN(val)) return 0;
	return val;
}

/*
* Traverses down an object path safely
*
* @param {Object} json The Object to traverse
* @param {string} path The path to follow (period-separated)
* @return {any} Returns the value at the path, or an 
*	empty Object if the path does not exist at any point
*/
export function traverse(json, path) {
	const paths = path.split('.');
	for (const p of paths) {
		json = json[p];
		if (json === undefined) return {};
	}
	return json;
}

/*
* Returns time since a date integer
*
* @param {number} date Date integer
* @return {string} Time since the date
*/
export function timeSince(date) {

	var seconds = Math.floor((new Date() - date) / 1000);

	var interval = seconds / 31536000;

	if (interval > 1) {
		return `${Math.floor(interval)} year${Math.floor(interval) === 1 ? '' : 's'}`;
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return `${Math.floor(interval)} month${Math.floor(interval) === 1 ? '' : 's'}`;
	}
	interval = seconds / 86400;
	if (interval > 1) {
		return `${Math.floor(interval)} day${Math.floor(interval) === 1 ? '' : 's'}`;
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return `${Math.floor(interval)} hour${Math.floor(interval) === 1 ? '' : 's'}`;
	}
	interval = seconds / 60;
	if (interval > 1) {
		return `${Math.floor(interval)} minute${Math.floor(interval) === 1 ? '' : 's'}`;
	}
	return `${Math.floor(seconds)} second${Math.floor(interval) === 1 ? '' : 's'}`;
}
