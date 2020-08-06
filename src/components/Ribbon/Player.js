import React from 'react';
import ReactTooltip from 'react-tooltip';
import Cookies from 'js-cookie';
import { IconContext } from 'react-icons';
import { FaSignal } from 'react-icons/fa';
import { Box, Crafatar, Playername } from 'components';
import * as Utils from 'utils';

export function Player(props) {
	const player = props.player;
	const status = props.status;
	const decimal = Cookies.get('decimal') || 2;
	const stats = {
		karma: Utils.default0(player.karma),
		networkLevel: Utils.default0(
			calculateNetworkLevel(player.networkExp).toFixed(decimal)),
	}

	function calculateNetworkLevel(exp) {
		return ((Math.sqrt(exp + 15312.5) - 125/Math.sqrt(2))/(25*Math.sqrt(2)))
	}

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
			UHC: 'UHC Champions',
			VAMPIREZ: 'VampireZ',
			WALLS: 'The Walls',
			WALLS3: 'Mega Walls',
		}

		if (status.online) {
			const game = status.gameType
			if (status.mode === 'LOBBY') {
				return `Online. In a ${games[game] || game} lobby.`;
			}
			return `Online. Playing ${games[status.gameType] || status.gameType}.`;
		}
		else {
			if (player.lastLogout) {
				return `Offline. Last seen ${Utils.timeSince(player.lastLogout)} ago.`;
			}
			return 'Offline.';
		}
	}

	return (
		<div className="v-flex align-items-center">
			<div className="h-flex text-shadow">
				<Crafatar uuid={player.uuid} shadow />
				<Playername playerdata={player} font="lg" />
				<IconContext.Provider value={{ className: 'react-icons-lg' }}>
					<span className={status.online ? 'c-green' : 'c-darkgray'}>
						<FaSignal 
							className="cursor-help"
							data-tip={getStatusDataTip()}/>
						<ReactTooltip />
					</span>
				</IconContext.Provider>
			</div>
			<div className="h-flex">
				<Box title="Hypixel Level">
					{'§f'+stats.networkLevel}
				</Box>
				<Box title="Karma">
					{'§d'+stats.karma}
				</Box>
			</div>
		</div>
		);
}