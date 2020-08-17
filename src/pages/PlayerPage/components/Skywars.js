import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { Accordion, Banner, Box, Button, Crafatar, Progress, ProgressBar, StatCell, StatPair } from 'components';
import * as Utils from 'utils';

/*
* Stats accordion for Skywars
*
* @param {Object} props.player 	Player data in JSON object
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export function Skywars(props) {

	// Constants useful for processing Skywars API data
	const consts = {
		TITLE : 'SkyWars',
		INITIAL_XP: [0, 20, 70, 150, 250, 500, 1000, 2000, 3500, 6000, 10000, 15000],
		RECURRING_XP: 10000,
		PRESTIGES : [
			{level: 0,   color: 'gray', name: 'None'}, 
			{level: 5,   color: 'white', name: 'Iron'}, 
			{level: 10,  color: 'gold', name: 'Gold'}, 
			{level: 15,  color: 'aqua', name: 'Diamond'}, 
			{level: 20,  color: 'darkgreen', name: 'Emerald'}, 
			{level: 25,  color: 'darkaqua', name: 'Sapphire'}, 
			{level: 30,  color: 'darkred', name: 'Ruby'}, 
			{level: 35,  color: 'pink', name: 'Crystal'}, 
			{level: 40,  color: 'blue', name: 'Opal'}, 
			{level: 45,  color: 'purple', name: 'Amethyst'}, 
			{level: 50,  color: 'rainbow', name: 'Rainbow'}, 
			{level: 60, color: 'rainbow', name: 'Mythic'},
			{level: 100, color: 'rainbow font-bold', name: 'Mythic'}
		],
		ICONS : {
			default: '\u22c6',
			angel_1: '\u2605',
			angel_2: '\u2606',
			angel_3: '\u2055',
			angel_4: '\u2736',
			angel_5: '\u2733',
			angel_6: '\u2734',
			angel_7: '\u2737',
			angel_8: '\u274b',
			angel_9: '\u273c',
			angel_10: '\u2742',
			angel_11: '\u2741',
			angel_12: '\u262c',
			iron_prestige: '\u2719',
			gold_prestige: '\u2764',
			diamond_prestige: '\u2620',
			emerald_prestige: '\u2726',
			sapphire_prestige: '\u270c\uFE0E', // Uses symbol instead of emoji
			ruby_prestige: '\u2766',
			crystal_prestige: '\u2735',
			opal_prestige: '\u2763',
			amethyst_prestige: '\u262f',
			rainbow_prestige: '\u273a',
			mythic_prestige: '\u0ca0_\u0ca0',
			favor_icon: '\u2694',
			omega_icon: '\u03a9',
		},
		MODES : [
			{id: '_ranked',       name: 'Ranked'},
			{id: '_solo_normal',  name: 'Solo Normal'},
			{id: '_solo_insane',  name: 'Solo Insane'},
			{id: '_team_normal',  name: 'Teams Normal'},
			{id: '_team_insane',  name: 'Teams Insane'},
			{id: '_mega_normal',  name: 'Mega'},
			{id: '_mega_doubles', name: 'Mega Doubles'},
			{id: '', name: <div className="font-bold mt-2">Overall</div>},
		],
		HEADS : [
			{id: 'eww',       name: 'Eww!',      color: 'darkgray'},
			{id: 'yucky',     name: 'Yucky!',    color: 'gray'},
			{id: 'meh',       name: 'Meh',       color: 'white'},
			{id: 'decent',    name: 'Decent',    color: 'yellow'},
			{id: 'salty',     name: 'Salty',     color: 'green'},
			{id: 'tasty',     name: 'Tasty',     color: 'darkaqua'},
			{id: 'succulent', name: 'Succulent', color: 'pink'},
			{id: 'sweet',     name: 'Sweet',     color: 'aqua'},
			{id: 'divine',    name: 'Divine',    color: 'gold'},
			{id: 'heavenly',  name: 'Heavenly',  color: 'purple'},
		],
	};

	// Get the player's API data for SkyWars
	const json = Utils.traverse(props.player,'stats.SkyWars') || {};
	const leveling = new Utils.HypixelLeveling(xpToLevel, levelToXP,
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
				consts.MODES.map(mode => 
					Boolean(Utils.add(json[`wins${mode.id}`], json[`losses${mode.id}`])) &&
					<tr key={mode.id} className={mode.name === mostPlayedMode ? 'c-pink' : ''}>
						<StatCell>{mode.name}</StatCell>
						<StatCell>{json[`kills${mode.id}`]}</StatCell>
						<StatCell>{json[`deaths${mode.id}`]}</StatCell>
						<StatCell>{Utils.ratio(json[`kills${mode.id}`],json[`deaths${mode.id}`])}</StatCell>
						<StatCell>{json[`wins${mode.id}`]}</StatCell>
						<StatCell>{json[`losses${mode.id}`]}</StatCell>
						<StatCell>{Utils.ratio(json[`wins${mode.id}`],json[`losses${mode.id}`])}</StatCell>
					</tr>
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
			<div className="mb-1 font-bold">Leveling Progress</div>
			<div className="h-flex mb-3">
				{levelProgress}
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
			<div className="accordion-separator mb-3"></div>
			<div className="overflow-x mb-3">
				{table}
			</div>
			<div className="accordion-separator mb-3"></div>
			<div className="mb-1">
				<StatPair title="Total Heads Gathered">{json.heads}</StatPair>
			</div>
			<div className="mb-3">
				{headProgress}
			</div>
			<div className="font-bold pb-2">Prestigious Head Collection</div>
			<div className="h-flex flex-wrap">
			{
				headButtonState ?
				prestigiousHeadCollection :
				<Button onClick={()=>{setHeadButtonState(true)}}>
					<span className="font-bold">View</span>
				</Button>
			}
			</div>
		</Accordion>
}