import React, { memo } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Accordion, Box, Button, ExternalLink, 
	HorizontalLine, ReactIcon, StatCell, StatPair, StatRow } from 'components';
import { MEGAWALLS as consts } from 'constants/hypixel';
import { useHypixelContext } from 'hooks';
import * as Utils from 'utils';

/*
* Stats accordion for Bed Wars
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export const MegaWalls = memo((props) => {

	const { mojang, player } = useHypixelContext();
	const json = Utils.traverse(player, 'stats.Walls3', {});
	const ratios = {
		kd: Utils.ratio(json.kills, json.deaths),
		fkd: Utils.ratio(json.final_kills, json.final_deaths),
		wl: Utils.ratio(json.wins, json.losses),
	};

	const mostPlayedClass = (() => {
		let mostPlayed = {};
		let mostPlays = 0;
		for (const c of consts.CLASSES) {
			const plays = Utils.add(json[`${c.id}_wins`], json[`${c.id}_losses`])
			if (plays > mostPlays) {
				mostPlays = plays;
				mostPlayed = c;
			}
		}
		return mostPlayed;
	})();

	const mostPlayedMode = (() => {
		let mostPlayed = null;
		let mostPlays = 0;
		for (const mode of consts.MODES) {
			const plays = Utils.default0(json[`wins${mode.id}`]) + Utils.default0(json[`losses${mode.id}`])
			// The mode.id part is so that the 'Overall' category is ignored
			if (plays > mostPlays && mode.id) {
				mostPlays = plays;
				mostPlayed = mode.name;
			}
		}
		return mostPlayed;
	})();

	function classLevels(id) {
		const classData = Utils.traverse(json, `classes.${id}`, {});
		return (
			<React.Fragment>
				<StatCell>{Utils.romanize(Utils.default0(classData.prestige))}</StatCell>
				<StatCell>{classData.enderchest_rows}</StatCell>
			</React.Fragment>
			)
	}

	const header = (
		<React.Fragment>
			<Box title="Main" color={consts.DIFFICULTIES[mostPlayedClass.difficulty]}>{mostPlayedClass.name || '-'}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="FKD">{ratios.fkd}</Box>
			<Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
		);

	const classesTable = (
		<table>
			<thead>
				<tr>
					<th></th>
					<th colSpan="3">Normal</th>
					<th colSpan="3">Final</th>
				</tr>
				<tr>
					<th>Class</th>
					<th>Kills</th>
					<th>Deaths</th>
					<th>KD</th>
					<th>Kills</th>
					<th>Deaths</th>
					<th>KD</th>
					<th>Wins</th>
					<th>Losses</th>
					<th>WL</th>
					<th>Prestige</th>
					<th>Ender Chest</th>
				</tr>
			</thead>
			<tbody>
				{
					consts.CLASSES.map(({id,name,difficulty}) => 
						Boolean(Utils.add(json[`${id}_wins`], json[`${id}_losses`])) &&
						<StatRow key={id} isHighlighted={id === mostPlayedClass.id}>
							<StatCell color={consts.DIFFICULTIES[difficulty]}>{name}</StatCell>
							<StatCell>{json[`${id}_kills`]}</StatCell>
							<StatCell>{json[`${id}_deaths`]}</StatCell>
							<StatCell>{Utils.ratio(json[`${id}_kills`], json[`${id}_deaths`])}</StatCell>
							<StatCell>{json[`${id}_final_kills`]}</StatCell>
							<StatCell>{json[`${id}_final_deaths`]}</StatCell>
							<StatCell>{Utils.ratio(json[`${id}_final_kills`], json[`${id}_final_deaths`])}</StatCell>
							<StatCell>{json[`${id}_wins`]}</StatCell>
							<StatCell>{json[`${id}_losses`]}</StatCell>
							<StatCell>{Utils.ratio(json[`${id}_wins`], json[`${id}_losses`])}</StatCell>
							{classLevels(id)}
						</StatRow>
						)
				}
			</tbody>
		</table>
		);

	const modesTable = (
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
				</tr>
			</thead>
			<tbody>
				{
					consts.MODES.map(({id, name}) => Boolean(Utils.add(json[`kills${id}`], json[`deaths${id}`])) &&
						<StatRow key={id} id={id} isHighlighted={name === mostPlayedMode}>
							<StatCell>{name}</StatCell>
							<StatCell>{json[`kills${id}`]}</StatCell>
							<StatCell>{json[`deaths${id}`]}</StatCell>
							<StatCell>{Utils.ratio(json[`kills${id}`], json[`deaths${id}`])}</StatCell>
							<StatCell>{json[`wins${id}`]}</StatCell>
							<StatCell>{json[`losses${id}`]}</StatCell>
							<StatCell>{Utils.ratio(json[`wins${id}`], json[`losses${id}`])}</StatCell>
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
			<div className="py-3 h-flex">
				<div className="flex-1">
					<StatPair title="Coins" color="gold">{json.coins}</StatPair>
					<StatPair title="Wither Damage Dealt">{Utils.add(json.witherDamage, json.wither_damage)}</StatPair>
					<br />
					<br />
					<StatPair title="Wins">{json.wins}</StatPair>
					<StatPair title="Practice Wins">{json.wins_practice}</StatPair>
					<StatPair title="Losses">{json.losses}</StatPair>
					<StatPair title="Practice Losses">{json.losses_practice}</StatPair>
					<StatPair title="Win/Loss Ratio">{ratios.wl}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Kills">{json.kills}</StatPair>
					<StatPair title="Assists">{json.assists}</StatPair>
					<StatPair title="Deaths">{json.deaths}</StatPair>
					<StatPair title="Kill/Death Ratio">{ratios.kd}</StatPair>
					<br />
					<StatPair title="Final Kills">{json.final_kills}</StatPair>
					<StatPair title="Final Assists">{json.final_assists}</StatPair>
					<StatPair title="Final Deaths">{json.final_deaths}</StatPair>
					<StatPair title="Final Kill/Death Ratio">{ratios.fkd}</StatPair>
				</div>
			</div>
			<div className="pb-3">
				<ExternalLink href={`https://gen.plancke.io/mw/${mojang.username}/2.png`}>
					<Button>
						<span className="font-bold pr-1">Class Skins and Levels</span>
						<ReactIcon icon={FaExternalLinkAlt} size="sm" />
					</Button>
				</ExternalLink>
			</div>

			<HorizontalLine />

			<div className="overflow-x my-3">
				{classesTable}
			</div>

			<HorizontalLine />

			<div className="overflow-x my-3">
				{modesTable}
			</div>
		</Accordion>
})