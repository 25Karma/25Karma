export * from './HypixelLeveling'

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