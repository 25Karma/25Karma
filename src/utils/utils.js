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
* @param {number} number 	The number to check
* @return {number} 			1 if number is 0, otherwise the number itself
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
* @param {any} val 	The value to check
* @return {any} 	0 if val is falsy, otherwise val itself
*/
export function default0(val) {
	if (!val || val === undefined || isNaN(val)) return 0;
	return val;
}

/*
* Safely adds numbers that could be undefined
*
* @param {number} arguments A dynamic amount of parameters to add
* @return {number} 			The sum of the parameters
*/
export function add() {
	return Array.from(arguments).reduce((a, b) => default0(a) + default0(b), 0);
}

/*
* Calculates a ratio safely
*
* @param {number} num 	The numerator of the ratio
* @param {number} denom The denominator of the ratio
* @return {number} 		The calculated ratio
*/
export function ratio(num, denom) {
	return default0(num)/set1If0(default0(denom));
}

/*
* Traverses down an object path safely
*
* @param {Object} json 	The Object to traverse
* @param {string} path 	The path to follow (period-separated)
* @return {any} 		Returns the value at the path, or an 
*						empty Object if the path does not exist at any point
*/
export function traverse(json, path, defaultValue) {
	const paths = path.split('.');
	for (const p of paths) {
		if (json === undefined) return (defaultValue || undefined);
		json = json[p];
	}
	if (json === undefined) return (defaultValue || undefined);
	return json;
}

/*
* Adds commas to a large number and strips decimal places to user preference
*
* @param {number} num 	The number to format
* @return {string} 		The comma-separated, decimal-stripped number
*/
export function formatNum(num) {
	num = default0(num);
	return num.toLocaleString('en', {   
			minimumFractionDigits: 0,
			maximumFractionDigits: decimal,
		});
}

/*
* Converts number to its roman numeral form (https://stackoverflow.com/a/9083076)
*
* @param {number} num 	The number to convert
* @return {string} 		The number in roman numeral form
*/
export function romanize(num) {
	if (isNaN(num)) return NaN;

	var digits = String(+num).split(""),
	key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
		"","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
		"","I","II","III","IV","V","VI","VII","VIII","IX"],
	roman = "",
	i = 3;
	while (i--) {
		roman = (key[+digits.pop() + (i * 10)] || "") + roman;
	}
	return Array(+digits.join("") + 1).join("M") + roman;
}

/*
* Capitalizes the first character in a string and makes all following characters lowercase
*
* @param {string} str 	The string to format
* @return {string} 		The properly capitalized string
*/
export function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/*
* Checks if an Object is empty
*
* @param {Object} obj 	The object to check
* @return {boolean} 	Whether or not it is empty
*/
export function isEmpty(obj) {
	return Object.keys(obj).length === 0 && obj.constructor === Object
}

/*
* Returns time since a date integer
*
* @param {number} date 	Date integer
* @return {string} 		Time since the date
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

/*
* Converts a color string into its corresponding Minecraft color code
*
* @param {string} str 	Name of the color
* @return {char} 		Color code character, if not found defaults to white
*/
export function toColorCode(str) {
	const colorClasses = {
		'black' : '0',
		'darkblue' : '1',
		'darkgreen' : '2',
		'darkaqua' : '3',
		'darkred' : '4',
		'purple' : '5',
		'gold' : '6',
		'gray' : '7',
		'darkgray' : '8',
		'blue' : '9',
		'green' : 'a',
		'aqua' : 'b',
		'red' : 'c',
		'pink' : 'd',
		'yellow' : 'e',
		'white' : 'f',
		'brown' : 'g',
		'rainbow' : 'R',
		'rainbow font-bold' : 'K',
	}
	return '§' + (colorClasses[str] || 'f');
}
