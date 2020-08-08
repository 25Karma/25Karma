import React from 'react';
import { Box, Progress, ProgressBar, Stat } from 'components';
import { Ribbon } from 'components/Ribbon';
import * as Utils from 'utils';

export function UHC(props) {

	const consts = {
		MODES : [
			['_solo', 'Solo'],
			['', 'Teams'],
			['_red vs blue', 'Red vs. Blue'],
			['_no diamonds', 'No Diamonds'],
			['_vanilla doubles', 'Vanilla Doubles'],
			['_brawl', 'Brawl'],
			['_solo brawl', 'Solo Brawl'],
			['_duo brawl', 'Duo Brawl'],
		],
		STARS: [
			[0, 'Recruit', 'gray'],
			[10, 'Initiate', 'gray'],
			[60, 'Soldier', 'gray'],
			[210, 'Sergeant', 'gray'],
			[460, 'Knight', 'gray'],
			[960, 'Captain', 'gray'],
			[1710, 'Centurion', 'gray'],
			[2710, 'Gladiator', 'gray'],
			[5210, 'Warlord', 'gray'],
			[10210, 'Champion', 'gray'],
			[13210, 'Champion', 'gray'],
			[16210, 'Bronze Champion', 'brown'],
			[19210, 'Silver Champion', 'white'],
			[22210, 'Gold Champion', 'gold'],
			[25210, 'High Champion', 'aqua'],
			[Infinity, null, null]
		],
	}

	// Get the player's API data for SkyWars
	const json = Utils.traverse(props.player,'stats.UHC') || {};
	const leveling = new Utils.HypixelLeveling(scoreToStar, starToScore, Utils.default0(json.score));
	if (leveling.levelCeiling > 15) leveling.levelCeiling = 15;
	const title = getTitle(leveling.levelFloor).name;
	const titleColor = getTitle(leveling.levelFloor).color;
	let levelingProgressProps = {
		proportion: leveling.xp / starToScore(leveling.levelCeiling),
		color: titleColor,
		dataTip: `${Utils.formatNum(leveling.xp)}/${Utils.formatNum(starToScore(leveling.levelCeiling))} Score`
	}
	if (leveling.levelFloor === 15) {
		levelingProgressProps = {
				proportion: 1,
				color: titleColor,
				dataTip: `${Utils.formatNum(leveling.xp)}/${Utils.formatNum(starToScore(15))} Score`
			}
	}

	// Calculate total kills/deaths etc. across all gamemodes
	let kills = 0, deaths = 0, wins = 0, heads = 0;
	for (const [i] of consts.MODES) {
		kills += Utils.default0(json[`kills${i}`]);
		deaths += Utils.default0(json[`deaths${i}`]);
		wins += Utils.default0(json[`wins${i}`]);
		heads += Utils.default0(json[`heads_eaten${i}`]);
	}

	const ratios = {
		kd: Utils.ratio(kills,deaths),
		kw: Utils.ratio(kills,wins),
	}

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
					<td>{Utils.formatNum(json[`kills${id}`])}</td>
					<td>{Utils.formatNum(json[`deaths${id}`])}</td>
					<td>{Utils.formatNum(Utils.ratio(json[`kills${id}`],json[`deaths${id}`]))}</td>
					<td>{Utils.formatNum(json[`wins${id}`])}</td>
					<td>{Utils.formatNum(Utils.ratio(json[`kills${id}`],json[`wins${id}`]))}</td>
					<td>{Utils.formatNum(json[`heads_eaten${id}`])}</td>
				</tr>
				);
		})
	})();
		
	const header = (
		<React.Fragment>
			<Box title="Star">{`§6[${leveling.levelFloor}✫]`}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{wins}</Box>
		</React.Fragment>
		);

	return (
		<Ribbon title="UHC" header={header} index={props.index}>
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
					<Stat title="Score">{leveling.xp}</Stat>
					<Stat title="Title">
						<span className={`c-${titleColor}`}>{title}</span>
					</Stat>
					<Stat title="Coins">{json.coins}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Kills">{kills}</Stat>
					<Stat title="Deaths">{deaths}</Stat>
					<Stat title="Kill/Death Ratio">{ratios.kd}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Wins">{wins}</Stat>
					<Stat title="Kill/Win Ratio">{ratios.kw}</Stat>
					<Stat title="Heads Eaten">{heads}</Stat>
				</div>
			</div>
			<div className="stats-separator mb-3"></div>
			<table className="mb-2">
				<thead>
					<tr>
						<th>Mode</th>
						<th>Kills</th>
						<th>Deaths</th>
						<th>KD</th>
						<th>Wins</th>
						<th>KW</th>
						<th>Heads Eaten</th>
					</tr>
				</thead>
				<tbody>
					{tableBody}
				</tbody>
			</table>
		</Ribbon>
		);
}