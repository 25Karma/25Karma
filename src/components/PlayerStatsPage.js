import React from 'react';
import * as Stats from './Stats';
import { Navbar, Searchbar } from '../components';

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