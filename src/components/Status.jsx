import React from 'react';
import { FaSignal } from 'react-icons/fa';
import { ReactIcon, Tippy } from 'src/components';
import { HYPIXEL } from 'src/constants/hypixel';
import * as Utils from 'src/utils';

/*
* Displays a "signal" icon with a player's online status as a tooltip
*
* @param {Object} props.status    JSON object from the Hypixel API 'status' endpoint
* @param {Object} props.player    JSON object from the Hypixel API 'player' endpoint
* @param {string} props.size      Size of the icon, default 'md'
*/
export function Status(props) {
	const games = HYPIXEL.GAMES;
	const { status, player } = props;
	const lastLogout = Utils.traverse(player, 'lastLogout');

	function getStatusDataTip() {

		if (status.online) {
			const game = status.gameType
			// Lobby-type miniservers
			if (status.mode === 'LOBBY') {
				return `Online. In a ${games[game] || game} lobby.`;
			}
			else if (status.gameType === 'REPLAY') {
				return 'Online. Watching a replay.'
			}
			// Regular game miniservers
			return `Online. Playing ${games[status.gameType] || status.gameType}.`;
		}
		else {
			if (lastLogout) {
				return `Offline. Last seen ${Utils.timeSince(lastLogout)} ago.`;
			}
			return 'Offline.';
		}
	}

	return (
		<Tippy content={getStatusDataTip()}>
			<span className="cursor-help pl-2">
				<ReactIcon 
					icon={FaSignal} 
					color={status.online ? 'green' : 'darkgray'}
					size={props.size} />
			</span>
		</Tippy>
		);
}