import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { Accordion, Banner, Box, Button, 
	Crafatar, HorizontalLine, Progress, ProgressBar, 
	StatCell, StatPair, StatRow } from 'components';
import { SKYWARS as consts } from 'constants/hypixel';  
import { useHypixelContext } from 'hooks';
import * as Utils from 'utils';
import { HypixelLeveling } from 'utils/hypixel';

/*
* Stats accordion for Skywars
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export const Skywars = React.memo((props) => {

	// Get the player's API data for SkyWars
	const { player } = useHypixelContext();
	const json = Utils.traverse(player,'stats.SkyWars') || {};

	const leveling = new HypixelLeveling(xpToLevel, levelToXP,
		Utils.default0(json.skywars_experience));
	const prestigeColor = getPrestige(leveling.level).color;
	const prestigeName = getPrestige(leveling.level).name;
	const ratios = {
		ahm: Utils.ratio(json.arrows_hit, json.arrows_shot),
		kd : Utils.ratio(json.kills, json.deaths),
		wl : Utils.ratio(json.wins, json.losses),
		kw : Utils.ratio(json.kills, json.wins)
	}

	// State for the head collection 'View' button
	const [headButtonState, setHeadButtonState] = useState(false);

	function xpToLevel(xp) {
		var xps = consts.INITIAL_XP;
		if(xp >= 15000) {
			return (xp - 15000) / consts.RECURRING_XP + 12;
		} else {
			for(let i = 0; i < xps.length; i++) {
				if(xp < xps[i]) {
					return i + (xp - xps[i-1]) / (xps[i] - xps[i-1]);
				}
			}
		}
	}

	function levelToXP(lvl) {
		let xp = 0;
		for (let i = 0; i < lvl; i++) {
			if (i < consts.INITIAL_XP.length) {
				xp = consts.INITIAL_XP[i];
			}
			else {
				xp += consts.RECURRING_XP;
			}
		}
		return xp;
	}

	function getPrestige(level) {
		for (const pres of consts.PRESTIGES.slice().reverse()) {
			if (pres.level <= Math.floor(level)) return {color: pres.color, name: pres.name}
		}
	}

	const prestigeIcon = (() => {
		const icon = json.selected_prestige_icon;
		if (icon === undefined) {
			return '\u22c6';
		}
		const icons = consts.ICONS;
		return icons[icon];
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

	const header = (
		<React.Fragment>
			<Box title="Level" color={prestigeColor}>
				{`[${
					leveling.levelFloor
				}${
					prestigeIcon
				}]`}
			</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{json.wins}</Box>
			<Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
		);

	const levelProgress = (
		<React.Fragment>
			<span className={`px-1 c-${getPrestige(leveling.levelFloor).color}`}>
				{leveling.levelFloor}
			</span>
			<div className="flex-1">
				<ProgressBar 
					dataTip={`${leveling.xpAboveLevel}/${leveling.levelTotalXP} XP`}>
					<Progress
						proportion={leveling.proportionAboveLevel}
						color={prestigeColor}
						dataTip={`${leveling.xpAboveLevel}/${leveling.levelTotalXP} XP`} />
				</ProgressBar>
			</div>
			<span className={`px-1 c-${getPrestige(leveling.levelCeiling).color}`}>
				{leveling.levelCeiling}
			</span>
		</React.Fragment>
		);

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
					Boolean(Utils.add(json[`wins${id}`], json[`losses${id}`])) &&
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
	
	// Data used by the 'Total Heads Gathered' section
	const headProgress = (() => {
		let progressList = [];
		for (const rank of consts.HEADS.slice().reverse()) {
			const amount = Utils.default0(json[`heads_${rank.id}`]);
			// Do not render a span if they are no heads with that rank
			if (amount === 0) continue;
			const proportion = Utils.ratio(amount/json.heads);
			progressList.push(
				<Progress
				key={rank.id}
				color={rank.color}	
				proportion={proportion}
				dataTip={`${amount} ${rank.name} heads`}/>
				);
		}
		return (
			<ProgressBar>
				{progressList}
			</ProgressBar>
			)
	})();

	const prestigiousHeadCollection = (() => {
		const headArray = Utils.traverse(json,'head_collection.prestigious');
		if (headArray === undefined || headArray.length === 0) {
			return <Banner 
				type="info" 
				title="This player has no prestigious heads. 😔"
				expire/>;
		}
		let imgList = [<ReactTooltip key="tooltip"/>];
		let i = 0;
		for (const head of headArray) {
			imgList.push(
				<div key={`head-${i++}`} data-tip={Utils.capitalize(head.sacrifice)}>
					<Link to={`/player/${head.uuid}`}>
						<Crafatar uuid={head.uuid} type='head'/>
					</Link>
				</div>
				);
		} 
		imgList.reverse();
		return imgList;
	})();
	
	return Utils.isEmpty(json) ? 
		<Accordion title={consts.TITLE} index={props.index} /> 
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="my-3">
				<div className="mb-1 font-bold">Leveling Progress</div>
				<div className="h-flex">
					{levelProgress}
				</div>
			</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<StatPair title="Level">{leveling.level}</StatPair>
					<StatPair title="Prestige" color={prestigeColor}>{`${prestigeName} ${prestigeIcon}`}</StatPair>
					<StatPair title="Coins" color="gold">{json.coins}</StatPair>
					<StatPair title="Tokens">{json.cosmetic_tokens}</StatPair>
					<br/>
					<br/>
					<StatPair title="Blocks Placed">{json.blocks_placed}</StatPair>
					<StatPair title="Blocks Broken">{json.blocks_broken}</StatPair>
					<StatPair title="Chests Opened">{json.chests_opened}</StatPair>
					<StatPair title="Arrows Hit">{json.arrows_hit}</StatPair>
					<StatPair title="Arrows Shot">{json.arrows_shot}</StatPair>
					<StatPair title="Arrow Hit Accuracy" percentage>{ratios.ahm}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Kills">{json.kills}</StatPair>
					<StatPair title="Deaths">{json.deaths}</StatPair>
					<StatPair title="Assists">{json.assists}</StatPair>
					<StatPair title="Kill/Death Ratio">{ratios.kd}</StatPair>
					<br/>
					<br/>
					<StatPair title="Melee Kills">{json.melee_kills}</StatPair>
					<StatPair title="Void Kills">{json.void_kills}</StatPair>
					<StatPair title="Bow Kills">{json.bow_kills}</StatPair>
					<StatPair title="Mob Kills">{json.mob_kills}</StatPair>
					<StatPair title="Eggs Thrown">{json.egg_thrown}</StatPair>
					<StatPair title="Pearls Thrown">{json.enderpearls_thrown}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Wins">{json.wins}</StatPair>
					<StatPair title="Lab Wins">{json.wins_lab}</StatPair>
					<StatPair title="Losses">{json.losses}</StatPair>
					<StatPair title="Win/Loss Ratio">{ratios.wl}</StatPair>
					<StatPair title="Kill/Win Ratio">{ratios.kw}</StatPair>
					<br/>
					<StatPair title="Heads">{json.heads}</StatPair>
					<StatPair title="Corruption">{`${Utils.default0(json.angel_of_death_level)}%`}</StatPair>
					<StatPair title="Total Souls">{json.souls_gathered}</StatPair>
					<StatPair title="Current Souls">{json.souls}</StatPair>
					<StatPair title="Paid Souls">{json.paid_souls}</StatPair>
					<StatPair title="Soul Well Uses">{json.soul_well}</StatPair>
				</div>
			</div>
			
			<HorizontalLine />

			<div className="overflow-x my-3">
				{table}
			</div>
			
			<HorizontalLine />

			<div className="mb-1 mt-3">
				<StatPair title="Total Heads Gathered">{json.heads}</StatPair>
			</div>
			<div className="mb-3">
				{headProgress}
			</div>
			<div className="font-bold pb-2">Prestigious Head Collection</div>
			<div className="h-flex flex-wrap pb-3">
			{
				headButtonState ?
				prestigiousHeadCollection :
				<Button onClick={()=>{setHeadButtonState(true)}}>
					<span className="font-bold">View</span>
				</Button>
			}
			</div>
		</Accordion>
});