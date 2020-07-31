import React from 'react';
import * as Stats from './Stats';
import { Navbar, Searchbar } from '../components';

// should only be called if player is not null (handling by app.js)
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