import React from 'react';
import Cookies from 'js-cookie';
import { Box, Stats } from '../../components';
import * as Utils from '../../utils';

export function Duels(props) {
	let json = Utils.traverse(props.player,'stats.Duels');
	if (json === undefined) {
		json = {};
	}
	const decimal = Cookies.get('decimal') || 2;
	const stats = calculateDuelsDeaths(json);
	const ratios = {
		kd : (stats.kills/Utils.set1If0(stats.deaths)).toFixed(decimal),
		wl : (stats.wins/Utils.set1If0(stats.losses)).toFixed(decimal),
	}
	
	// Ignores Bridge deaths
	function calculateDuelsDeaths(data) {
		let totalDeaths = 0, totalKills = 0;
		for (const [k,v] of Object.entries(data)) {
			if (k.includes('deaths') && k!=='deaths' && !k.includes('bridge')) {
				totalDeaths += v;
			}
			else if (k.includes('kills') && k!=='kills' && !k.includes('bridge')) {
				totalKills += v;
			}
		}
		return {
			rank : getDuelsRank(data),
			kills : Utils.default0(totalKills),
			deaths : Utils.default0(totalDeaths),
			wins : Utils.default0(json.wins),
			losses : Utils.default0(json.losses),
		}
	}

	function getDuelsRank(data) {
		const ranks = [
			['Rookie', '8'],
			['Iron', 'f'],
			['Gold', '6'],
			['Diamond', 'b'],
			['Master', '2'],
			['Legend', '4'],
			['Grandmaster', 'e'],
			['Godlike', '5'],
		];
		const roman = {
			'1':'','2':'II','3':'III','4':'IV','5':'V',
		}
		for (const [k,v] of ranks.reverse()) {
			const dat = data[`all_modes_${k.toLowerCase()}_title_prestige`];
			if (dat !== undefined) {
				return `§${v}${k} ${roman[dat]}`
			}
		}
		return '-'
	}

	const header = (
		<React.Fragment>
			<Box title="Rank">{stats.rank}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{stats.wins}</Box>
			<Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
		);

	return (
		<Stats.Stats title="Duels" header={header}>
			
		</Stats.Stats>
		);
}