import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'components';
import { Box, Br, Cell, Pair, Row, Table } from 'components/Stats';
import { DUELS as consts } from 'constants/hypixel';
import { useAPIContext } from 'hooks';
import * as Utils from 'utils';
import { getMostPlayed } from 'utils/hypixel';

/*
* Stats accordion for Duels
*
* @param {number} props.index    The order in which to display the row (used by react-beautiful-dnd)
*/
export const Duels = memo((props) => {
	
	const { player } = useAPIContext();
	const json = Utils.traverse(player,'stats.Duels') || {};

	const mostPlayedMode = getMostPlayed(consts.MODES, 
		({id}) => Utils.add(json[`${id}_wins`], json[`${id}_losses`]));

	const division = getDivision('all_modes');

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

	function getDivision(duelType) {
		for (const div of consts.DIVISIONS.slice().reverse()) {
			const dat = json[`${duelType}_${div.id}_title_prestige`];
			if (dat !== undefined) {
				const roman = Utils.romanize(dat);
				return {
					name: `${div.name} ${roman === 'I' ? '' : roman}`,
					level: roman,
					color: div.color,
					style: div.style,
				};
			}
		}
		// If the player has no division
		return {name: '-', level: '-', color: 'gray', style: ''};
	}

	function kills(id) {
		// Need to combine legacy and current kills for 2v2v2v2 and 3v3v3v3 bridge modes specifically
		// For other duels modes, _bridge_kills will have zero effect
		return Utils.add(json[`${id}_bridge_kills`], json[`${id}${id && '_'}kills`]);
	} 

	function deaths(id) {
		return Utils.add(json[`${id}_bridge_deaths`], json[`${id}${id && '_'}deaths`]);
	} 
	const header = (
		<React.Fragment>
			<Box title="Division">{`${division.style}${division.name}`}</Box>
			<Box title="Wins">{json.wins}</Box>
			<Box title="WL">{ratios.wl}</Box>
			<Box title="Most Played" color="white">{mostPlayedMode.name || '§7-'}</Box>
		</React.Fragment>
		);

	const table = (
		<Table>
			<thead>
				<tr>
					<th>Mode</th>
					<th>Div</th>
					<th>Kills</th>
					<th>Deaths</th>
					<th>KD</th>
					<th>Wins</th>
					<th>Losses</th>
					<th>WL</th>
					<th>WS</th>
					<th>Melee HM</th>
					<th>Arrow HM</th>
					<th>Goals</th>
				</tr>
			</thead>
			<tbody>
			{
				consts.MODES.map(({id, name, divisionId}) => {
					const modeDivision = getDivision(divisionId);
					if (Boolean(Utils.add(json[`${id}${id && '_'}wins`], json[`${id}${id && '_'}losses`]))) {
						return (
							<Row key={id} id={id} isHighlighted={id === mostPlayedMode.id}>
								<Cell>{name}</Cell>
								<Cell color={modeDivision.color}>{modeDivision.level}</Cell>
								<Cell>{kills(id)}</Cell>
								<Cell>{deaths(id)}</Cell>
								<Cell>{Utils.ratio(kills(id),deaths(id))}</Cell>
								<Cell>{json[`${id}${id && '_'}wins`]}</Cell>
								<Cell>{json[`${id}${id && '_'}losses`]}</Cell>
								<Cell>{Utils.ratio(json[`${id}${id && '_'}wins`],json[`${id}${id && '_'}losses`])}</Cell>
								<Cell>{json[`current_winstreak${id && '_mode_'}${id}`]}</Cell>
								<Cell>{Utils.ratio(json[`${id}${id && '_'}melee_hits`],json[`${id}${id && '_'}melee_swings`])}</Cell>
								<Cell>{Utils.ratio(json[`${id}${id && '_'}bow_hits`],json[`${id}${id && '_'}bow_shots`])}</Cell>
								<Cell>{json[`${id}${id && '_'}goals`]}</Cell>
							</Row>
							)
					}
					else return null;
				})
			}
			</tbody>
		</Table>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Pair title="Coins" color="gold">{json.coins}</Pair>
					<Pair title="Loot Chests">{json.duels_chests}</Pair>
					<Br/>
					<Br/>
					<Pair title="Kills">{stats.kills}</Pair>
					<Pair title="Deaths">{stats.deaths}</Pair>
					<Pair title="Kill/Death Ratio">{ratios.kd}</Pair>
					<Br/>
					<Pair title="Melee Swings">{json.melee_swings}</Pair>
					<Pair title="Melee Hits">{json.melee_hits}</Pair>
					<Pair title="Melee Hit Accuracy" percentage>{ratios.mhm}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Best Winstreak">{json.best_overall_winstreak}</Pair>
					<Pair title="Current Winstreak">{json.current_winstreak}</Pair>
					<Pair title="Overall Division" color={division.color}>{division.name}</Pair>
					<Br/>
					<Pair title="Wins">{json.wins}</Pair>
					<Pair title="Losses">{json.losses}</Pair>
					<Pair title="Win/Loss Ratio">{ratios.wl}</Pair>
					<Br/>
					<Pair title="Arrows Shot">{json.bow_shots}</Pair>
					<Pair title="Arrows Hit">{json.bow_hits}</Pair>
					<Pair title="Arrow Hit Accuracy" percentage>{ratios.ahm}</Pair>
				</div>
			</div>
			
			<HorizontalLine className="my-3" />

			{table}
		</Accordion>
});