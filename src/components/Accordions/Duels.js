import React, { memo } from 'react';
import { Accordion, Box, HorizontalLine, StatCell, 
	StatPair, StatRow } from 'components';
import { DUELS as consts } from 'constants/hypixel';
import { useHypixelContext } from 'hooks';
import * as Utils from 'utils';

/*
* Stats accordion for Duels
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export const Duels = memo((props) => {
	
	const { player } = useHypixelContext();
	const json = Utils.traverse(player,'stats.Duels') || {};

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
			const plays = Utils.default0(json[`${mode.id}wins`]) + Utils.default0(json[`${mode.id}losses`])
			// The mode.id part is so that the 'Overall' category is ignored
			if (plays > mostPlays && mode.id) {
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
				consts.MODES.map(({id, name}) => 
					Boolean(Utils.add(json[`${id}wins`], json[`${id}losses`])) &&
					<StatRow key={id} id={id} isHighlighted={name === mostPlayedMode}>
						<StatCell>{name}</StatCell>
						<StatCell>{json[`${id}kills`]}</StatCell>
						<StatCell>{json[`${id}deaths`]}</StatCell>
						<StatCell>{Utils.ratio(json[`${id}_kills`],json[`${id}deaths`])}</StatCell>
						<StatCell>{json[`${id}wins`]}</StatCell>
						<StatCell>{json[`${id}losses`]}</StatCell>
						<StatCell>{Utils.ratio(json[`${id}wins`],json[`${id}losses`])}</StatCell>
						<StatCell>{Utils.ratio(json[`${id}melee_hits`],json[`${id}melee_swings`])}</StatCell>
						<StatCell>{Utils.ratio(json[`${id}bow_hits`],json[`${id}bow_shots`])}</StatCell>
					</StatRow>
					)
			}
			</tbody>
		</table>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="h-flex my-3">
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
			
			<HorizontalLine />

			<div className="overflow-x my-3">
				{table}
			</div>
		</Accordion>
});