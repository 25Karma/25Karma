import React from 'react';
import { Box, Progress, ProgressBar, Stat } from 'components';
import { Ribbon } from 'components/Ribbon';
import * as Utils from 'utils';

export function BuildBattle(props) {

	const consts = {
		MODES : [
			['solo_normal', 'Solo'],
			['teams_normal', 'Teams'],
			['guess_the_build', 'Red vs. Blue'],
			['solo_pro', 'Pro'],
		],
		STARS: [
			[0, 'Rookie', 'white'],
			[100, 'Untrained', 'gray'],
			[250, 'Amateur', 'yellow'],
			[500, 'Apprentice', 'green'],
			[1000, 'Experienced', 'pink'],
			[2000, 'Seasoned', 'blue'],
			[3500, 'Trained', 'darkgreen'],
			[5000, 'Skilled', 'darkaqua'],
			[7500, 'Talented', 'red'],
			[10000, 'Professional', 'purple'],
			[15000, 'Expert', 'darkblue'],
			[20000, 'Master', 'darkred'],
			[Infinity, null, null]
		],
	}

	// Get the player's API data for SkyWars
	const json = Utils.traverse(props.player,'stats.BuildBattle') || {};
	const losses = Utils.default0(json.games_played) - Utils.default0(json.wins);
	const leveling = new Utils.HypixelLeveling(scoreToStar, starToScore, Utils.default0(json.score));
	if (leveling.levelCeiling > 12) leveling.levelCeiling = 12;
	const title = getTitle(leveling.levelFloor).name;
	const titleColor = getTitle(leveling.levelFloor).color;
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
	console.log(json)

	function scoreToStar(score) {
		const stars = consts.STARS;
		for(let i = 0; i < stars.length; i++) {
			if(score < stars[i][0]) {
				return i + (score - stars[i-1][0]) / (stars[i][0] - stars[i-1][0]);
			}
		}
	}

	function starToScore(star) {
		return consts.STARS[star-1][0];	
	}

	function getTitle(star) {
		return {
			name: consts.STARS[star-1][1],
			color: consts.STARS[star-1][2]
		}
	}

	const tableBody = (() => {
		const modes = consts.MODES;

		const mostPlayed = 'x';//getMostPlayedMode();

		return modes.map(mode => {
			const [id, name] = mode;
			return (
				<tr key={id} className={name === mostPlayed ? 'c-pink' : ''}>
					<td>{name}</td>
					<td>{Utils.formatNum(json[`wins_${id}`])}</td>
				</tr>
				);
		})
	})();
		
	const header = (
		<React.Fragment>
			<Box title="Title">{`${Utils.toColorCode(titleColor)}${title}`}</Box>
			<Box title="Wins">{json.wins}</Box>
		</React.Fragment>
		);

	return (
		<Ribbon title="Build Battle" header={header} index={props.index}>
			<div className="mb-1 font-bold">Title Progress</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<ProgressBar {...levelingProgressProps}>
						<Progress {...levelingProgressProps} />
					</ProgressBar>
				</div>
				<span className={`px-1 c-${getTitle(leveling.levelCeiling).color}`}>
					{getTitle(leveling.levelCeiling).name}
				</span>
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
			<div className="stats-table mb-2">
				<table>
					<thead>
						<tr>
							<th>Mode</th>
							<th>Wins</th>
						</tr>
					</thead>
					<tbody>
						{tableBody}
					</tbody>
				</table>
			</div>
		</Ribbon>
		);
}