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
 * Finds the index of the prefix tier based on score
 * @param {Array} prefixes - Array of prefix objects with { req, color } or { req, fmt }
 * @param {number} score - The player's score
 * @returns {number} - The index of the matching prefix
 */
export function findPrefixIndex(prefixes, score) {
	score = score || 0;
	for (let i = prefixes.length - 1; i >= 0; i--) {
		if (score >= prefixes[i].req) {
			return i;
		}
	}
	return 0;
}

/**
 * Finds the current prefix tier based on score
 * @param {Array} prefixes - Array of prefix objects with { req, color } or { req, fmt }
 * @param {number} score - The player's score
 * @returns {Object} - The matching prefix object
 */
export function findPrefix(prefixes, score) {
	const index = findPrefixIndex(prefixes, score);
	return { prefix: prefixes[index], index };
}
 
 /**
  * Gets the next prefix tier
  * @param {Array} prefixes - Array of prefix objects
  * @param {number} score - The player's score
  * @returns {Object|null} - The next prefix object or null if at max
  */
 export function findNextPrefix(prefixes, score) {
	 const i = findPrefixIndex(prefixes, score);
	 return i >= prefixes.length - 1 ? null : prefixes[i + 1];
 }
 
/**
 * Default prefix format function - creates [score] with color and optional emblem
 * @param {string} score - The score string to display
 * @param {Object} prefix - The prefix object
 * @param {string} emblem - Optional emblem to append
 * @returns {string} - Minecraft formatted prefix string
 */
export function defaultPrefixFormat(score, prefix, emblem = '') {
	if (prefix.color === 'rainbow') {
		return rainbow(`[${score}${emblem}]`);
	}
	const colorCode = colorToCode(prefix.color);
	const boldCode = prefix.bold ? '§l' : '';
	return `${colorCode}${boldCode}[${score}${emblem}]`;
}

/**
 * Gets formatted prefix string with proper abbreviation and flooring logic
 * @param {Object} options - Formatting options
 * @param {Array} options.prefixes - Array of prefix objects
 * @param {number} options.score - The player's score
 * @param {boolean} options.skip - Whether to skip to next prefix tier (default: false)
 * @param {boolean} options.trueScore - Whether to use actual score instead of prefix requirement (default: false)
 * @param {boolean} options.abbreviation - Whether to abbreviate numbers (default: true)
 * @param {string} options.emblem - Optional emblem to append (default: '')
 * @returns {string} - Minecraft formatted prefix string
 */
export function formatPrefix({ prefixes, score, skip = false, trueScore = false, abbreviation = true, emblem = '' }) {
	score = score ?? 0;

	let index = findPrefixIndex(prefixes, score);
	if (skip) index = Math.min(index + 1, prefixes.length - 1);

	const prefix = prefixes[index];

	if (prefix.title && prefix.fmt) return prefix.fmt(prefix.title);

	const render = (value) =>
		prefix.fmt ? prefix.fmt(value) : defaultPrefixFormat(value, prefix, emblem);

	if (!abbreviation) {
		const value = String(trueScore ? Math.floor(score) : prefix.req);
		return render(value);
	}

	const [minNum, minSuffix] = abbreviateNumber(prefix.req);

	if (!trueScore) {
		return render(`${minNum}${minSuffix}`);
	}

	let [num, suffix] = abbreviateNumber(score);
	num = Math.floor(num);

	if (num < minNum) {
		num = minNum;
		suffix = minSuffix;
	}

	return render(`${num}${suffix}`);
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
 * Abbreviates a number (e.g., 1000 -> [1, "K"], 1000000 -> [1, "M"])
 * @param {number} num - The number to abbreviate
 * @returns {[number, string]} - Tuple of [abbreviated number, suffix]
 */
export function abbreviateNumber(num) {
	if (num === undefined || num === null) return [0, ''];
	const abbreviation = ['', 'K', 'M', 'B', 'T'];
	const base = Math.floor(num === 0 ? 0 : Math.log(num) / Math.log(1000));
	return [+(num / Math.pow(1000, base)).toFixed(2), abbreviation[base]];
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
