import React from 'react';
import { Accordion, Box, StatCell, StatPair } from 'components';
import * as Utils from 'utils';

/*
* Stats accordion for Duels
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
			{id: 'bridge_2v2v2v2', name: 'Bridge 2v2v2v2'},
			{id: 'bridge_3v3v3v3', name: 'Bridge 3v3v3v3'},
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
			<Box title="Division" color={division.color}>{division.name}</Box>
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
					Boolean(Utils.add(json[`${mode.id}_wins`], json[`${mode.id}_losses`])) &&
					<tr key={mode.id} className={mode.name === mostPlayedMode ? 'c-pink' : ''}>
						<StatCell>{mode.name}</StatCell>
						<StatCell>{json[`${mode.id}_kills`]}</StatCell>
						<StatCell>{json[`${mode.id}_deaths`]}</StatCell>
						<StatCell>{Utils.ratio(json[`${mode.id}_kills`],json[`${mode.id}_deaths`])}</StatCell>
						<StatCell>{json[`${mode.id}_wins`]}</StatCell>
						<StatCell>{json[`${mode.id}_losses`]}</StatCell>
						<StatCell>{Utils.ratio(json[`${mode.id}_wins`],json[`${mode.id}_losses`])}</StatCell>
						<StatCell>{Utils.ratio(json[`${mode.id}_melee_hits`],json[`${mode.id}_melee_swings`])}</StatCell>
						<StatCell>{Utils.ratio(json[`${mode.id}_bow_hits`],json[`${mode.id}_bow_shots`])}</StatCell>
					</tr>
					)
			}
			</tbody>
		</table>
		);

	return (
		<Accordion title="Duels" header={header} index={props.index}>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<StatPair title="Coins" color="gold">{json.coins}</StatPair>
					<StatPair title="Loot Chests">{json.duels_chests}</StatPair>
					<br/>
					<br/>
					<StatPair title="Kills">{stats.kills}</StatPair>
					<StatPair title="Deaths">{stats.deaths}</StatPair>
					<StatPair title="Kill/Death Ratio">{ratios.kd}</StatPair>
					<br/>
					<StatPair title="Melee Swings">{json.melee_swings}</StatPair>
					<StatPair title="Melee Hits">{json.melee_hits}</StatPair>
					<StatPair title="Melee Hit Accuracy" percentage>{ratios.mhm}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Best Winstreak">{json.best_overall_winstreak}</StatPair>
					<StatPair title="Current Winstreak">{json.current_winstreak}</StatPair>
					<StatPair title="Overall Division" color={division.color}>{division.name}</StatPair>
					<br/>
					<StatPair title="Wins">{json.wins}</StatPair>
					<StatPair title="Losses">{json.losses}</StatPair>
					<StatPair title="Win/Loss Ratio">{ratios.wl}</StatPair>
					<br/>
					<StatPair title="Arrows Shot">{json.bow_shots}</StatPair>
					<StatPair title="Arrows Hit">{json.bow_hits}</StatPair>
					<StatPair title="Arrow Hit Accuracy" percentage>{ratios.ahm}</StatPair>
				</div>
			</div>
			<div className="accordion-separator mb-3"></div>
			<div className="overflow-x mb-2">
				{table}
			</div>
		</Accordion>
		);
}