 const RAINBOW_COLORS = ['c', '6', 'e', 'a', 'b', 'd', '9'];
 
 /**
  * Creates a rainbow-colored Minecraft text string
  * @param {string} text - The text to colorize
  * @returns {string} - Minecraft formatted string with rainbow colors
  */
 export function rainbow(text) {
 	return [...text].map((char, i) => `§${RAINBOW_COLORS[i % RAINBOW_COLORS.length]}${char}`).join('');
 }
 
 /**
  * Finds the current prefix tier based on score
  * @param {Array} prefixes - Array of prefix objects with { req, color } or { req, fmt }
  * @param {number} score - The player's score
  * @returns {Object} - The matching prefix object
  */
 export function findPrefix(prefixes, score) {
 	score = score || 0;
 	for (let i = prefixes.length - 1; i >= 0; i--) {
 		if (score >= prefixes[i].req) {
 			return { prefix: prefixes[i], index: i };
 		}
 	}
 	return { prefix: prefixes[0], index: 0 };
 }
 
 /**
  * Gets the next prefix tier
  * @param {Array} prefixes - Array of prefix objects
  * @param {number} score - The player's score
  * @returns {Object|null} - The next prefix object or null if at max
  */
 export function findNextPrefix(prefixes, score) {
 	const { index } = findPrefix(prefixes, score);
 	if (index >= prefixes.length - 1) {
 		return null;
 	}
 	return prefixes[index + 1];
 }
 
 /**
  * Formats a prefix with the score value
  * @param {Object} prefix - The prefix object
  * @param {number} score - The score to display
  * @param {Object} options - Formatting options
  * @returns {string} - Minecraft formatted prefix string
  */
 export function formatPrefix(prefix, score, options = {}) {
 	const { abbreviation = true, emblem = '' } = options;
 	const displayScore = abbreviation ? abbreviateNumber(score) : score;
 	
 	if (prefix.fmt) {
 		return prefix.fmt(displayScore);
 	}
 	
 	// Default format: [score] with color
 	const colorCode = colorToCode(prefix.color);
 	return `${colorCode}[${displayScore}${emblem}]`;
 }
 
 /**
  * Calculates progression to next prefix tier
  * @param {Array} prefixes - Array of prefix objects
  * @param {number} score - The player's score
  * @returns {Object} - { current, next, progress, progressProportion }
  */
 export function calculatePrefixProgression(prefixes, score) {
 	score = score || 0;
 	const { prefix: current, index } = findPrefix(prefixes, score);
 	const next = index < prefixes.length - 1 ? prefixes[index + 1] : null;
 	
 	if (!next) {
 		return {
 			current: current.req,
 			next: current.req,
 			progress: score - current.req,
 			progressProportion: 1,
 			isMaxed: true
 		};
 	}
 	
 	const progress = score - current.req;
 	const total = next.req - current.req;
 	
 	return {
 		current: current.req,
 		next: next.req,
 		progress,
 		total,
 		progressProportion: progress / total,
 		isMaxed: false
 	};
 }
 
 /**
  * Abbreviates a number (e.g., 1000 -> 1k, 1000000 -> 1M)
  * @param {number} num - The number to abbreviate
  * @returns {string} - Abbreviated string
  */
 export function abbreviateNumber(num) {
 	if (num === undefined || num === null) return '0';
 	if (num >= 1000000) {
 		return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + 'M';
 	}
 	if (num >= 1000) {
 		return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'k';
 	}
 	return String(num);
 }
 
 /**
  * Converts a color name to Minecraft color code
  * @param {string} color - Color name
  * @returns {string} - Minecraft color code
  */
 export function colorToCode(color) {
 	const colorMap = {
 		black: '§0',
 		darkblue: '§1',
 		darkgreen: '§2',
 		darkaqua: '§3',
 		darkred: '§4',
 		purple: '§5',
 		gold: '§6',
 		gray: '§7',
 		darkgray: '§8',
 		blue: '§9',
 		green: '§a',
 		aqua: '§b',
 		red: '§c',
 		pink: '§d',
 		yellow: '§e',
 		white: '§f',
 	};
 	return colorMap[color] || '§7';
 }
