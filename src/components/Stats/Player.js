import React from 'react';
import Cookies from 'js-cookie';
import { IconContext } from 'react-icons';
import { FaSignal } from 'react-icons/fa';
import { Box, Crafatar, MinecraftText } from 'components';
import * as Utils from 'utils';

export function Player(props) {
	const player = props.player;
	const decimal = Cookies.get('decimal') || 2;
	const stats = {
		name: player.displayname,
		rank: getPlayerRank(player),
		prefix: player.prefix,
		plusColor: player.rankPlusColor,
		karma: Utils.default0(player.karma),
		networkLevel: Utils.default0(
			calculateNetworkLevel(player.networkExp).toFixed(decimal)),
	}
	console.log(player)

	function calculateNetworkLevel(exp) {
		return ((Math.sqrt(exp + 15312.5) - 125/Math.sqrt(2))/(25*Math.sqrt(2)))
	}

	function getPlayerRank(player) {
		let ranks = [
			player.rank, 
			player.monthlyPackageRank, 
			player.newPackageRank, 
			player.packageRank
		];
		for (const rank of ranks) {
			if (rank !== undefined && rank !== "NONE" && rank !== "NORMAL") return rank;
		}
		return "NONE";
	}

	function getNameWithRank(stats) {
		const plusColors = {
			undefined : '',
			BLACK : '§0',
			DARK_BLUE : '§1',
			DARK_GREEN : '§2',
			DARK_AQUA : '§3',
			DARK_RED : '§4',
			DARK_PURPLE : '§5',
			GOLD : '§6',
			GRAY : '§7',
			DARK_GRAY : '§8',
			BLUE : '§9',
			GREEN : '§a',
			AQUA : '§b',
			RED : '§c',
			LIGHT_PURPLE : '§d',
			YELLOW : '§e',
			WHITE : '§f'
		}
		const plusColor = plusColors[stats.plusColor];
		const ranks = {
			undefined : `§7${stats.name}`,
			NONE : `§7${stats.name}`,
			VIP : `§a[VIP] ${stats.name}`,
			VIP_PLUS : `§a[VIP§6+§a] ${stats.name}`,
			MVP : `§b[MVP] ${stats.name}`,
			MVP_PLUS : `§b[MVP${plusColor}+§b] ${stats.name}`,
			SUPERSTAR : `§6[MVP${plusColor}++§6] ${stats.name}`,
			HELPER : `§1[HELPER] ${stats.name}`,
			MODERATOR : `§2[MOD] ${stats.name}`,
			ADMIN : `§c[ADMIN] ${stats.name}`,
			YOUTUBER : `§c[§fYOUTUBE§c] ${stats.name}`,
		}
		if (stats.prefix !== undefined) {
			return `${stats.prefix} ${stats.name}`
		}
		return ranks[stats.rank];
	}

	return (
		<div className="v-flex align-items-center">
			<div className="h-flex text-shadow">
				<Crafatar uuid={player.uuid} />
				<MinecraftText font="lg" className="px-2">
					{getNameWithRank(stats)}
				</MinecraftText>
				<IconContext.Provider value={{ className: 'react-icons-lg' }}>
					<span className={player.lastLogin > player.lastLogout ? 'c-green' : 'c-darkgray'}>
						<FaSignal />
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