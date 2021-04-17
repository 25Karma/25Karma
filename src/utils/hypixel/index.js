import * as Utils from 'utils';
import { HYPIXEL } from 'constants/hypixel';

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