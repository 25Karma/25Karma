import React from 'react';
import { Accordion, Box, Progress, ProgressBar, Stat } from 'components';
import * as Utils from 'utils';

/*
* Stats accordion for Speed UHC
*
* @param {Object} props.player 	Player data in JSON object
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export function SpeedUHC(props) {

	const consts = {
		MODES : [
		{id: 'solo_normal', name: 'Solo Normal'},
		{id: 'solo_insane', name: 'Solo Insane'},
		{id: 'team_normal', name: 'Teams Normal'},
		{id: 'team_insane', name: 'Teams Insane'},
		],
		TITLES: [
			{value: 0, name: 'Hiker'},
			{value: 50, name: 'Jogger'},
			{value: 300, name: 'Runner'},
			{value: 1050, name: 'Sprinter'},
			{value: 2560, name: 'Turbo'},
			{value: 5550, name: 'Sanic'},
			{value: 15550, name: 'Hot Rod'},
			{value: 30550, name: 'Bolt'},
			{value: 55550, name: 'Zoom'},
			{value: 85550, name: 'God Speed'},
			{value: Infinity, name: null}
		],
	}

	// The player's API data for Speed UHC
	const json = Utils.traverse(props.player,'stats.SpeedUHC') || {};
	console.log(json)
	const leveling = new Utils.HypixelLeveling(scoreToStar, starToScore, Utils.default0(json.score));
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
			const plays = Utils.default0(json[`wins_${mode.id}`]) + Utils.default0(json[`losses_${mode.id}`])
			if (plays > mostPlays) {
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
			<Box title="Star">{`${Utils.toColorCode('pink')}[${leveling.levelFloor}❋]`}</Box>
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
				consts.MODES.map(mode =>
					Utils.default0(json[`wins_${mode.id}`]) + Utils.default0(json[`deaths_${mode.id}`]) > 0 &&
					<tr key={mode.id} className={mode.name === mostPlayedMode ? 'c-pink' : ''}>
						<td>{mode.name}</td>
						<td>{Utils.formatNum(json[`kills_${mode.id}`])}</td>
						<td>{Utils.formatNum(json[`deaths_${mode.id}`])}</td>
						<td>{Utils.formatNum(Utils.ratio(json[`kills_${mode.id}`],json[`deaths_${mode.id}`]))}</td>
						<td>{Utils.formatNum(json[`wins_${mode.id}`])}</td>
						<td>{Utils.formatNum(json[`losses_${mode.id}`])}</td>
						<td>{Utils.formatNum(Utils.ratio(json[`wins_${mode.id}`],json[`losses_${mode.id}`]))}</td>
					</tr>
					)
			}
			</tbody>
		</table>
		);

	return (
		<Accordion title="Speed UHC" header={header} index={props.index}>
			<div className="mb-1 font-bold">Title Progress</div>
			<div className="h-flex mb-3">
				{progressBar}
			</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Stat title="Score">{json.score}</Stat>
					<Stat title="Title" color="white">{title}</Stat>
					<Stat title="Coins" color="gold">{json.coins}</Stat>
					<Stat title="Salt">{json.salt}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Kills">{json.kills}</Stat>
					<Stat title="Deaths">{json.deaths}</Stat>
					<Stat title="Kill/Death Ratio">{ratios.kd}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Wins">{json.wins}</Stat>
					<Stat title="Losses">{json.losses}</Stat>
					<Stat title="Win/Loss Ratio">{ratios.wl}</Stat>
					<Stat title="Winstreak">{json.winstreak}</Stat>
				</div>
			</div>
			<div className="overflow-x mb-2">
				{table}
			</div>
		</Accordion>
		);
}