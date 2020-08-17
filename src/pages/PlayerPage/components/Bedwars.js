import React from 'react';
import { Accordion, Box, Progress, ProgressBar, StatCell, StatPair } from 'components';
import * as Utils from 'utils';

/*
* Stats accordion for Bed Wars
*
* @param {Object} props.player 	Player data in JSON object
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export function Bedwars(props) {

	const consts = {
		TITLE : 'Bed Wars',
		EASY_XP: [500, 1000, 2000, 3500],
		NORMAL_XP: 5000,
		PRESTIGES : [
			{level: 0, color: 'gray', name: 'None'},
			{level: 100, color: 'white', name: 'Iron'},
			{level: 200, color: 'gold', name: 'Gold'},
			{level: 300, color: 'aqua', name: 'Diamond'},
			{level: 400, color: 'darkgreen', name: 'Emerald'},
			{level: 500, color: 'darkaqua', name: 'Sapphire'},
			{level: 600, color: 'darkred', name: 'Ruby'},
			{level: 700, color: 'pink', name: 'Crystal'},
			{level: 800, color: 'blue', name: 'Opal'},
			{level: 900, color: 'purple', name: 'Amethyst'},
			{level: 1000, color: 'rainbow', name: 'Rainbow'},
			{level: 2000, color: 'rainbow', name: 'Rainbow'}
		],
		MODES : [
			{id: 'eight_one_', name: 'Solo'},
			{id: 'eight_two_', name: 'Doubles'},
			{id: 'four_three_', name: '3v3v3v3'},
			{id: 'four_four_', name: '4v4v4v4'},
			{id: 'two_four_', name: '4v4'},
			{id: 'eight_one_rush_', name: 'Rush Solo'},
			{id: 'eight_two_rush_', name: 'Rush Doubles'},
			{id: 'four_four_rush_', name: 'Rush 4v4v4v4'},
			{id: 'eight_one_ultimate_', name: 'Ultimate Solo'},
			{id: 'eight_two_ultimate_', name: 'Ultimate Doubles'},
			{id: 'four_four_ultimate_', name: 'Ultimate 4v4v4v4'},
			{id: 'eight_two_lucky_', name: 'Lucky Doubles'},
			{id: 'four_four_lucky_', name: 'Lucky 4v4v4v4'},
			{id: 'eight_two_voidless_', name: 'Voidless Doubles'},
			{id: 'four_four_voidless_', name: 'Voidless 4v4v4v4'},
			{id: 'eight_two_armed_', name: 'Armed Doubles'},
			{id: 'four_four_armed_', name: 'Armed 4v4v4v4'},
			{id: 'castle_', name: 'Castle'},
			{id: '', name: <div className="font-bold mt-2">Overall</div>},
		],
	};
	
	// The player's API data for Bed Wars
	const json = Utils.traverse(props.player,'stats.Bedwars') || {};
	const leveling = new Utils.HypixelLeveling(xpToLevel, levelToXP, 
		Utils.default0(json.Experience) + Utils.default0(json.Experience_new));
	const prestigeColor = getPrestige(leveling.level).color;
	const prestigeName = getPrestige(leveling.level).name;
	const ratios = {
		kd : Utils.ratio(json.kills_bedwars,json.deaths_bedwars),
		fkd : Utils.ratio(json.final_kills_bedwars,json.final_deaths_bedwars),
		wl : Utils.ratio(json.wins_bedwars,json.losses_bedwars),
		bbl : Utils.ratio(json.beds_broken_bedwars,json.beds_lost_bedwars)
	}

	function xpToLevel(xp) {
		let remainingXP = xp;
		let lvl = 0;
		let deltaXP = consts.EASY_XP[0];
		while(remainingXP > 0) {
			deltaXP = consts.NORMAL_XP;
			if (lvl % 100 < 4) {
				deltaXP = consts.EASY_XP[lvl%100];
			}
			remainingXP -= deltaXP;
			lvl++;
		}
		return lvl + remainingXP/deltaXP;
	}

	function levelToXP(lvl) {
		let xp = 0;
		for (let i = 0; i < lvl; i++) {
			if (i % 100 < 4) {
				xp += consts.EASY_XP[i%100];
			}
			else {
				xp += consts.NORMAL_XP;
			}
		}
		return xp;
	}

	function getPrestige(level) {
		for (const pres of consts.PRESTIGES.slice().reverse()) {
			if (pres.level <= Math.floor(level)) return {color: pres.color, name: pres.name}
		}
	}

	const mostPlayedMode = (() => {
		let mostPlayed = null;
		let mostPlays = 0;
		for (const mode of consts.MODES) {
			const plays = Utils.default0(json[`${mode.id}wins_bedwars`]) + Utils.default0(json[`${mode.id}losses_bedwars`])
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
			<Box title="Level" color={prestigeColor}>{`[${leveling.levelFloor}✫]`}</Box>
			<Box title="WS">{json.winstreak}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="FKD">{ratios.fkd}</Box>
			<Box title="WL">{ratios.wl}</Box>
			<Box title="BBL">{ratios.bbl}</Box>
		</React.Fragment>
		);

	const progressBar = (
		<React.Fragment>
			<span className={`px-1 c-${getPrestige(leveling.levelFloor).color}`}>
				{leveling.levelFloor}
			</span>
			<div className="flex-1">
				<ProgressBar 
					dataTip={`${leveling.xpAboveLevel}/${leveling.levelTotalXP} XP`}>
					<Progress 
						proportion={leveling.proportionAboveLevel}
						color={prestigeColor}
						dataTip={`${leveling.xpAboveLevel}/${leveling.levelTotalXP} XP`} />
				</ProgressBar>
			</div>
			<span className={`px-1 c-${getPrestige(leveling.levelCeiling).color}`}>
				{leveling.levelCeiling}
			</span>
		</React.Fragment>
		)

	const table = (() => {
		const dreamsStartAt = 'eight_one_rush_';
		let rowList = [];
		for (const mode of consts.MODES) {
			if (mode.id === dreamsStartAt) {
				rowList.push(
					<tr key="dreams"><th><div className="mt-2">Dreams Mode</div></th></tr>
					);
			}
			rowList.push(
				Boolean(Utils.add(json[`${mode.id}wins_bedwars`], json[`${mode.id}losses_bedwars`])) &&
				<tr key={mode.id} className={mode.name === mostPlayedMode ? 'c-pink' : ''}>
					<StatCell>{mode.name}</StatCell>
					<StatCell>{json[`${mode.id}kills_bedwars`]}</StatCell>
					<StatCell>{json[`${mode.id}deaths_bedwars`]}</StatCell>
					<StatCell>{Utils.ratio(json[`${mode.id}kills_bedwars`],json[`${mode.id}deaths_bedwars`])}</StatCell>
					<StatCell>{json[`${mode.id}final_kills_bedwars`]}</StatCell>
					<StatCell>{json[`${mode.id}final_deaths_bedwars`]}</StatCell>
					<StatCell>{Utils.ratio(json[`${mode.id}final_kills_bedwars`],json[`${mode.id}final_deaths_bedwars`])}</StatCell>
					<StatCell>{json[`${mode.id}wins_bedwars`]}</StatCell>
					<StatCell>{json[`${mode.id}losses_bedwars`]}</StatCell>
					<StatCell>{Utils.ratio(json[`${mode.id}wins_bedwars`],json[`${mode.id}losses_bedwars`])}</StatCell>
					<StatCell>{json[`${mode.id}beds_broken_bedwars`]}</StatCell>
					<StatCell>{json[`${mode.id}beds_lost_bedwars`]}</StatCell>
					<StatCell>{Utils.ratio(json[`${mode.id}beds_broken_bedwars`],json[`${mode.id}beds_lost_bedwars`])}</StatCell>
				</tr>
				);
		}
		return (
			<table>
				<thead>
					<tr>
						<th></th>
						<th colSpan="3">Normal</th>
						<th colSpan="3">Final</th>
					</tr>
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
						<th>Beds Lost</th>
						<th>BBL</th>
					</tr>
				</thead>
				<tbody>
					{rowList}
				</tbody>
			</table>
			);
	})();

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="mb-1 font-bold">Leveling Progress</div>
			<div className="h-flex mb-3">
				{progressBar}
			</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<StatPair title="Level">{leveling.level}</StatPair>
					<StatPair title="Prestige" color={prestigeColor}>{prestigeName}</StatPair>
					<StatPair title="Coins" color="gold">{json.coins}</StatPair>
					<br/>
					<StatPair title="Winstreak">{json.winstreak}</StatPair>
					<StatPair title="Wins">{json.wins_bedwars}</StatPair>
					<StatPair title="Losses">{json.losses_bedwars}</StatPair>
					<StatPair title="Win/Loss Ratio">{ratios.wl}</StatPair>
					<br/>
					<StatPair title="Beds Broken">{json.beds_broken_bedwars}</StatPair>
					<StatPair title="Beds Lost">{json.beds_lost_bedwars}</StatPair>
					<StatPair title="Beds Broken/Lost Ratio">{ratios.bbl}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Kills">{json.kills_bedwars}</StatPair>
					<StatPair title="Deaths">{json.deaths_bedwars}</StatPair>
					<StatPair title="Kill/Death Ratio">{ratios.kd}</StatPair>
					<StatPair title="Final Kills">{json.final_kills_bedwars}</StatPair>
					<StatPair title="Final Deaths">{json.final_deaths_bedwars}</StatPair>
					<StatPair title="Final Kill/Death Ratio">{ratios.fkd}</StatPair>
					<br/>
					<StatPair title="Iron Collected">{json.iron_resources_collected_bedwars}</StatPair>
					<StatPair title="Gold Collected">{json.gold_resources_collected_bedwars}</StatPair>
					<StatPair title="Diamonds Collected">{json.diamond_resources_collected_bedwars}</StatPair>
					<StatPair title="Emeralds Collected">{json.emerald_resources_collected_bedwars}</StatPair>
					<StatPair title="Wrapped Presents Collected">{json.wrapped_present_resources_collected_bedwars}</StatPair>
				</div>
			</div>
			<div className="accordion-separator mb-3"></div>
			<div className="overflow-x mb-3">
				{table}
			</div>
			<div className="accordion-separator mb-3"></div>
			<div className="h-flex">
				<div className="flex-1">
					<StatPair title="Times Drowned">{json.drowning_deaths_bedwars}</StatPair>
					<StatPair title="Deaths to Fire">{Utils.default0(json.fire_tick_deaths_bedwars)+Utils.default0(json.fire_deaths_bedwars)}</StatPair>
					<StatPair title="Deaths to Suffocation">{Utils.default0(json.suffocation_deaths_bedwars)+Utils.default0(json.suffocation_final_deaths_bedwars)}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Loot Chests">{json.bedwars_boxes}</StatPair>
					<StatPair title="Total Shop Purchases">{json._items_purchased_bedwars}</StatPair>
				</div>
			</div>
		</Accordion>
}