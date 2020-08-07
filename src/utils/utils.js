import Cookies from 'js-cookie';

const decimal = Cookies.get('decimal') || 2;
export const CALL_STATUS_REQUESTED = 'requested';
export const CALL_STATUS_FAILED_HYPIXEL = 'failed-hypixel';
export const CALL_STATUS_FAILED_MOJANG = 'failed-mojang';
export const CALL_STATUS_RECEIVED_NULL = 'receivednull';
export const CALL_STATUS_RECEIVED_SUCCESS = 'receivedsuccess';

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
* Calculates a ratio safely
*
* @param {number} num The numerator of the ratio
* @param {number} denom The denominator of the ratio
* @return {number} The calculated ratio
*/
export function ratio(num, denom) {
	return default0(num)/set1If0(default0(denom));
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
		if (json === undefined) return undefined;
	}
	return json;
}

/*
* Adds commas to a large number and strips decimal places to user preference
*
* @param {number} num The number to format
* @return {string} The comma-separated, decimal-stripped number
*/
export function formatNum(num) {
	num = default0(num);
	return num.toLocaleString('en', {   
			minimumFractionDigits: 0,
			maximumFractionDigits: decimal,
		});
}

/*
* Capitalizes the first character in a string and makes all following characters lowercase
*
* @param {string} str The string to format
* @return {string} The properly capitalized string
*/
export function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/*
* Returns time since a date integer
*
* @param {number} date Date integer
* @return {string} Time since the date
*/
export function timeSince(date) {

	var seconds = Math.floor((new Date() - date) / 1000);

	if (seconds < 0) {
		return '0 seconds';
	}

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
	return `${Math.floor(seconds)} second${Math.floor(seconds) === 1 ? '' : 's'}`;
}
