import React from 'react';
import { Accordion, Box, HorizontalLine, StatCell, 
	StatPair, StatRow } from 'components';
import { useHypixelContext } from 'hooks';
import * as Utils from 'utils';

/*
* Stats accordion for Murder Mystery
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export function MurderMystery(props) {
	const consts = {
		TITLE: 'Murder Mystery',
		MODES: [
			{id: '_MURDER_CLASSIC', name: 'Classic'},
			{id: '_MURDER_ASSASSINS', name: 'Assassins'},
			{id: '_MURDER_DOUBLE_UP', name: 'Double Up'},
			{id: '_MURDER_INFECTION', name: 'Infection'},
			{id: '_MURDER_HARDCORE', name: 'Hardcore'},
			{id: '_MURDER_SHOWDOWN', name: 'Showdown'},
			{id: '', name: 'Overall'},
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
	const { player } = useHypixelContext();
	const json = Utils.traverse(player,'player.stats.MurderMystery') || {};

	const losses = Utils.default0(json.games)-Utils.default0(json.wins);
	const knifeSkin = consts.KNIFESKINS[json.active_knife_skin];
	const fastestDetectiveWin = json.quickest_detective_win_time_seconds;
	const fastestMurdererWin = json.quickest_murderer_win_time_seconds;

	const mostPlayedMode = (() => {
		let mostPlayed = null;
		let mostPlays = 0;
		for (const mode of consts.MODES) {
			const plays = Utils.default0(json[`games${mode.id}`]);
			// The mode.id part is so that the 'Overall' category is ignored_
			if (plays > mostPlays && mode.id) {
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
		for (const {id, name} of consts.MODES) {
			const losses = Utils.default0(json[`games${id}`])-Utils.default0(json[`wins${id}`]);
			if (id === legacyStartsAt) {
				rowList.push(
					<tr key="legacy"><th><div className="mt-2">Legacy Modes</div></th></tr>
					);
			}
			rowList.push(
				Boolean(json[`games${id}`]) &&
				<StatRow key={id} id={id} isHighlighted={name === mostPlayedMode}>
					<StatCell>{name}</StatCell>
					<StatCell>{json[`kills${id}`]}</StatCell>
					<StatCell>{json[`bow_kills${id}`]}</StatCell>
					<StatCell>{json[`knife_kills${id}`]}</StatCell>
					<StatCell>{json[`thrown_knife_kills${id}`]}</StatCell>
					<StatCell>{json[`wins${id}`]}</StatCell>
					<StatCell>{losses}</StatCell>
					<StatCell>{Utils.ratio(json[`wins${id}`], losses)}</StatCell>
				</StatRow>
				);
		}
		return (
			<table>
				<thead>
					<tr>
						<th>Mode</th>
						<th>Kills</th>
						<th>Bow Kills</th>
						<th>Knife Kills</th>
						<th>Thrown Knife Kills</th>
						<th>Wins</th>
						<th>Losses</th>
						<th>WL</th>
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
			<div className="mt-3">
				<StatPair title="Coins" color="gold">{json.coins}</StatPair>
			</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<StatPair title="Kills">{json.kills}</StatPair>
					<StatPair title="Kills as Murderer">{json.kills_as_murderer}</StatPair>
					<StatPair title="Thrown Knife Kills">{json.thrown_knife_kills}</StatPair>
					<StatPair title="Deaths">{json.deaths}</StatPair>
					<StatPair title="Murder Weapon" color="red">{knifeSkin || '<unknown>'}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Wins">{json.wins}</StatPair>
					<StatPair title="Losses">{losses}</StatPair>
					<StatPair title="Win/Loss Ratio">{Utils.ratio(json.wins/losses)}</StatPair>
					<StatPair title="Fastest Detective Win">{fastestDetectiveWin ? fastestDetectiveWin+'s' : '-'}</StatPair>
					<StatPair title="Fastest Murderer Win">{fastestMurdererWin ? fastestMurdererWin+'s' : '-'}</StatPair>
				</div>
			</div>
			
			<HorizontalLine />

			<div className="overflow-x my-3">
				{table}
			</div>
		</Accordion>
}