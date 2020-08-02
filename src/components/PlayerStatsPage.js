import React from 'react';
import { Navbar, Searchbar, Stats } from '../components';

/*
* Page that displays the stats for an individual player
* The assumption being that it is only called by App.js if player is not null
*
* @param {Object} props.player Player data JSON object
*/
export function PlayerStatsPage(props) {
	const player = props.playerData;

	return (
		<div>
			<Navbar><Searchbar /></Navbar>
			<div className="container v-flex align-items-center my-4">
				<Stats.Player player={player} />
				<Stats.Bedwars player={player} />
				<Stats.Duels player={player} />
				<Stats.Skywars player={player} />
			</div>
		</div>
		);
}