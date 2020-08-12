import React from 'react';
import { Box, Stat } from 'components';
import { Ribbon } from 'components/Ribbon';
import * as Utils from 'utils';

/*
* Stats ribbon for Duels
*
* @param {Object} props.player 	Player data in JSON object
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export function Duels(props) {

	// Constants useful for processing Duels API data
	const consts = {
		DIVISIONS : [
			{name: 'Rookie', color: 'darkgray'},
			{name: 'Iron', color: 'white'},
			{name: 'Gold', color: 'gold'},
			{name: 'Diamond', color: 'aqua'},
			{name: 'Master', color: 'darkgreen'},
			{name: 'Legend', color: 'darkred'},
			{name: 'Grandmaster', color: 'yellow'},
			{name: 'Godlike', color: 'purple'},
		],
		MODES : [
			{id: 'uhc_duel', name: 'UHC 1v1'},
			{id: 'uhc_doubles', name: 'UHC 2v2'},
			{id: 'uhc_meetup', name: 'UHC Meetup'},
			{id: 'op_duel', name: 'OP 1v1'},
			{id: 'op_doubles', name: 'OP 2v2'},
			{id: 'sw_duel', name: 'SkyWars 1v1'},
			{id: 'sw_doubles', name: 'SkyWars 2v2'},
			{id: 'bow_duel', name: 'Bow 1v1'},
			{id: 'blitz_duel', name: 'Blitz 1v1'},
			{id: 'sumo_duel', name: 'Sumo 1v1'},
			{id: 'bowspleef_duel', name: 'Bow Spleef 1v1'},
			{id: 'classic_duel', name: 'Classic 1v1'},
			{id: 'potion_duel', name: 'NoDebuff 1v1'},
			{id: 'combo_duel', name: 'Combo 1v1'},
			{id: 'bridge_duel', name: 'Bridge 1v1'},
			{id: 'bridge_doubles', name: 'Bridge 2v2'},
			{id: 'bridge_four', name: 'Bridge 4v4'},
		],
	};

	const json = Utils.traverse(props.player,'stats.Duels') || {};

	const division = (() => {
		for (const div of consts.DIVISIONS.slice().reverse()) {
			const dat = json[`all_modes_${div.name.toLowerCase()}_title_prestige`];
			if (dat !== undefined) {
				return {
					name: `${div.name} ${Utils.romanize(dat)}`,
					color: div.color,
				};
			}
		}
		// If the player has no division
		return {name: '-', color: 'gray'};
	})();

	const stats = (() => {
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
			kills : Utils.default0(totalKills),
			deaths : Utils.default0(totalDeaths),
		}
	})();

	const ratios = {
		kd : Utils.ratio(stats.kills,stats.deaths),
		wl : Utils.ratio(json.wins,json.losses),
		mhm : Utils.ratio(json.melee_hits,json.melee_swings),
		ahm : Utils.ratio(json.bow_hits,json.bow_shots),
	}

	const mostPlayedMode = (() => {
		let mostPlayed = '§7-';
		let mostPlays = 0;
		for (const mode of consts.MODES) {
			const plays = Utils.default0(json[`${mode.id}_wins`]) + Utils.default0(json[`${mode.id}_losses`])
			if (plays > mostPlays) {
				mostPlays = plays;
				mostPlayed = mode.name;
			}
		}
		return mostPlayed;
	})();

	const header = (
		<React.Fragment>
			<Box title="Division">{`${Utils.toColorCode(division.color)}${division.name}`}</Box>
			<Box title="Wins">{json.wins}</Box>
			<Box title="WL">{ratios.wl}</Box>
			<Box title="Most Played">{`§f${mostPlayedMode}`}</Box>
		</React.Fragment>
		);

	const table = (
		<table>
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
			{
				consts.MODES.map(mode => 
					<tr key={mode.id} className={mode.name === mostPlayedMode ? 'c-pink' : ''}>
						<td>{mode.name}</td>
						<td>{Utils.formatNum(json[`${mode.id}_kills`])}</td>
						<td>{Utils.formatNum(json[`${mode.id}_deaths`])}</td>
						<td>{Utils.formatNum(Utils.ratio(json[`${mode.id}_kills`],json[`${mode.id}_deaths`]))}</td>
						<td>{Utils.formatNum(json[`${mode.id}_wins`])}</td>
						<td>{Utils.formatNum(json[`${mode.id}_losses`])}</td>
						<td>{Utils.formatNum(Utils.ratio(json[`${mode.id}_wins`],json[`${mode.id}_losses`]))}</td>
						<td>{Utils.formatNum(Utils.ratio(json[`${mode.id}_melee_hits`],json[`${mode.id}_melee_swings`]))}</td>
						<td>{Utils.formatNum(Utils.ratio(json[`${mode.id}_bow_hits`],json[`${mode.id}_bow_shots`]))}</td>
					</tr>
					)
			}
			</tbody>
		</table>
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
					<Stat title="Overall Division">
						<span className={`c-${division.color}`}>
							{division.name}
						</span>
					</Stat>
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
			<div className="overflow-x mb-2">
				{table}
			</div>
		</Ribbon>
		);
}