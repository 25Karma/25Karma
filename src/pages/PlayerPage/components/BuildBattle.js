import React from 'react';
import { Box, Progress, ProgressBar, Stat } from 'components';
import { Ribbon } from 'components/Ribbon';
import * as Utils from 'utils';

/*
* Stats ribbon for Build Battle
*
* @param {Object} props.player 	Player data in JSON object
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export function BuildBattle(props) {

	const consts = {
		MODES : [
			{id: 'solo_normal', name: 'Solo'},
			{id: 'teams_normal', name: 'Teams'},
			{id: 'guess_the_build', name: 'Red vs. Blue'},
			{id: 'solo_pro', name: 'Pro'},
		],
		STARS: [
			{value: 0, name: 'Rookie', color: 'white'},
			{value: 100, name: 'Untrained', color: 'gray'},
			{value: 250, name: 'Amateur', color: 'yellow'},
			{value: 500, name: 'Apprentice', color: 'green'},
			{value: 1000, name: 'Experienced', color: 'pink'},
			{value: 2000, name: 'Seasoned', color: 'blue'},
			{value: 3500, name: 'Trained', color: 'darkgreen'},
			{value: 5000, name: 'Skilled', color: 'darkaqua'},
			{value: 7500, name: 'Talented', color: 'red'},
			{value: 10000, name: 'Professional', color: 'purple'},
			{value: 15000, name: 'Expert', color: 'darkblue'},
			{value: 20000, name: 'Master', color: 'darkred'},
			{value: Infinity, name: null, color: null}
		],
	}

	// Get the player's API data for SkyWars
	const json = Utils.traverse(props.player,'stats.BuildBattle') || {};
	const losses = Utils.default0(json.games_played) - Utils.default0(json.wins);
	const leveling = new Utils.HypixelLeveling(scoreToStar, starToScore, Utils.default0(json.score));
	if (leveling.levelCeiling > 12) leveling.levelCeiling = 12;
	const title = getTitle(leveling.levelFloor).name;
	const titleColor = getTitle(leveling.levelFloor).color;

	function scoreToStar(score) {
		const stars = consts.STARS;
		for(let i = 0; i < stars.length; i++) {
			if(score < stars[i].value) {
				return i + (score - stars[i-1].value) / (stars[i].value - stars[i-1].value);
			}
		}
	}

	function starToScore(star) {
		return consts.STARS[star-1].value;	
	}

	function getTitle(star) {
		return {
			name: consts.STARS[star-1].name,
			color: consts.STARS[star-1].color
		}
	}

	const header = (
		<React.Fragment>
			<Box title="Title">{`${Utils.toColorCode(titleColor)}${title}`}</Box>
			<Box title="Wins">{json.wins}</Box>
		</React.Fragment>
		);

	const progressBar = (() => {
		let levelingProgressProps = {
			proportion: leveling.xp / starToScore(leveling.levelCeiling),
			color: titleColor,
			dataTip: `${Utils.formatNum(leveling.xp)}/${Utils.formatNum(starToScore(leveling.levelCeiling))} Score`
		}
		if (leveling.levelFloor === 12) {
			levelingProgressProps = {
					proportion: 1,
					color: titleColor,
					dataTip: `${Utils.formatNum(leveling.xp)}/${Utils.formatNum(starToScore(12))} Score`
				}
		}
		return (
			<React.Fragment>
				<div className="flex-1">
					<ProgressBar {...levelingProgressProps}>
						<Progress {...levelingProgressProps} />
					</ProgressBar>
				</div>
				<span className={`px-1 c-${getTitle(leveling.levelCeiling).color}`}>
					{getTitle(leveling.levelCeiling).name}
				</span>
			</React.Fragment>
			);
	})();

	const table = (
		<table>
			<thead>
				<tr>
					<th>Mode</th>
					<th>Wins</th>
				</tr>
			</thead>
			<tbody>
			{
				consts.MODES.map(mode => 
					<tr key={mode.id}>
						<td>{mode.name}</td>
						<td>{Utils.formatNum(json[`wins_${mode.id}`])}</td>
					</tr>
					)
			}
			</tbody>
		</table>
		);

	return (
		<Ribbon title="Build Battle" header={header} index={props.index}>
			<div className="mb-1 font-bold">Title Progress</div>
			<div className="h-flex mb-3">
				{progressBar}
			</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Stat title="Score">{json.score}</Stat>
					<Stat title="Title">
						<span className={`c-${titleColor}`}>{title}</span>
					</Stat>
					<Stat title="Coins">{json.coins}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Wins">{json.wins}</Stat>
					<Stat title="Losses">{losses}</Stat>
					<Stat title="Win/Loss Ratio">{Utils.ratio(json.wins/losses)}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Correct Guesses">{json.correct_guesses}</Stat>
					<Stat title="Super Votes">{json.super_votes}</Stat>
				</div>
			</div>
			<div className="stats-separator mb-3"></div>
			<div className="overflow-x mb-2">
				{table}
			</div>
		</Ribbon>
		);
}