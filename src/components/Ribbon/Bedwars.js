import React from 'react';
import { Box, Progress, ProgressBar,Stat } from 'components';
import { Ribbon } from 'components/Ribbon';
import * as Utils from 'utils';

/*
* Stats ribbon for Bedwars
*
* @param {Object} props.player Player data in JSON object
* @param {number} props.index The order in which to display the row (used by react-beautiful-dnd)
*/
export function Bedwars(props) {

	const consts = {
		EASY_XP: [500, 1000, 2000, 3500],
		NORMAL_XP: 5000,
		PRESTIGES : [
			[0, 'gray', 'None'],
			[100, 'white', 'Iron'],
			[200, 'gold', 'Gold'],
			[300, 'aqua', 'Diamond'],
			[400, 'darkgreen', 'Emerald'],
			[500, 'darkaqua', 'Sapphire'],
			[600, 'darkred', 'Ruby'],
			[700, 'pink', 'Crystal'],
			[800, 'blue', 'Opal'],
			[900, 'purple', 'Amethyst'],
			[1000, 'rainbow', 'Rainbow'],
			[2000, 'rainbow', 'Rainbow']
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
	const leveling = new Utils.HypixelLeveling(xpToLevel, levelToXP, 
		Utils.default0(json.Experience) + Utils.default0(json.Experience_new));
	const prestigeColor = getPrestige(leveling.level).color;
	const prestigeName = getPrestige(leveling.level).name;
	const levelingProgressProps = {
		proportion: leveling.proportionAboveLevel,
		color: prestigeColor,
		dataTip: `${Utils.formatNum(leveling.xpAboveLevel)}/${Utils.formatNum(leveling.levelTotalXP)} XP`
	}
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
		const prestiges = consts.PRESTIGES;
		for (const [l, c, n] of prestiges.slice().reverse()) {
			if (l <= Math.floor(level)) return {color: c, name: n}
		}
	}

	const mostPlayedMode = (() => {
		const modes = consts.MODES;
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
	})();

	const tableBody = (() => {
		const modes = consts.MODES;
		const dreamsStartAt = 'eight_one_rush';

		let rowList = [];
		for (const mode of modes) {
			const [id, name] = mode;
			if (id === dreamsStartAt) {
				rowList.push(
					<tr key="dreams"><th><div className="mt-2">Dreams Mode</div></th></tr>
					);
			}
			rowList.push(
				<tr key={id} className={name === mostPlayedMode ? 'c-pink' : ''}>
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
	})();

	const header = (
		<React.Fragment>
			<Box title="Level">{`${Utils.toColorCode(prestigeColor)}[${leveling.levelFloor}☆]`}</Box>
			<Box title="WS">{json.winstreak}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="FKD">{ratios.fkd}</Box>
			<Box title="WL">{ratios.wl}</Box>
			<Box title="BBL">{ratios.bbl}</Box>
		</React.Fragment>
		);


	return (
		<Ribbon title="Bedwars" header={header} index={props.index}>
			<div className="mb-1 font-bold">Leveling Progress</div>
			<div className="h-flex mb-3">
				<span className={`px-1 c-${getPrestige(leveling.levelFloor).color}`}>
					{leveling.levelFloor}
				</span>
				<div className="flex-1">
					<ProgressBar {...levelingProgressProps}>
						<Progress {...levelingProgressProps} />
					</ProgressBar>
				</div>
				<span className={`px-1 c-${getPrestige(leveling.levelCeiling).color}`}>
					{leveling.levelCeiling}
				</span>
			</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Stat title="Level">{leveling.level}</Stat>
					<Stat title="Prestige">
						<span className={`c-${prestigeColor}`}>
							{`${prestigeName}`}
						</span>
					</Stat>
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
					{tableBody}
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