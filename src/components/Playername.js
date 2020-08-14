import React from 'react';
import { MinecraftText } from 'components';

/*
* Hypixel player username with rank & colors in Minecraft font
*
* @param {Object} props.playerdata 	Player data JSON object
* @param {string} props.font 		Font size
*/
export function Playername(props) {

	const playerdata = props.playerdata
	const stats = {
		name: playerdata.displayname || '',
		rank: getPlayerRank(playerdata),
		prefix: playerdata.prefix,
		plusColor: playerdata.rankPlusColor,
	}

	function getPlayerRank(playerdata) {
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

	function getNameWithRank(stats) {
		const plusColors = {
			undefined : '§c',
			BLACK : '§0',
			DARK_BLUE : '§1',
			DARK_GREEN : '§2',
			DARK_AQUA : '§3',
			DARK_RED : '§4',
			DARK_PURPLE : '§5',
			GOLD : '§6',
			GRAY : '§7',
			DARK_GRAY : '§8',
			BLUE : '§9',
			GREEN : '§a',
			AQUA : '§b',
			RED : '§c',
			LIGHT_PURPLE : '§d',
			YELLOW : '§e',
			WHITE : '§f'
		}
		const plusColor = plusColors[stats.plusColor];
		const ranks = {
			undefined : `§7${stats.name}`,
			NONE : `§7${stats.name}`,
			VIP : `§a[VIP] ${stats.name}`,
			VIP_PLUS : `§a[VIP§6+§a] ${stats.name}`,
			MVP : `§b[MVP] ${stats.name}`,
			MVP_PLUS : `§b[MVP${plusColor}+§b] ${stats.name}`,
			SUPERSTAR : `§6[MVP${plusColor}++§6] ${stats.name}`,
			HELPER : `§9[HELPER] ${stats.name}`,
			MODERATOR : `§2[MOD] ${stats.name}`,
			ADMIN : `§c[ADMIN] ${stats.name}`,
			YOUTUBER : `§c[§fYOUTUBE§c] ${stats.name}`,
		}
		if (stats.prefix !== undefined) {
			return `${stats.prefix} ${stats.name}`
		}
		return ranks[stats.rank];
	}

	return (
		<MinecraftText font={props.font} className="px-2">
			{getNameWithRank(stats)}
		</MinecraftText>
		);
}