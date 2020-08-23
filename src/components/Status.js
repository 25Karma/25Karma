import React from 'react';
import { FaSignal } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
import { ReactIcon } from 'components';
import { HYPIXEL } from 'constants/hypixel';
import * as Utils from 'utils';

/*
* Displays a "signal" icon with a player's online status as a tooltip
*
* @param {Object} props.status 	JSON object from the Hypixel API 'status' endpoint
* @param {Object} props.player 	JSON object from the Hypixel API 'player' endpoint
* @param {string} props.size 	Size of the icon, default 'md'
*/
export function Status(props) {
	const games = HYPIXEL.GAMES;
	const session = props.status.session || {};
	const lastLogout = Utils.traverse(props.player, 'player.lastLogout');

	function getStatusDataTip() {

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
				icon={FaSignal} 
				color={session.online ? 'green' : 'darkgray'}
				size={props.size} />
			<ReactTooltip />
		</span>
		);
}