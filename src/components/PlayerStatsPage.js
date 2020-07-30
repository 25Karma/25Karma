import React from 'react';
import * as Stats from './Stats';
import { Navbar, Searchbar } from '../components';

export function PlayerStatsPage(props) {
	const player = props.playerData;

	return (
		<div>
			<Navbar><Searchbar /></Navbar>
			<div className="container v-flex align-items-center my-4">
				<div className="font-md font-minecraft">{player.displayname}</div>
				<Stats.Bedwars player={player} />
			</div>
		</div>
		);
}