import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'components';
import { Box, Br, Cell, Pair, Progress, ProgressBar, Row, Table } from 'components/Stats';
import { BEDWARS as consts } from 'constants/hypixel';
import { useAPIContext } from 'hooks';
import * as Utils from 'utils';
import { HypixelLeveling, getMostPlayed } from 'utils/hypixel';

/*
* Stats accordion for Bed Wars
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export const BedWars = memo((props) => {
	
	// The player's API data for Bed Wars
	const { player } = useAPIContext();
	const json = Utils.traverse(player,'stats.Bedwars') || {};

	const leveling = new HypixelLeveling(xpToLevel, levelToXP, 
		Utils.default0(json.Experience) + Utils.default0(json.Experience_new));
	const prestige = getPrestige(leveling.level);
	const ratios = {
		kd : Utils.ratio(json.kills_bedwars,json.deaths_bedwars),
		fkd : Utils.ratio(json.final_kills_bedwars,json.final_deaths_bedwars),
		wl : Utils.ratio(json.wins_bedwars,json.losses_bedwars),
		bbl : Utils.ratio(json.beds_broken_bedwars,json.beds_lost_bedwars)
	}

	const mostPlayedMode = getMostPlayed(consts.MODES,
		({id}) => Utils.add(json[`${id}wins_bedwars`], json[`${id}losses_bedwars`]));

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
		const levelFloor = Math.floor(level);
		const prestige = (() => {
			for (const pres of consts.PRESTIGES.slice().reverse()) {
				if (pres.level <= levelFloor) return pres;
			}
		})();
		const prestigeIcon = (() => {
			for (const icon of consts.PRESTIGE_ICONS.slice().reverse()) {
				if (icon.level <= levelFloor) return icon.symbol;
			}
		})();

		const tag = `[${levelFloor}${prestigeIcon}]`;
		const coloredTag = tag.split('').map((char, index) => {
			const color = prestige.colormap[index];
			return color ? `§${color}${char}` : char;
		}).join('');

		return {tag: coloredTag, ...prestige};
	}

	const header = (
		<React.Fragment>
			<Box title="Level">{prestige.tag}</Box>
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
						color={prestige.color}
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
				<Row key={id} id={id} isHighlighted={id === mostPlayedMode.id}>
					<Cell>{name}</Cell>
					<Cell>{json[`${id}kills_bedwars`]}</Cell>
					<Cell>{json[`${id}deaths_bedwars`]}</Cell>
					<Cell>{Utils.ratio(json[`${id}kills_bedwars`],json[`${id}deaths_bedwars`])}</Cell>

					<Cell>{json[`${id}final_kills_bedwars`]}</Cell>
					<Cell>{json[`${id}final_deaths_bedwars`]}</Cell>
					<Cell>{Utils.ratio(json[`${id}final_kills_bedwars`],json[`${id}final_deaths_bedwars`])}</Cell>

					<Cell>{json[`${id}wins_bedwars`]}</Cell>
					<Cell>{json[`${id}losses_bedwars`]}</Cell>
					<Cell>{Utils.ratio(json[`${id}wins_bedwars`],json[`${id}losses_bedwars`])}</Cell>
					<Cell>{json[`${id}winstreak`]}</Cell>

					<Cell>{json[`${id}beds_broken_bedwars`]}</Cell>
					<Cell>{json[`${id}beds_lost_bedwars`]}</Cell>
					<Cell>{Utils.ratio(json[`${id}beds_broken_bedwars`],json[`${id}beds_lost_bedwars`])}</Cell>
				</Row>
				);
		}
		return (
			<Table>
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
						<th>WS</th>
						<th>BB</th>
						<th>BL</th>
						<th>BBL</th>
					</tr>
				</thead>
				<tbody>
					{rowList}
				</tbody>
			</Table>
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
					<Pair title="Level">{leveling.level}</Pair>
					<Pair title="Prestige" color={prestige.color}>{prestige.name}</Pair>
					<Pair title="Coins" color="gold">{json.coins}</Pair>
					<Br/>
					<Pair title="Winstreak">{json.winstreak}</Pair>
					<Pair title="Wins">{json.wins_bedwars}</Pair>
					<Pair title="Losses">{json.losses_bedwars}</Pair>
					<Pair title="Win/Loss Ratio">{ratios.wl}</Pair>
					<Br/>
					<Pair title="Beds Broken">{json.beds_broken_bedwars}</Pair>
					<Pair title="Beds Lost">{json.beds_lost_bedwars}</Pair>
					<Pair title="Beds Broken/Lost Ratio">{ratios.bbl}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Kills">{json.kills_bedwars}</Pair>
					<Pair title="Deaths">{json.deaths_bedwars}</Pair>
					<Pair title="Kill/Death Ratio">{ratios.kd}</Pair>
					<Pair title="Final Kills">{json.final_kills_bedwars}</Pair>
					<Pair title="Final Deaths">{json.final_deaths_bedwars}</Pair>
					<Pair title="Final Kill/Death Ratio">{ratios.fkd}</Pair>
					<Br/>
					<Pair title="Iron Collected">{json.iron_resources_collected_bedwars}</Pair>
					<Pair title="Gold Collected">{json.gold_resources_collected_bedwars}</Pair>
					<Pair title="Diamonds Collected">{json.diamond_resources_collected_bedwars}</Pair>
					<Pair title="Emeralds Collected">{json.emerald_resources_collected_bedwars}</Pair>
					<Pair title="Wrapped Presents Collected">{json.wrapped_present_resources_collected_bedwars}</Pair>
				</div>
			</div>
			
			<HorizontalLine />

			<div className="overflow-x my-3">
				{table}
			</div>
			
			<HorizontalLine />

			<div className="h-flex my-3">
				<div className="flex-1">
					<Pair title="Times Drowned">{json.drowning_deaths_bedwars}</Pair>
					<Pair title="Deaths to Fire">{Utils.default0(json.fire_tick_deaths_bedwars)+Utils.default0(json.fire_deaths_bedwars)}</Pair>
					<Pair title="Deaths to Suffocation">{Utils.default0(json.suffocation_deaths_bedwars)+Utils.default0(json.suffocation_final_deaths_bedwars)}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Loot Chests">{json.bedwars_boxes}</Pair>
					<Pair title="Total Shop Purchases">{json._items_purchased_bedwars}</Pair>
				</div>
			</div>
		</Accordion>
});