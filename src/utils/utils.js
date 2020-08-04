export const CALL_STATUS_REQUESTED = 'requested';
export const CALL_STATUS_FAILED = 'failed';
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