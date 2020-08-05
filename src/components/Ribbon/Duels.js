import React from 'react';
import Cookies from 'js-cookie';
import { Box } from 'components';
import { Ribbon } from 'components/Ribbon';
import * as Utils from 'utils';

/*
* Stats ribbon for Duels
*
* @param {Object} props.player Player data in JSON object
* @param {number} props.index The order in which to display the row (used by react-beautiful-dnd)
*/
export function Duels(props) {
	const json = Utils.traverse(props.player,'stats.Duels');
	const decimal = Cookies.get('decimal') || 2;
	const stats = calculateDuelsStats(json);
	const ratios = {
		kd : (stats.kills/Utils.set1If0(stats.deaths)).toFixed(decimal),
		wl : (stats.wins/Utils.set1If0(stats.losses)).toFixed(decimal),
	}
	
	function calculateDuelsStats(data) {
		let totalDeaths = 0, totalKills = 0;
		// Ignores Bridge deaths and kills
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
			['Rookie', '8'], // dark gray
			['Iron', 'f'], // white
			['Gold', '6'], // gold
			['Diamond', 'b'], // aqua
			['Master', '2'], // dark green
			['Legend', '4'], // dark red
			['Grandmaster', 'e'], // yellow
			['Godlike', '5'], // purple
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
		// If the player has no rank
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
		<Ribbon title="Duels" header={header} index={props.index}>
			
		</Ribbon>
		);
}