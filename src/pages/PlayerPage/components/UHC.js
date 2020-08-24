import React from 'react';
import { Accordion, Box, HorizontalLine, Progress, 
	ProgressBar, StatCell, StatPair } from 'components';
import { UHC as consts } from 'constants/hypixel';
import { useHypixelContext } from 'hooks';
import * as Utils from 'utils';
import { HypixelLeveling } from 'utils/hypixel';

/*
* Stats accordion for UHC
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export function UHC(props) {

	// Get the player's API data for UHC
	const { player } = useHypixelContext();
	const json = Utils.traverse(player,'stats.UHC') || {};

	const leveling = new HypixelLeveling(scoreToStar, starToScore, Utils.default0(json.score));
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
			<Box title="Star" color="gold">{`[${leveling.levelFloor}✫]`}</Box>
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
					Boolean(Utils.add(json[`wins${mode.id}`], json[`deaths${mode.id}`])) &&
					<tr key={mode.id}>
						<StatCell>{mode.name}</StatCell>
						<StatCell>{json[`kills${mode.id}`]}</StatCell>
						<StatCell>{json[`deaths${mode.id}`]}</StatCell>
						<StatCell>{Utils.ratio(json[`kills${mode.id}`],json[`deaths${mode.id}`])}</StatCell>
						<StatCell>{json[`wins${mode.id}`]}</StatCell>
						<StatCell>{Utils.ratio(json[`kills${mode.id}`],json[`wins${mode.id}`])}</StatCell>
						<StatCell>{json[`heads_eaten${mode.id}`]}</StatCell>
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
			<div className="my-3">
				<div className="mb-1 font-bold">Title Progress</div>
				<div className="h-flex">
					{progressBar}
				</div>
			</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<StatPair title="Score">{leveling.xp}</StatPair>
					<StatPair title="Title" color={titleColor}>{title}</StatPair>
					<StatPair title="Coins" color="gold">{json.coins}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Kills">{kills}</StatPair>
					<StatPair title="Deaths">{deaths}</StatPair>
					<StatPair title="Kill/Death Ratio">{ratios.kd}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Wins">{wins}</StatPair>
					<StatPair title="Kill/Win Ratio">{ratios.kw}</StatPair>
					<StatPair title="Heads Eaten">{heads}</StatPair>
					<StatPair title="Ultimates Crafted">
						{Utils.default0(json.ultimates_crafted) + Utils.default0(json.ultimates_crafted_solo)}
					</StatPair>
				</div>
			</div>
			
			<HorizontalLine />

			<div className="overflow-x my-3">
				{table}
			</div>
		</Accordion>
}