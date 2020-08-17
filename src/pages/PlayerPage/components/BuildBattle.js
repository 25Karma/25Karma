import React from 'react';
import { Accordion, Box, Progress, ProgressBar, StatCell, StatPair } from 'components';
import * as Utils from 'utils';

/*
* Stats accordion for Build Battle
*
* @param {Object} props.player 	Player data in JSON object
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export function BuildBattle(props) {

	const consts = {
		TITLE: 'Build Battle',
		MODES: [
			{id: '_solo_normal', name: 'Solo'},
			{id: '_teams_normal', name: 'Teams'},
			{id: '_guess_the_build', name: 'Guess the Build'},
			{id: '_solo_pro', name: 'Pro'},
			{id: '', name: <div className="font-bold mt-2">Overall</div>},
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
			<Box title="Title" color={titleColor}>{title}</Box>
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
					Boolean(json[`wins${mode.id}`]) &&
					<tr key={mode.id}>
						<StatCell>{mode.name}</StatCell>
						<StatCell>{json[`wins${mode.id}`]}</StatCell>
					</tr>
					)
			}
			</tbody>
		</table>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="mb-1 font-bold">Title Progress</div>
			<div className="h-flex mb-3">
				{progressBar}
			</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<StatPair title="Score">{json.score}</StatPair>
					<StatPair title="Title" color={titleColor}>{title}</StatPair>
					<StatPair title="Coins" color="gold">{json.coins}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Wins">{json.wins}</StatPair>
					<StatPair title="Losses">{losses}</StatPair>
					<StatPair title="Win/Loss Ratio">{Utils.ratio(json.wins/losses)}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Correct Guesses">{json.correct_guesses}</StatPair>
					<StatPair title="Super Votes">{json.super_votes}</StatPair>
				</div>
			</div>
			<div className="accordion-separator mb-3"></div>
			<div className="overflow-x">
				{table}
			</div>
		</Accordion>
}