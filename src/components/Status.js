import React from 'react';
import ReactTooltip from 'react-tooltip';
import { ReactIcon } from 'components';
import * as Utils from 'utils';

/*
* Displays a "signal" icon with a player's online status as a tooltip
*
* @param {Object} props.status 	JSON object from the Hypixel API 'status' endpoint
* @param {Object} props.player 	JSON object from the Hypixel API 'player' endpoint
* @param {string} props.size 	Size of the icon, default 'md'
*/
export function Status(props) {
	const session = props.status.session || {};
	const lastLogout = Utils.traverse(props.player, 'player.lastLogout');

	function getStatusDataTip() {
		const games = {
			ARENA: 'Arena Brawl',
			ARCADE: 'Arcade Games',
			BATTLEGROUND: 'Warlords',
			BEDWARS: 'Bed Wars',
			BUILD_BATTLE: 'Build Battle',
			DUELS: 'Duels',
			GINGERBREAD: 'Turbo Kart Racers',
			HOUSING: 'Housing',
			LEGACY: 'Classic Games',
			MAIN: 'Main',
			MCGO: 'Cops and Crims',
			MURDER_MYSTERY: 'Murder Mystery',
			PAINTBALL: 'Paintball',
			PIT: 'The Hypixel Pit',
			PROTOTYPE: 'Prototype',
			QUAKECRAFT: 'Quakecraft',
			SKYBLOCK: 'SkyBlock',
			SKYWARS: 'SkyWars',
			SPEED_UHC: 'Speed UHC',
			SUPER_SMASH: 'Smash Heroes',
			SURVIVAL_GAMES: 'Blitz SG',
			TNTGAMES: 'TNT Games',
			TOURNAMENT: 'Tournament Hall',
			UHC: 'UHC Champions',
			VAMPIREZ: 'VampireZ',
			WALLS: 'The Walls',
			WALLS3: 'Mega Walls',
		}

		if (session.online) {
			const game = session.gameType
			if (session.mode === 'LOBBY') {
				return `Online. In a ${games[game] || game} lobby.`;
			}
			return `Online. Playing ${games[session.gameType] || session.gameType}.`;
		}
		else {
			if (lastLogout) {
				return `Offline. Last seen ${Utils.timeSince(lastLogout)} ago.`;
			}
			return 'Offline.';
		}
	}

	return (
		<span 
			className="cursor-help"
			data-tip={getStatusDataTip()}>
			<ReactIcon 
				icon="FaSignal" 
				color={session.online ? 'green' : 'darkgray'}
				size={props.size} />
			<ReactTooltip />
		</span>
		);
}