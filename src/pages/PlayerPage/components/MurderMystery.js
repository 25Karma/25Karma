import React from 'react';
import { Accordion, Box, Stat } from 'components';
import * as Utils from 'utils';

/*
* Stats accordion for Murder Mystery
*
* @param {Object} props.player 	Player data in JSON object
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export function MurderMystery(props) {
	const consts = {
		MODES : [
			{id: 'MURDER_CLASSIC', name: 'Classic'},
			{id: 'MURDER_ASSASSINS', name: 'Assassins'},
			{id: 'MURDER_DOUBLE_UP', name: 'Double Up'},
			{id: 'MURDER_INFECTION', name: 'Infection'},
			{id: 'MURDER_HARDCORE', name: 'Hardcore'},
			{id: 'MURDER_SHOWDOWN', name: 'Showdown'},
		],
		KNIFESKINS: {
			knife_skin_bone : "Big Bone",
			knife_skin_blaze_stick : "Blaze Rod",
			knife_skin_carrot_on_stick : "Carrot on a Stick",
			knife_skin_cheapo : "Cheapo Sword",
			knife_skin_cheese : "Cheese",
			knife_skin_chewed_bush : "Chewed Up Bush",
			knife_skin_easter_basket : "Easter Basket",
			knife_skin_feather : "Feather",
			knife_skin_gold_digger : "Gold Digger",
			knife_skin_apple : "Healthy Treat",
			undefined : "Iron Sword",
			knife_skin_diamond_shovel : "Only the Best",
			knife_skin_mouse_trap : "Mouse Trap",
			knife_skin_mvp : "MVP Diamond Sword",
			knife_skin_prickly : "Prickly",
			knife_skin_pumpkin_pie : "Pumpkin Pie",
			random_cosmetic : "Random",
			knife_skin_scythe : "Reaper Scythe",
			knife_skin_rudolphs_snack : "Rudolph's Favourite Snack",
			knife_skin_rudolphs_nose : "Rudolph's Nose",
			knife_skin_salmon : "Salmon",
			knife_skin_shears : "Shears",
			knife_skin_shovel : "Shovel",
			knife_skin_shiny_snack : "Sparkly Snack",
			knife_skin_stake : "Stake",
			knife_skin_stick : "Stick",
			knife_skin_stick_with_hat : "Stick with a Hat",
			knife_skin_sweet_treat : "Sweet Treat",
			knife_skin_timber : "Timber",
			knife_skin_vip : "VIP Gold Sword",
			knife_skin_wood_axe : "Wood Axe",
		},
	}

	// The player's API data for Murder Mystery
	const json = Utils.traverse(props.player,'stats.MurderMystery') || {};
	const losses = Utils.default0(json.games)-Utils.default0(json.wins);
	const knifeSkin = consts.KNIFESKINS[json.active_knife_skin];
	const fastestDetectiveWin = json.quickest_detective_win_time_seconds;
	const fastestMurdererWin = json.quickest_murderer_win_time_seconds;
	console.log(json.active_knife_skin)

	const mostPlayedMode = (() => {
		let mostPlayed = null;
		let mostPlays = 0;
		for (const mode of consts.MODES) {
			const plays = Utils.default0(json[`games_${mode.id}`]);
			if (plays > mostPlays) {
				mostPlays = plays;
				mostPlayed = mode.name;
			}
		}
		return mostPlayed;
	})();
	
	const header = (
		<React.Fragment>
			<Box title="Wins">{json.wins}</Box>
			<Box title="Kills as Murderer">{json.kills_as_murderer}</Box>
		</React.Fragment>
		);

	const table = (() => {
		const legacyStartsAt = 'MURDER_HARDCORE';
		let rowList = [];
		for (const mode of consts.MODES) {
			if (mode.id === legacyStartsAt) {
				rowList.push(
					<tr key="legacy"><th><div className="mt-2">Legacy Modes</div></th></tr>
					);
			}
			rowList.push(
				json[`games_${mode.id}`] &&
				<tr key={mode.id} className={mode.name === mostPlayedMode ? 'c-pink' : ''}>
					<td>{mode.name}</td>
					<td>{Utils.formatNum(json[`wins_${mode.id}`])}</td>
					<td>{Utils.formatNum(json[`kills_${mode.id}`])}</td>
					<td>{Utils.formatNum(json[`bow_kills_${mode.id}`])}</td>
					<td>{Utils.formatNum(json[`knife_kills_${mode.id}`])}</td>
					<td>{Utils.formatNum(json[`thrown_knife_kills_${mode.id}`])}</td>
				</tr>
				);
		}
		return (
			<table>
				<thead>
					<tr>
						<th>Mode</th>
						<th>Wins</th>
						<th>Kills</th>
						<th>Bow Kills</th>
						<th>Knife Kills</th>
						<th>Thrown Knife Kills</th>
					</tr>
				</thead>
				<tbody>
					{rowList}
				</tbody>
			</table>
			);
	})();

	return (
		<Accordion title="Murder Mystery" header={header} index={props.index}>
			<Stat title="Coins" color="gold">{json.coins}</Stat>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Stat title="Kills">{json.kills}</Stat>
					<Stat title="Kills as Murderer">{json.kills_as_murderer}</Stat>
					<Stat title="Thrown Knife Kills">{json.thrown_knife_kills}</Stat>
					<Stat title="Deaths">{json.deaths}</Stat>
					<Stat title="Murder Weapon" color="red">{knifeSkin || '<unknown>'}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Wins">{json.wins}</Stat>
					<Stat title="Losses">{losses}</Stat>
					<Stat title="Win/Loss Ratio">{Utils.ratio(json.wins/losses)}</Stat>
					<Stat title="Fastest Detective Win">{fastestDetectiveWin ? fastestDetectiveWin+'s' : '-'}</Stat>
					<Stat title="Fastest Murderer Win">{fastestMurdererWin ? fastestMurdererWin+'s' : '-'}</Stat>
				</div>
			</div>
			<div className="accordion-separator mb-3"></div>
			<div className="overflow-x mb-3">
				{table}
			</div>
		</Accordion>
		);
}