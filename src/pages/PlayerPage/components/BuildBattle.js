import React from 'react';
import { Accordion, Box, HorizontalLine, Progress, 
	ProgressBar, StatCell, StatPair, StatRow } from 'components';
import { BUILDBATTLE as consts } from 'constants/hypixel';
import { useHypixelContext } from 'hooks';
import * as Utils from 'utils';
import { HypixelLeveling } from 'utils/hypixel';

/*
* Stats accordion for Build Battle
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export const BuildBattle = React.memo((props) => {

	// Get the player's API data for SkyWars
	const { player } = useHypixelContext();
	const json = Utils.traverse(player,'player.stats.BuildBattle') || {};
	const losses = Utils.default0(json.games_played) - Utils.default0(json.wins);
	const leveling = new HypixelLeveling(scoreToStar, starToScore, Utils.default0(json.score));
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
				consts.MODES.map(({id, name}) => 
					Boolean(json[`wins${id}`]) &&
					<StatRow key={id} id={id}>
						<StatCell>{name}</StatCell>
						<StatCell>{json[`wins${id}`]}</StatCell>
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
			
			<HorizontalLine />

			<div className="overflow-x py-3">
				{table}
			</div>
		</Accordion>
});