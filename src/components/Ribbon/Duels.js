import React from 'react';
import { Box, Stat } from 'components';
import { Ribbon } from 'components/Ribbon';
import * as Utils from 'utils';

/*
* Stats ribbon for Duels
*
* @param {Object} props.player Player data in JSON object
* @param {number} props.index The order in which to display the row (used by react-beautiful-dnd)
*/
export function Duels(props) {

	// Constants useful for processing Duels API data
	const duelsConstants = {
		DIVISIONS : [
			['Rookie', 'darkgray'], // dark gray
			['Iron', 'white'], // white
			['Gold', 'gold'], // gold
			['Diamond', 'aqua'], // aqua
			['Master', 'darkgreen'], // dark green
			['Legend', 'darkred'], // dark red
			['Grandmaster', 'yellow'], // yellow
			['Godlike', 'purple'], // purple
		],
		MODES : [
			['uhc_duel', 'UHC 1v1'],
			['uhc_doubles', 'UHC 2v2'],
			['uhc_meetup', 'UHC Meetup'],
			['op_duel', 'OP 1v1'],
			['op_doubles', 'OP 2v2'],
			['sw_duel', 'SkyWars 1v1'],
			['sw_doubles', 'SkyWars 2v2'],
			['bow_duel', 'Bow 1v1'],
			['blitz_duel', 'Blitz 1v1'],
			['sumo_duel', 'Sumo 1v1'],
			['bowspleef_duel', 'Bow Spleef 1v1'],
			['classic_duel', 'Classic 1v1'],
			['potion_duel', 'NoDebuff 1v1'],
			['combo_duel', 'Combo 1v1'],
			['bridge_duel', 'Bridge 1v1'],
			['bridge_doubles', 'Bridge 2v2'],
			['bridge_four', 'Bridge 4v4'],
		],
	};

	const json = Utils.traverse(props.player,'stats.Duels') || {};
	const stats = calculateDuelsStats();
	const ratios = {
		kd : Utils.ratio(stats.kills,stats.deaths),
		wl : Utils.ratio(json.wins,json.losses),
		mhm : Utils.ratio(json.melee_hits,json.melee_swings),
		ahm : Utils.ratio(json.bow_hits,json.bow_shots),
	}
	
	function calculateDuelsStats() {
		let totalDeaths = 0, totalKills = 0;
		// Ignores Bridge deaths and kills
		for (const [k,v] of Object.entries(json)) {
			if (k.includes('deaths') && k!=='deaths' && !k.includes('bridge')) {
				totalDeaths += v;
			}
			else if (k.includes('kills') && k!=='kills' && !k.includes('bridge')) {
				totalKills += v;
			}
		}
		return {
			division : getDuelsDivision(),
			kills : Utils.default0(totalKills),
			deaths : Utils.default0(totalDeaths),
		}
	}

	function getDuelsDivision() {
		const divisions = duelsConstants.DIVISIONS;
		for (const [k,v] of divisions.reverse()) {
			const dat = json[`all_modes_${k.toLowerCase()}_title_prestige`];
			if (dat !== undefined) {
				return {
					name: `${k} ${Utils.romanize(dat)}`,
					color: v,
				};
			}
		}
		// If the player has no division
		return {name: '-', color: '7'};
	}

	function getMostPlayedMode() {
		const modes = duelsConstants.MODES;
		let mostPlayed = '§7-';
		let mostPlays = 0;
		for (const mode of modes) {
			const [id, name] = mode;
			const plays = Utils.default0(json[`${id}_wins`]) + Utils.default0(json[`${id}_losses`])
			if (plays > mostPlays) {
				mostPlays = plays;
				mostPlayed = name;
			}
		}
		return mostPlayed;
	}

	function renderTableBody() {
		const modes = duelsConstants.MODES;
		const mostPlayed = getMostPlayedMode();

		return modes.map(mode => {
			const [id,name] = mode;
			return (
				<tr key={id} className={name === mostPlayed ? 'c-pink' : ''}>
					<td>{name}</td>
					<td>{Utils.formatNum(json[`${id}_kills`])}</td>
					<td>{Utils.formatNum(json[`${id}_deaths`])}</td>
					<td>{Utils.formatNum(Utils.ratio(json[`${id}_kills`],json[`${id}_deaths`]))}</td>
					<td>{Utils.formatNum(json[`${id}_wins`])}</td>
					<td>{Utils.formatNum(json[`${id}_losses`])}</td>
					<td>{Utils.formatNum(Utils.ratio(json[`${id}_wins`],json[`${id}_losses`]))}</td>
					<td>{Utils.formatNum(Utils.ratio(json[`${id}_melee_hits`],json[`${id}_melee_swings`]))}</td>
					<td>{Utils.formatNum(Utils.ratio(json[`${id}_bow_hits`],json[`${id}_bow_shots`]))}</td>
				</tr>
				);
		})
	}

	const header = (
		<React.Fragment>
			<Box title="Division">{`${Utils.toColorCode(stats.division.color)}${stats.division.name}`}</Box>
			<Box title="Wins">{json.wins}</Box>
			<Box title="WL">{ratios.wl}</Box>
			<Box title="Most Played">{`§f${getMostPlayedMode()}`}</Box>
		</React.Fragment>
		);

	return (
		<Ribbon title="Duels" header={header} index={props.index}>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Stat title="Coins">{json.coins}</Stat>
					<Stat title="Loot Chests">{json.duels_chests}</Stat>
					<br/>
					<br/>
					<Stat title="Kills">{stats.kills}</Stat>
					<Stat title="Deaths">{stats.deaths}</Stat>
					<Stat title="Kill/Death Ratio">{ratios.kd}</Stat>
					<br/>
					<Stat title="Melee Swings">{json.melee_swings}</Stat>
					<Stat title="Melee Hits">{json.melee_hits}</Stat>
					<Stat title="Melee Hit/Miss Ratio">{ratios.mhm}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Best Winstreak">{json.best_overall_winstreak}</Stat>
					<Stat title="Current Winstreak">{json.current_winstreak}</Stat>
					<Stat title="Overall Division">{stats.division.name}</Stat>
					<br/>
					<Stat title="Wins">{json.wins}</Stat>
					<Stat title="Losses">{json.losses}</Stat>
					<Stat title="Win/Loss Ratio">{ratios.wl}</Stat>
					<br/>
					<Stat title="Arrows Shot">{json.bow_shots}</Stat>
					<Stat title="Arrows Hit">{json.bow_hits}</Stat>
					<Stat title="Arrow Hit/Miss Ratio">{ratios.ahm}</Stat>
				</div>
			</div>
			<div className="stats-separator mb-3"></div>
			<table className="mb-2">
				<thead>
					<tr>
						<th>Mode</th>
						<th>Kills</th>
						<th>Deaths</th>
						<th>KD</th>
						<th>Wins</th>
						<th>Losses</th>
						<th>WL</th>
						<th>Melee HM</th>
						<th>Arrow HM</th>
					</tr>
				</thead>
				<tbody>
					{renderTableBody()}
				</tbody>
			</table>
		</Ribbon>
		);
}