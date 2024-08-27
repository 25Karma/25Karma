import * as Utils from 'src/utils';
import { HYPIXEL } from 'src/constants/hypixel';

export * from './HypixelLeveling';

/*
* Converts network experience into network level
*
* @param {number} exp
* @return {number}       Equivalent network level
*/
export function calculateNetworkLevel(exp = 0) {
	return ((Math.sqrt(exp + 15312.5) - 125/Math.sqrt(2))/(25*Math.sqrt(2)))
}	

/*
* Returns the player's overall achievement information about a single gamemode
*
* @param {String} gameId             ID of the gamemode (i.e. the desired key in achievementsJson)
* @param {Object} achievementsJson   All achievements data from the Hypixel API 'resources/achievements' endpoint
* @param {Object} playerJson         Player data from the Hypixel API 'player' endpoint
* @return {Object}                   Assorted data about the gamemode pertaining to achievements
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

/*
* Returns the guild rank of a member
*
* @param {Object} member          Data of the member from the `members` array of the API
* @param {Array<Object>} ranks    `ranks` Object from the API
* @return {Object}                Rank (name and priority) that corresponds to the member
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

/*
* Returns the daily GEXP earned by a member of a guild
*
* @param {Object} member          Data of the member from the `members` array of the API
* @return {number}                The daily GEXP of the member
*/
export function getGuildMemberDailyGEXP(member) {
	return member.expHistory[Object.keys(member.expHistory).reduce((a, b) =>
		new Date(a) > new Date(b) ? a : b)];
}

/*
* Returns the weekly GEXP earned by a member of a guild
*
* @param {Object} member          Data of the member from the `members` array of the API
* @return {number}                The weekly GEXP of the member
*/
export function getGuildMemberWeeklyGEXP(member) {
	if (member.expHistory) {
		return Object.values(member.expHistory).reduce((a,b) => a+b);
	}
	else {
		return 0;
	}
}

/*
* Returns the most played gamemode out of a list of gamemodes
*
* @param {Array<Object>} jsonarray    Array of gamemode data
* @param {function} totalplays        Function to compute the total plays of a given gamemode from the array
* @return {Object}                    Most played gamemode, or empty Object
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

/*
* Returns the rank of a player based on the `player` JSON
*
* @param {Object} playerdata    The `player` JSON from the API
* @return {string}            The ID of the rank - anything from NONE to MVP_PLUS to ADMIN
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

/*
* Returns the priority of the rank of a player based on the `player` JSON
* The priority of a rank is the order in which it appears in tab in lobbies
*
* @param {Object} playerdata    The `player` JSON from the API
* @return {Number}              The priority of the rank - from 0 (undefined) to 10 (ADMIN)
*/
export function getPlayerRankPriority(playerdata) {
	const rank = getPlayerRank(playerdata);
	return HYPIXEL.RANKPRIORITY.indexOf(rank);
}

/*
* Checks whether a pet Object is a pet or a companion
* Pet objects are characterized by the presence of hunger, thirst, exercise, or experience data
*
* @param {Object}     The pet Object
* @return {Boolean}
*/
export function isPet({HUNGER, THIRST, EXERCISE, experience}) {
	return ![HUNGER, THIRST, EXERCISE, experience].every(n => n === undefined);
}

/*
* Returns the number of times a quest has been completed since the beginning of the day, week, month, or year
*
* @param {string} period         The period of time to check
* @param {Object} questObject    The specific quest to check, from the Hypixel API resources endpoint
* @param {Array} completions     Array of completion time stamps, from the Hypixel API player endpoint
* @return {Number}               Number of completions
*/
export function questCompletionsSince(period, completions) {
	let timestamp = null;
	if (period === 'daily') {
		// Midnight of today
		timestamp = (new Date()).setHours(0,0,0,0);
	}
	else if (period === 'weekly') {
		// Last Friday
		// https://stackoverflow.com/a/46544455/12191708
		let date = new Date();
		const lastFriday = new Date(date.setDate(date.getDate() - (date.getDay() + 9)%7));
		timestamp = lastFriday.setHours(0,0,0,0);
	}
	else if (period === 'monthly') {
		// Beginning of the month
		// https://stackoverflow.com/a/13572682/12191708
		const date = new Date();
		timestamp = new Date(date.getFullYear(), date.getMonth(), 1);
	}
	else if (period === 'yearly') {
		// Beginning of the year
		timestamp = new Date((new Date()).getFullYear(), 0, 1);
	}
	else if (period === 'total') {
		// All time
		timestamp = 0;
	}
	
	if (!completions) {
		return 0;
	}
	else {
		return completions.filter(c => c.time > timestamp).length;
	}
}


/*
* Returns the total number of challenges completed by a player
*
* @param {json} challenge        The challenge JSON from the Hypixel API to parse
* @return {Number}               Number of completions
*/
export function calculateChallengesComplete(challenges) {
	if (!challenges) {
		return 0;
	}
	const allTime = challenges.all_time || {};
	const allTimeValues = Object.values(allTime);
	return allTimeValues.reduce((acc, value) => acc + value, 0);
}