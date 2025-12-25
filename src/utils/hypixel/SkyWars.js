import { fromColorCode } from 'src/utils';
import {
	EMBLEMS,
	PRESTIGE_EMBLEMS,
	PRESTIGE_SCHEMES,
	SCHEMES,
	BOLD_LEVEL_REQUIREMENT,
	UNDERLINE_LEVEL_REQUIREMENT,
	STRIKETHROUGH_LEVEL_REQUIREMENT,
} from 'src/constants/hypixel/SkyWars';

export function parseKey(str, prefix) {
	if (!str) return null;
	return str.replace('_icon', '').replace(prefix, '');
}

export function findByLevel(arr, targetLevel) {
	for (let i = arr.length - 1; i >= 0; i--) {
		if (arr[i].level <= targetLevel) return arr[i];
	}
	return arr[0];
}

export function getEmblem(activeEmblem, level) {
	const key = parseKey(activeEmblem, 'emblem_');
	if (key && EMBLEMS[key]) {
		return EMBLEMS[key];
	}
	const defaultEntry = findByLevel(PRESTIGE_EMBLEMS, Math.floor(level));
	return EMBLEMS[defaultEntry.emblem];
}

export function getPrestige(activeScheme, level) {
	const key = parseKey(activeScheme, 'scheme_');
	if (key) {
		const prestige = PRESTIGE_SCHEMES.find(function (p) { return p.id === key; });
		if (prestige) return prestige;
	}
	return findByLevel(PRESTIGE_SCHEMES, Math.floor(level));
}

export function resolveSchemeId(activeScheme, floorLevel) {
	const key = parseKey(activeScheme, 'scheme_');
	if (key && SCHEMES[key]) return key;
	return findByLevel(PRESTIGE_SCHEMES, floorLevel).id;
}

export function getSchemeColors(schemeId) {
	const scheme = SCHEMES[schemeId];
	if (!scheme) return null;

	const sample = scheme(100, false, false, false, 'E');
	const matches = sample.match(/§[0-9a-f]/g) || [];
	const toCSS = function (code) {
		return fromColorCode(code?.charAt(1)) || 'gray';
	};

	const fallback = matches[1] || matches[0] || '§7';
	const digits = matches.slice(1, 4);
	const uniqueDigits = [...new Set(digits.length ? digits : [fallback])];
	const emblemMatch = sample.match(/(§[0-9a-f])E/);
	const emblem = emblemMatch ? emblemMatch[1] : fallback;

	const digitList = digits.length ? digits : [fallback];

	return {
		bracket: matches[0] || fallback,
		digits: digitList,
		uniqueDigits,
		emblem,
		cssBracket: toCSS(matches[0] || fallback),
		cssDigits: digitList.map(toCSS),
		cssUniqueDigits: [...new Set(digitList.map(toCSS))],
		cssEmblem: toCSS(emblem),
	};
}

export function getFormattedLevel(level, activeScheme, activeEmblem, levelFormattedWithBrackets, options) {
	const opts = options || {};
	const floorLevel = Math.floor(level);
	const schemeId = resolveSchemeId(activeScheme, floorLevel);
	const scheme = SCHEMES[schemeId];
	if (!scheme) {
		return `§7${floorLevel}`;
	}

	const emblemKey = parseKey(activeEmblem, 'emblem_');
	const emblem = (emblemKey && EMBLEMS[emblemKey])
		? EMBLEMS[emblemKey]
		: getEmblem(null, floorLevel);

	const useNaturalFormatting = Boolean(opts.useNaturalFormatting || opts.naturalFormatting);
	const source = levelFormattedWithBrackets || '';

	const isBold = useNaturalFormatting
		? floorLevel >= BOLD_LEVEL_REQUIREMENT
		: source.includes('§l');
	const isUnderline = useNaturalFormatting
		? floorLevel >= UNDERLINE_LEVEL_REQUIREMENT
		: source.includes('§n');
	const isStrikethrough = useNaturalFormatting
		? floorLevel >= STRIKETHROUGH_LEVEL_REQUIREMENT
		: source.includes('§m');

	return scheme(floorLevel, isBold, isUnderline, isStrikethrough, emblem);
}

export function getNaturalFormattedLevel(level) {
	return getFormattedLevel(level, null, null, null, { useNaturalFormatting: true });
}

export function getLevelNumberFormatted(level) {
	const floorLevel = Math.floor(level);
	const schemeId = resolveSchemeId(null, floorLevel);
	const colors = getSchemeColors(schemeId);
	if (!colors) return `§7${floorLevel}`;

	const digitColors = colors.digits;
	const uniqueColors = colors.uniqueDigits;

	if (uniqueColors.length > 1) {
		const levelStr = String(floorLevel);
		const digits = levelStr.split('').reverse();
		const formattedDigits = digits.map(function (digit, index) {
			const colorIndex = Math.min(digitColors.length - 1, index);
			return digitColors[digitColors.length - 1 - colorIndex] + digit;
		}).reverse().join('');
		return formattedDigits + '§r';
	}

	const digitColor = digitColors[0] || colors.bracket || '§7';
	return digitColor + floorLevel + '§r';
}

export function getSchemeGradientColors(schemeId) {
	const colors = getSchemeColors(schemeId);
	if (!colors) return ['gray', 'gray'];

	if (colors.cssUniqueDigits.length > 1) {
		return colors.cssUniqueDigits;
	}

	const primaryColor = colors.cssDigits[0] || colors.cssBracket || 'gray';
	return [primaryColor, primaryColor];
}

export function getFormattedPrestigeName(level) {
	const floorLevel = Math.floor(level);
	const prestigeEntry = findByLevel(PRESTIGE_SCHEMES, floorLevel);
	const schemeId = prestigeEntry.id;
	const name = prestigeEntry.name;

	const colors = getSchemeColors(schemeId);
	if (!colors) {
		return '§7' + name;
	}

	if (colors.uniqueDigits.length > 1) {
		const chars = name.split('');
		const result = chars.map(function (char, i) {
			const colorIndex = Math.floor((i / chars.length) * colors.uniqueDigits.length);
			return colors.uniqueDigits[Math.min(colorIndex, colors.uniqueDigits.length - 1)] + char;
		}).join('');
		return result + '§r';
	}

	const primaryColor = colors.bracket || colors.digits[0] || '§7';
	return primaryColor + name + '§r';
}

export function getFormattedEmblem(activeEmblem, level) {
	const floorLevel = Math.floor(level);
	const emblemSymbol = getEmblem(activeEmblem, floorLevel);
	const prestigeEntry = findByLevel(PRESTIGE_SCHEMES, floorLevel);
	const schemeId = prestigeEntry.id;
	const colors = getSchemeColors(schemeId);
	const emblemColor = colors?.emblem || '§7';

	return emblemColor + emblemSymbol + '§r';
}
