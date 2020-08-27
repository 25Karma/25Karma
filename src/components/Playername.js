import React from 'react';
import { MinecraftText } from 'components';
import * as Utils from 'utils';
import { getPlayerRank } from 'utils/hypixel';

/*
* Hypixel player username with rank & colors in Minecraft font
*
* @param {string} props.username 	Player's username
* @param {Object} props.playerdata 	Player data JSON object
* @param {string} props.size 		Font size
*/
export function PlayerName(props) {

	const playerdata = props.player || {};
	const stats = {
		// Must pass username as separate prop because Hypixel's displayname
		// only updates when the player logs in
		// props.username should be sourced from the Mojang API
		name: props.username || '',
		rank: getPlayerRank(playerdata),
		prefix: playerdata.prefix,
		plusColor: playerdata.rankPlusColor,
		rankColor: playerdata.monthlyRankColor,
	}

	function getNameWithRank(stats) {
		const plusColor = Utils.toColorCode(stats.plusColor || 'red');
		// For MVP++s only
		const rankColor = Utils.toColorCode(stats.rankColor || 'gold');
		const ranks = {
			undefined : `§7${stats.name}`,
			NONE : `§7${stats.name}`,
			VIP : `§a[VIP] ${stats.name}`,
			VIP_PLUS : `§a[VIP§6+§a] ${stats.name}`,
			MVP : `§b[MVP] ${stats.name}`,
			MVP_PLUS : `§b[MVP${plusColor}+§b] ${stats.name}`,
			SUPERSTAR : `${rankColor}[MVP${plusColor}++${rankColor}] ${stats.name}`,
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
		<MinecraftText size={props.size} className="pr-2">
			{getNameWithRank(stats)}
		</MinecraftText>
		);
}