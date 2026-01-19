import * as Utils from 'src/utils';
import { HYPIXEL } from 'src/constants/hypixel';
import { DateTime } from 'luxon';

export * from './HypixelLeveling';
export * from './SkyWars';

export * from './prefixes';
/**
 * Converts network experience into network level
 *
 * @param {number} exp    The player's network experience
 * @returns {number}      Equivalent network level
 */
export function calculateNetworkLevel(exp = 0) {
	return ((Math.sqrt(exp + 15312.5) - 125/Math.sqrt(2))/(25*Math.sqrt(2)))
}	

/**
 * Returns the player's overall achievement information about a single gamemode
 *
 * @param {string} gameId              ID of the gamemode (i.e. the desired key in achievementsJson)
 * @param {Object} achievementsJson    All achievements data from the Hypixel API 'resources/achievements' endpoint
 * @param {Object} playerJson          Player data from the Hypixel API 'player' endpoint
 * @returns {Object}                   Assorted data about the gamemode pertaining to achievements
 */
export function gamemodeAchievements(gameId, achievementsJson, playerJson) {
	const { one_time, tiered, total_points, total_legacy_points } = achievementsJson[gameId];
	const player_one_time = playerJson.achievementsOneTime || [];
	const player_tiered = playerJson.achievements || {};
	let total = 0, unlocked = 0, legacy_total = 0, legacy_unlocked = 0, points = 0, legacy_points = 0;

	// One-time achievements
	for (const [name, data] of Object.entries(one_time)) {
		if (data.legacy) legacy_total++;
		else total++;
		
		if (player_one_time.includes(`${gameId}_${name.toLowerCase()}`)) {
			if (data.legacy) {
				legacy_unlocked++;
				legacy_points += data.points;
			}
			else {
				unlocked++;
				points += data.points;
			}
		}
	}

	// Tiered achievements
	for (const [name, data] of Object.entries(tiered)) {
		if (data.legacy) legacy_total += data.tiers.length;
		else total += data.tiers.length;

		// Find the player's highest achieved tier so far 
		const player_amount = player_tiered[`${gameId}_${name.toLowerCase()}`];
		for (const tier of data.tiers.slice().reverse()) {
			if (player_amount >= tier.amount) {
				if (data.legacy) {
					legacy_unlocked += 1;
					legacy_points += tier.points;
				}
				else {
					unlocked += 1;
					points += tier.points;
				}
			}
		}
	}

	return {
		unlocked, total,
		legacy_unlocked, legacy_total, 
		points, total_points,
		legacy_points, total_legacy_points
	};
}

/**
 * Returns the guild rank of a member
 *
 * @param {Object} member          Data of the member from the `members` array of the API
 * @param {Array<Object>} ranks    `ranks` Object from the API
 * @returns {Object}               Rank (name and priority) that corresponds to the member
 */
export function getGuildMemberRank(member, ranks) {
	if (ranks === undefined) {
		ranks = [];
	}
	if (member.rank === 'Guild Master' || member.rank === 'GUILDMASTER') {
		return {name: 'Guild Master', tag: 'GM', priority: 1000};
	}
	for (const rank of ranks) {
		if (member.rank.toLowerCase() === rank.name.toLowerCase()) {
			return rank;
		}
	}
	return {name: Utils.capitalize(member.rank), priority: 999};
}

/**
 * Returns the daily GEXP earned by a member of a guild
 *
 * @param {Object} member    Data of the member from the `members` array of the API
 * @returns {number}         The daily GEXP of the member
 */
export function getGuildMemberDailyGEXP(member) {
	return member.expHistory[Object.keys(member.expHistory).reduce((a, b) =>
		new Date(a) > new Date(b) ? a : b)];
}

/**
 * Returns the weekly GEXP earned by a member of a guild
 *
 * @param {Object} member    Data of the member from the `members` array of the API
 * @returns {number}         The weekly GEXP of the member
 */
export function getGuildMemberWeeklyGEXP(member) {
	if (member.expHistory) {
		return Object.values(member.expHistory).reduce((a,b) => a+b);
	}
	else {
		return 0;
	}
}

/**
 * Returns the most played gamemode out of a list of gamemodes
 *
 * @param {Array<Object>} jsonarray    Array of gamemode data
 * @param {Function} totalplays        Function to compute the total plays of a given gamemode from the array
 * @returns {Object}                   Most played gamemode, or empty Object
 */
export function getMostPlayed(jsonarray, totalplays) {
	let mostPlayed = {};
	let mostPlays = 0;
	for (const mode of jsonarray) {
		const plays = totalplays(mode);
		// The mode.id part is so that the 'Overall' category is ignored
		if (plays > mostPlays && mode.id) {
			mostPlays = plays;
			mostPlayed = mode;
		}
	}
	return mostPlayed;
}

/**
 * Returns the rank of a player based on the `player` JSON
 *
 * @param {Object} playerdata    The `player` JSON from the API
 * @returns {string}             The ID of the rank - anything from NONE to MVP_PLUS to ADMIN
 */
export function getPlayerRank(playerdata) {
	let ranks = [
		playerdata.rank, 
		playerdata.monthlyPackageRank, 
		playerdata.newPackageRank, 
		playerdata.packageRank
	];
	for (const rank of ranks) {
		if (rank !== undefined && rank !== "NONE" && rank !== "NORMAL") return rank;
	}
	return "NONE";
}

/**
 * Returns the priority of the rank of a player based on the `player` JSON
 * The priority of a rank is the order in which it appears in tab in lobbies
 *
 * @param {Object} playerdata    The `player` JSON from the API
 * @returns {number}             The priority of the rank - from 0 (undefined) to 10 (ADMIN)
 */
export function getPlayerRankPriority(playerdata) {
	const rank = getPlayerRank(playerdata);
	return HYPIXEL.RANKPRIORITY.indexOf(rank);
}

/**
 * Checks whether a pet Object is a pet or a companion
 * Pet objects are characterized by the presence of hunger, thirst, exercise, or experience data
 *
 * @param {Object} petObj    The pet Object
 * @returns {boolean}        Whether a pet Object is a pet or a companion
 */
export function isPet({HUNGER, THIRST, EXERCISE, experience}) {
	return ![HUNGER, THIRST, EXERCISE, experience].every(n => n === undefined);
}

/**
 * Returns the number of times a quest has been completed since the beginning of the day, week, month, or year
 *
 * @param {string} period         The period of time to check
 * @param {Object} questObject    The specific quest to check, from the Hypixel API resources endpoint
 * @param {Array} completions     Array of completion time stamps, from the Hypixel API player endpoint
 * @returns {number}              Number of completions
 */
export function questCompletionsSince(period, completions) {
	if (!completions) return 0;

	const nowEST = DateTime.now().setZone('America/New_York');
	let timestamp = null;

	if (period === 'daily') {
		timestamp = nowEST.startOf('day').toMillis();
	}
	else if (period === 'weekly') {
		// Hypixel weekly reset is Friday 00:00 EST
		let reset = nowEST.startOf('week').plus({ days: 4 }); // Friday
		if (nowEST < reset) {
			reset = reset.minus({ weeks: 1 });
		}
		timestamp = reset.toMillis();
	}
	else if (period === 'monthly') {
		timestamp = nowEST.startOf('month').toMillis();
	}
	else if (period === 'yearly') {
		timestamp = nowEST.startOf('year').toMillis();
	}
	else if (period === 'total') {
		timestamp = 0;
	}
	
	return completions.filter(c => c.time >= timestamp).length;
}


/**
 * Returns the total number of challenges completed by a player
 *
 * @param {Object} challenge    The challenge Object from the Hypixel API to parse
 * @returns {number}            Number of completions
 */
export function calculateChallengesCompleted(challenges) {
	if (!challenges) {
		return 0;
	}
	const allTime = challenges.all_time || {};
	const allTimeValues = Object.values(allTime);
	return allTimeValues.reduce((acc, value) => acc + value, 0);
}