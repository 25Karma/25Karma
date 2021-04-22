import React from 'react';
import { FaSignal } from 'react-icons/fa';
import { ReactIcon } from 'components';
import { HYPIXEL } from 'constants/hypixel';
import { useTooltip } from 'hooks';
import * as Utils from 'utils';

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

	useTooltip();

	function getStatusDataTip() {

		if (status.online) {
			const game = status.gameType
			if (status.mode === 'LOBBY') {
				return `Online. In a ${games[game] || game} lobby.`;
			}
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
		<span 
			className="cursor-help pl-2"
			data-tip={getStatusDataTip()}>
			<ReactIcon 
				icon={FaSignal} 
				color={status.online ? 'green' : 'darkgray'}
				size={props.size} />
		</span>
		);
}