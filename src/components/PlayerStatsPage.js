import React from 'react';
import * as Stats from './Stats';

export function PlayerStatsPage(props) {
	const player = props.playerData;
	const stats = player.stats;

	return (
		<div className="v-flex align-items-center my-4">
			<div className="font-md font-minecraft">{player.displayname}</div>
			<Stats.Bedwars player={player} />
		</div>
		);
}