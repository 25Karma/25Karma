import React, { memo } from 'react';
import { Accordion, Box, HorizontalLine, Progress, 
	ProgressBar, StatCell, StatPair, StatRow, StatTable } from 'components';
import { BEDWARS as consts } from 'constants/hypixel';
import { useHypixelContext } from 'hooks';
import * as Utils from 'utils';
import { HypixelLeveling } from 'utils/hypixel';

/*
* Stats accordion for Bed Wars
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export const BedWars = memo((props) => {
	
	// The player's API data for Bed Wars
	const { player } = useHypixelContext();
	const json = Utils.traverse(player,'stats.Bedwars') || {};

	const leveling = new HypixelLeveling(xpToLevel, levelToXP, 
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
		for (const {id, name} of consts.MODES) {
			if (id === dreamsStartAt) {
				rowList.push(
					<tr key="dreams"><th><div className="mt-2">Dreams Mode</div></th></tr>
					);
			}
			rowList.push(
				Boolean(Utils.add(json[`${id}wins_bedwars`], json[`${id}losses_bedwars`])) &&
				<StatRow key={id} id={id} isHighlighted={name === mostPlayedMode}>
					<StatCell>{name}</StatCell>
					<StatCell>{json[`${id}kills_bedwars`]}</StatCell>
					<StatCell>{json[`${id}deaths_bedwars`]}</StatCell>
					<StatCell>{Utils.ratio(json[`${id}kills_bedwars`],json[`${id}deaths_bedwars`])}</StatCell>
					<StatCell>{json[`${id}final_kills_bedwars`]}</StatCell>
					<StatCell>{json[`${id}final_deaths_bedwars`]}</StatCell>
					<StatCell>{Utils.ratio(json[`${id}final_kills_bedwars`],json[`${id}final_deaths_bedwars`])}</StatCell>
					<StatCell>{json[`${id}wins_bedwars`]}</StatCell>
					<StatCell>{json[`${id}losses_bedwars`]}</StatCell>
					<StatCell>{Utils.ratio(json[`${id}wins_bedwars`],json[`${id}losses_bedwars`])}</StatCell>
					<StatCell>{json[`${id}beds_broken_bedwars`]}</StatCell>
					<StatCell>{json[`${id}beds_lost_bedwars`]}</StatCell>
					<StatCell>{Utils.ratio(json[`${id}beds_broken_bedwars`],json[`${id}beds_lost_bedwars`])}</StatCell>
				</StatRow>
				);
		}
		return (
			<StatTable>
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
			</StatTable>
			);
	})();

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="my-3">
				<div className="mb-1 font-bold">Leveling Progress</div>
				<div className="h-flex">
					{progressBar}
				</div>
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
			
			<HorizontalLine />

			<div className="overflow-x my-3">
				{table}
			</div>
			
			<HorizontalLine />

			<div className="h-flex my-3">
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
});