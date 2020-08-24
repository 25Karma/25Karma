import React from 'react';
import { Accordion, Box, Progress, 
	ProgressBar, StatCell, StatPair, StatRow } from 'components';
import { SPEEDUHC as consts } from 'constants/hypixel';
import { useHypixelContext } from 'hooks';
import * as Utils from 'utils';
import { HypixelLeveling } from 'utils/hypixel';

/*
* Stats accordion for Speed UHC
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export const SpeedUHC = React.memo((props) => {

	// The player's API data for Speed UHC
	const { player } = useHypixelContext();
	const json = Utils.traverse(player,'stats.SpeedUHC') || {};
	
	const leveling = new HypixelLeveling(scoreToStar, starToScore, Utils.default0(json.score));
	if (leveling.levelCeiling > 10) leveling.levelCeiling = 10;
	const title = getTitle(leveling.levelFloor);
	const ratios = {
		kd : Utils.ratio(json.kills, json.deaths),
		wl : Utils.ratio(json.wins, json.losses),
	}

	const mostPlayedMode = (() => {
		let mostPlayed = null;
		let mostPlays = 0;
		for (const mode of consts.MODES) {
			const plays = Utils.default0(json[`wins${mode.id}`]) + Utils.default0(json[`losses${mode.id}`])
			if (plays > mostPlays && mode.id) {
				mostPlays = plays;
				mostPlayed = mode.name;
			}
		}
		return mostPlayed;
	})();

	function scoreToStar(score) {
		const title = consts.TITLES;
		for(let i = 0; i < title.length; i++) {
			if(score < title[i].value) {
				return i + (score - title[i-1].value) / (title[i].value - title[i-1].value);
			}
		}
	}

	function starToScore(star) {
		return consts.TITLES[star-1].value;	
	}

	function getTitle(star) {
		return consts.TITLES[star-1].name;
	}

	const header = (
		<React.Fragment>
			<Box title="Star" color="pink">{`[${leveling.levelFloor}❋]`}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{json.wins}</Box>
			<Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
		);

	const progressBar = (() => {
		let levelingProgressProps = {
			proportion: leveling.xp / starToScore(leveling.levelCeiling),
			color: 'white',
			dataTip: `${Utils.formatNum(leveling.xp)}/${Utils.formatNum(starToScore(leveling.levelCeiling))} Score`
		}
		if (leveling.levelFloor === 10) {
			levelingProgressProps = {
					proportion: 1,
					color: 'white',
					dataTip: `${Utils.formatNum(leveling.xp)}/${Utils.formatNum(starToScore(10))} Score`
				}
		}
		return (
			<React.Fragment>
				<div className="flex-1">
					<ProgressBar {...levelingProgressProps}>
						<Progress {...levelingProgressProps} />
					</ProgressBar>
				</div>
				<span className="px-1 c-white">
					{getTitle(leveling.levelCeiling)}
				</span>
			</React.Fragment>
			);
	})();

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
				</tr>
			</thead>
			<tbody>
			{
				consts.MODES.map(({id, name}) =>
					Boolean(Utils.add(json[`wins${id}`], json[`deaths${id}`])) &&
					<StatRow key={id} id={id} isHighlighted={name === mostPlayedMode}>
						<StatCell>{name}</StatCell>
						<StatCell>{json[`kills${id}`]}</StatCell>
						<StatCell>{json[`deaths${id}`]}</StatCell>
						<StatCell>{Utils.ratio(json[`kills${id}`],json[`deaths${id}`])}</StatCell>
						<StatCell>{json[`wins${id}`]}</StatCell>
						<StatCell>{json[`losses${id}`]}</StatCell>
						<StatCell>{Utils.ratio(json[`wins${id}`],json[`losses${id}`])}</StatCell>
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
			<div className="my-3">
				<div className="mb-1 font-bold">Title Progress</div>
				<div className="h-flex">
					{progressBar}
				</div>
			</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<StatPair title="Score">{json.score}</StatPair>
					<StatPair title="Title" color="white">{title}</StatPair>
					<StatPair title="Coins" color="gold">{json.coins}</StatPair>
					<StatPair title="Salt">{json.salt}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Kills">{json.kills}</StatPair>
					<StatPair title="Deaths">{json.deaths}</StatPair>
					<StatPair title="Kill/Death Ratio">{ratios.kd}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Wins">{json.wins}</StatPair>
					<StatPair title="Losses">{json.losses}</StatPair>
					<StatPair title="Win/Loss Ratio">{ratios.wl}</StatPair>
					<StatPair title="Winstreak">{json.winstreak}</StatPair>
				</div>
			</div>
			<div className="overflow-x mb-3">
				{table}
			</div>
		</Accordion>
});