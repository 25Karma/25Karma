import npmDateFormat from 'dateformat';

/**
 * Converts a date integer into a formatted string
 *
 * @param {number} num    Date integer
 * @returns {string}      The formatted string
 */
export function dateFormat(num) {
	return npmDateFormat(new Date(num), 'yyyy-mm-dd, h:MM TT Z');
}