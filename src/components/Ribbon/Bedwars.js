import React from 'react';
import { Box, Stat } from 'components';
import { Ribbon } from 'components/Ribbon';
import * as Utils from 'utils';

/*
* Stats ribbon for Bedwars
*
* @param {Object} props.player Player data in JSON object
* @param {number} props.index The order in which to display the row (used by react-beautiful-dnd)
*/
export function Bedwars(props) {

	const bedwarsConstants = {
		PRESTIGE : [
			[0, '7', 'None'], // gray
			[100, 'f', 'Iron'], // white
			[200, '6', 'Gold'], // gold
			[300, 'b', 'Diamond'], // aqua
			[400, '2', 'Emerald'], // darkgreen
			[500, '3', 'Sapphire'], // darkaqua
			[600, '4', 'Ruby'], // darkred
			[700, 'd', 'Crystal'], // pink
			[800, '9', 'Opal'], // blue
			[900, '5', 'Amethyst'], // purple
			[1000, 'R', 'Rainbow'], // rainbow
			[2000, 'R', 'Rainbow'] // rainbow
		],
		MODES : [
			['eight_one', 'Solo'],
			['eight_two', 'Doubles'],
			['four_three', '3v3v3v3'],
			['four_four', '4v4v4v4'],
			['two_four', '4v4'],
			['eight_one_rush', 'Rush Solo'],
			['eight_two_rush', 'Rush Doubles'],
			['four_four_rush', 'Rush 4v4v4v4'],
			['eight_one_ultimate', 'Ultimate Solo'],
			['eight_two_ultimate', 'Ultimate Doubles'],
			['four_four_ultimate', 'Ultimate 4v4v4v4'],
			['eight_two_lucky', 'Lucky Doubles'],
			['four_four_lucky', 'Lucky 4v4v4v4'],
			['eight_two_voidless', 'Voidless Doubles'],
			['four_four_voidless', 'Voidless 4v4v4v4'],
			['eight_two_armed', 'Armed Doubles'],
			['four_four_armed', 'Armed 4v4v4v4'],
			['castle', 'Castle'],
		],
	};
	
	// The player's API data for Bed Wars
	const json = Utils.traverse(props.player,'stats.Bedwars') || {};

	const bedwarsLevel = Utils.default0(Utils.traverse(props.player,'achievements.bedwars_level'));

	const ratios = {
		kd : Utils.ratio(json.kills_bedwars,json.deaths_bedwars),
		fkd : Utils.ratio(json.final_kills_bedwars,json.final_deaths_bedwars),
		wl : Utils.ratio(json.wins_bedwars,json.losses_bedwars),
		bbl : Utils.ratio(json.beds_broken_bedwars,json.beds_lost_bedwars)
	}
	
	function getPrestige() {
		const prestige = bedwarsConstants.PRESTIGE;
		for (const [k, c, n] of prestige.slice().reverse()) {
			if (k <= parseInt(bedwarsLevel)) return {color: c, name: n}
		}
	}

	function getMostPlayedMode() {
		const modes = bedwarsConstants.MODES;
		let mostPlayed = null;
		let mostPlays = 0;
		for (const mode of modes) {
			const [id, name] = mode;
			const plays = Utils.default0(json[`${id}_wins_bedwars`]) + Utils.default0(json[`${id}_losses_bedwars`])
			if (plays > mostPlays) {
				mostPlays = plays;
				mostPlayed = name;
			}
		}
		return mostPlayed;
	}

	function renderTableBody() {
		const modes = bedwarsConstants.MODES;
		const dreamsStartAt = 'eight_one_rush';
		const mostPlayed = getMostPlayedMode();

		let rowList = [];
		for (const mode of modes) {
			const [id, name] = mode;
			if (id === dreamsStartAt) {
				rowList.push(
					<tr key="dreams"><th><div className="mt-2">Dreams Mode</div></th></tr>
					);
			}
			rowList.push(
				<tr key={id} className={name === mostPlayed ? 'c-pink' : ''}>
					<td>{name}</td>
					<td>{Utils.formatNum(json[`${id}_kills_bedwars`])}</td>
					<td>{Utils.formatNum(json[`${id}_deaths_bedwars`])}</td>
					<td>{Utils.formatNum(Utils.ratio(json[`${id}_kills_bedwars`],json[`${id}_deaths_bedwars`]))}</td>
					<td>{Utils.formatNum(json[`${id}_final_kills_bedwars`])}</td>
					<td>{Utils.formatNum(json[`${id}_final_deaths_bedwars`])}</td>
					<td>{Utils.formatNum(Utils.ratio(json[`${id}_final_kills_bedwars`],json[`${id}_final_deaths_bedwars`]))}</td>
					<td>{Utils.formatNum(json[`${id}_wins_bedwars`])}</td>
					<td>{Utils.formatNum(json[`${id}_losses_bedwars`])}</td>
					<td>{Utils.formatNum(Utils.ratio(json[`${id}_wins_bedwars`],json[`${id}_losses_bedwars`]))}</td>
					<td>{Utils.formatNum(json[`${id}_beds_broken_bedwars`])}</td>
					<td>{Utils.formatNum(Utils.ratio(json[`${id}_beds_broken_bedwars`],json[`${id}_beds_lost_bedwars`]))}</td>
				</tr>
				);
		}
		return rowList;
	}

	const header = (
		<React.Fragment>
			<Box title="Level">{`§${getPrestige().color}[${bedwarsLevel}☆]`}</Box>
			<Box title="WS">{Utils.default0(json.winstreak)}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="FKD">{ratios.fkd}</Box>
			<Box title="WL">{ratios.wl}</Box>
			<Box title="BBL">{ratios.bbl}</Box>
		</React.Fragment>
		);


	return (
		<Ribbon title="Bedwars" header={header} index={props.index}>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Stat title="Level">{bedwarsLevel}</Stat>
					<Stat title="Prestige">{`${getPrestige().name}`}</Stat>
					<Stat title="Coins">{json.coins}</Stat>
					<br/>
					<Stat title="Winstreak">{json.winstreak}</Stat>
					<Stat title="Wins">{json.wins_bedwars}</Stat>
					<Stat title="Losses">{json.losses_bedwars}</Stat>
					<Stat title="Win/Loss Ratio">{ratios.wl}</Stat>
					<br/>
					<Stat title="Beds Broken">{json.beds_broken_bedwars}</Stat>
					<Stat title="Beds Lost">{json.beds_lost_bedwars}</Stat>
					<Stat title="Beds Broken/Lost Ratio">{ratios.bbl}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Kills">{json.kills_bedwars}</Stat>
					<Stat title="Deaths">{json.deaths_bedwars}</Stat>
					<Stat title="Kill/Death Ratio">{ratios.kd}</Stat>
					<Stat title="Final Kills">{json.final_kills_bedwars}</Stat>
					<Stat title="Final Deaths">{json.final_deaths_bedwars}</Stat>
					<Stat title="Final Kill/Death Ratio">{ratios.fkd}</Stat>
					<br/>
					<Stat title="Iron Collected">{json.iron_resources_collected_bedwars}</Stat>
					<Stat title="Gold Collected">{json.gold_resources_collected_bedwars}</Stat>
					<Stat title="Diamonds Collected">{json.diamond_resources_collected_bedwars}</Stat>
					<Stat title="Emeralds Collected">{json.emerald_resources_collected_bedwars}</Stat>
					<Stat title="Wrapped Presents Collected">{json.wrapped_present_resources_collected_bedwars}</Stat>
				</div>
			</div>
			<div className="stats-separator mb-3"></div>
			<table className="mb-3">
				<thead>
					<tr>
						<th>Mode</th>
						<th>Kills</th>
						<th>Deaths</th>
						<th>KD</th>
						<th>Kills</th>
						<th>Deaths</th>
						<th>KD</th>
						<th>Wins</th>
						<th>Losses</th>
						<th>WL</th>
						<th>Beds Broken</th>
						<th>BBL</th>
					</tr>
				</thead>
				<tbody>
					{renderTableBody()}
				</tbody>
			</table>
			<div className="stats-separator mb-3"></div>
			<div className="h-flex mb-2">
				<div className="flex-1">
					<Stat title="Times Drowned">{json.drowning_deaths_bedwars}</Stat>
					<Stat title="Deaths to Fire">{Utils.default0(json.fire_tick_deaths_bedwars)+Utils.default0(json.fire_deaths_bedwars)}</Stat>
					<Stat title="Deaths to Suffocation">{Utils.default0(json.suffocation_deaths_bedwars)+Utils.default0(json.suffocation_final_deaths_bedwars)}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Loot Chests">{json.bedwars_boxes}</Stat>
					<Stat title="Total Shop Purchases">{json._items_purchased_bedwars}</Stat>
				</div>
			</div>
		</Ribbon>
		);
}