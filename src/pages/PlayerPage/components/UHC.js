import React from 'react';
import { Box, Progress, ProgressBar, Stat } from 'components';
import { Ribbon } from 'components/Ribbon';
import * as Utils from 'utils';

/*
* Stats ribbon for UHC
*
* @param {Object} props.player 	Player data in JSON object
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export function UHC(props) {

	const consts = {
		MODES : [
		{id: '_solo', name: 'Solo'},
		{id: '', name: 'Teams'},
		{id: '_red vs blue', name: 'Red vs. Blue'},
		{id: '_no diamonds', name: 'No Diamonds'},
		{id: '_vanilla doubles', name: 'Vanilla Doubles'},
		{id: '_brawl', name: 'Brawl'},
		{id: '_solo brawl', name: 'Solo Brawl'},
		{id: '_duo brawl', name: 'Duo Brawl'},
		],
		STARS: [
			{value: 0, name: 'Recruit', color: 'gray'},
			{value: 10, name: 'Initiate', color: 'gray'},
			{value: 60, name: 'Soldier', color: 'gray'},
			{value: 210, name: 'Sergeant', color: 'gray'},
			{value: 460, name: 'Knight', color: 'gray'},
			{value: 960, name: 'Captain', color: 'gray'},
			{value: 1710, name: 'Centurion', color: 'gray'},
			{value: 2710, name: 'Gladiator', color: 'gray'},
			{value: 5210, name: 'Warlord', color: 'gray'},
			{value: 10210, name: 'Champion', color: 'gray'},
			{value: 13210, name: 'Champion', color: 'gray'},
			{value: 16210, name: 'Bronze Champion', color: 'brown'},
			{value: 19210, name: 'Silver Champion', color: 'white'},
			{value: 22210, name: 'Gold Champion', color: 'gold'},
			{value: 25210, name: 'High Champion', color: 'aqua'},
			{value: Infinity, name: null, color: null}
		],
	}

	// Get the player's API data for SkyWars
	const json = Utils.traverse(props.player,'stats.UHC') || {};
	const leveling = new Utils.HypixelLeveling(scoreToStar, starToScore, Utils.default0(json.score));
	if (leveling.levelCeiling > 15) leveling.levelCeiling = 15;
	const title = getTitle(leveling.levelFloor).name;
	const titleColor = getTitle(leveling.levelFloor).color;

	// Calculate total kills/deaths etc. across all gamemodes
	let kills = 0, deaths = 0, wins = 0, heads = 0;
	for (const mode of consts.MODES) {
		kills += Utils.default0(json[`kills${mode.id}`]);
		deaths += Utils.default0(json[`deaths${mode.id}`]);
		wins += Utils.default0(json[`wins${mode.id}`]);
		heads += Utils.default0(json[`heads_eaten${mode.id}`]);
	}

	const ratios = {
		kd: Utils.ratio(kills,deaths),
		kw: Utils.ratio(kills,wins),
	}

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
			<Box title="Star">{`§6[${leveling.levelFloor}✫]`}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{wins}</Box>
		</React.Fragment>
		);

	const progressBar = (() => {
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
					<th>Kills</th>
					<th>Deaths</th>
					<th>KD</th>
					<th>Wins</th>
					<th>KW</th>
					<th>Heads Eaten</th>
				</tr>
			</thead>
			<tbody>
			{
				consts.MODES.map(mode =>
					Utils.default0(json[`wins${mode.id}`]) + Utils.default0(json[`deaths${mode.id}`]) > 0 &&
					<tr key={mode.id}>
						<td>{mode.name}</td>
						<td>{Utils.formatNum(json[`kills${mode.id}`])}</td>
						<td>{Utils.formatNum(json[`deaths${mode.id}`])}</td>
						<td>{Utils.formatNum(Utils.ratio(json[`kills${mode.id}`],json[`deaths${mode.id}`]))}</td>
						<td>{Utils.formatNum(json[`wins${mode.id}`])}</td>
						<td>{Utils.formatNum(Utils.ratio(json[`kills${mode.id}`],json[`wins${mode.id}`]))}</td>
						<td>{Utils.formatNum(json[`heads_eaten${mode.id}`])}</td>
					</tr>
					)
			}
			</tbody>
		</table>
		);
		
	return (
		<Ribbon title="UHC" header={header} index={props.index}>
			<div className="mb-1 font-bold">Title Progress</div>
			<div className="h-flex mb-3">
				{progressBar}
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
					<Stat title="Ultimates Crafted">
						{Utils.default0(json.ultimates_crafted) + Utils.default0(json.ultimates_crafted_solo)}
					</Stat>
				</div>
			</div>
			<div className="stats-separator mb-3"></div>
			<div className="overflow-x mb-2">
				{table}
			</div>
		</Ribbon>
		);
}