import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { Banner, Box, Button, Crafatar, Progress, ProgressBar, Stat } from 'components';
import { Ribbon } from 'components/Ribbon';
import * as Utils from 'utils';

/*
* Stats ribbon for Skywars
*
* @param {Object} props.player Player data in JSON object
* @param {number} props.index The order in which to display the row (used by react-beautiful-dnd)
*/
export function Skywars(props) {

	// Constants useful for processing Skywars API data
	const consts = {
		INITIAL_XP: [0, 20, 70, 150, 250, 500, 1000, 2000, 3500, 6000, 10000, 15000],
		RECURRING_XP: 10000,
		PRESTIGES : [
			[0,   'gray', 'None'], 
			[5,   'white', 'Iron'], 
			[10,  'gold', 'Gold'], 
			[15,  'aqua', 'Diamond'], 
			[20,  'darkgreen', 'Emerald'], 
			[25,  'darkaqua', 'Sapphire'], 
			[30,  'darkred', 'Ruby'], 
			[35,  'pink', 'Crystal'], 
			[40,  'blue', 'Opal'], 
			[45,  'purple', 'Amethyst'], 
			[50,  'rainbow', 'Rainbow'], 
			[100, 'rainbow font-bold', 'Mythic']
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
			sapphire_prestige: '\u270c',
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
			['ranked',       'Ranked'],
			['solo_normal',  'Solo Normal'],
			['solo_insane',  'Solo Insane'],
			['team_normal',  'Teams Normal'],
			['team_insane',  'Teams Insane'],
			['mega_normal',  'Mega'],
			['mega_doubles', 'Mega Doubles'],
		],
		HEADS : [
			['eww',       'Eww!',      'darkgray'],
			['yucky',     'Yucky!',    'gray'],
			['meh',       'Meh',       'white'],
			['decent',    'Decent',    'yellow'],
			['salty',     'Salty',     'green'],
			['tasty',     'Tasty',     'darkaqua'],
			['succulent', 'Succulent', 'pink'],
			['divine',    'Divine',    'gold'],
			['heavenly',  'Heavenly',  'purple'],
			['sweet',     'Sweet',     'aqua'],
		],
	};
	
	// Get the player's API data for SkyWars
	const json = Utils.traverse(props.player,'stats.SkyWars') || {};
	const leveling = new Utils.HypixelLeveling(xpToLevel, levelToXP,
		Utils.default0(json.skywars_experience));
	const prestigeColor = getPrestige(leveling.level).color;
	const prestigeName = getPrestige(leveling.level).name;
	const levelingProgressProps = {
		proportion: leveling.proportionAboveLevel,
		color: prestigeColor,
		dataTip: `${leveling.xpAboveLevel}/${leveling.levelTotalXP} XP`
	}
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
		const prestiges = consts.PRESTIGES;
		for (const [l, c, n] of prestiges.slice().reverse()) {
			if (l <= Math.floor(level)) return {color: c, name: n}
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
		const modes = consts.MODES;
		let mostPlayed = null;
		let mostPlays = 0;
		for (const mode of modes) {
			const [id, name] = mode;
			const plays = Utils.default0(json[`wins_${id}`]) + Utils.default0(json[`losses_${id}`])
			if (plays > mostPlays) {
				mostPlays = plays;
				mostPlayed = name;
			}
		}
		return mostPlayed;
	})();

	const tableBody = (() => {
		const modes = consts.MODES;

		return modes.map(mode => {
			const [id,name] = mode;
			return (
				<tr key={id} className={name === mostPlayedMode ? 'c-pink' : ''}>
					<td>{name}</td>
					<td>{Utils.formatNum(json[`kills_${id}`])}</td>
					<td>{Utils.formatNum(json[`deaths_${id}`])}</td>
					<td>{Utils.formatNum(Utils.ratio(json[`kills_${id}`],json[`deaths_${id}`]))}</td>
					<td>{Utils.formatNum(json[`wins_${id}`])}</td>
					<td>{Utils.formatNum(json[`losses_${id}`])}</td>
					<td>{Utils.formatNum(Utils.ratio(json[`wins_${id}`],json[`losses_${id}`]))}</td>
				</tr>
				);
		})
	})();
	
	// Data used by the 'Total Heads Gathered' section
	const headProgress = (() => {
		const ranks = consts.HEADS;

		let progressList = [];
		for (const [i, n, c] of ranks.slice().reverse()) {
			const amount = Utils.default0(json[`heads_${i}`]);
			// Do not render a span if they are no heads with that rank
			if (amount === 0) continue;
			const proportion = Utils.ratio(amount/json.heads);
			progressList.push(
				<Progress
				key={i}
				color={c}	
				proportion={proportion}
				dataTip={`${amount} ${n} heads`}/>
				);
		}
		return progressList;
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

	const header = (
		<React.Fragment>
			<Box title="Level">
				{`${
					Utils.toColorCode(prestigeColor)
				}[${
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

	return (
		<Ribbon title="SkyWars" header={header} index={props.index}>
			<div className="mb-1 font-bold">Leveling Progress</div>
			<div className="h-flex mb-3">
				<span className={`px-1 c-${getPrestige(leveling.levelFloor).color}`}>
					{leveling.levelFloor}
				</span>
				<div className="flex-1">
					<ProgressBar {...levelingProgressProps}>
						<Progress {...levelingProgressProps} />
					</ProgressBar>
				</div>
				<span className={`px-1 c-${getPrestige(leveling.levelCeiling).color}`}>
					{leveling.levelCeiling}
				</span>
			</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Stat title="Level">{leveling.level}</Stat>
					<Stat title="Prestige">
						<span className={`c-${prestigeColor}`}>
							{`${prestigeName} ${prestigeIcon}`}
						</span>
					</Stat>
					<Stat title="Coins">{json.coins}</Stat>
					<Stat title="Tokens">{json.cosmetic_tokens}</Stat>
					<br/>
					<br/>
					<Stat title="Blocks Placed">{json.blocks_placed}</Stat>
					<Stat title="Blocks Broken">{json.blocks_broken}</Stat>
					<Stat title="Chests Opened">{json.chests_opened}</Stat>
					<Stat title="Arrows Hit">{json.arrows_hit}</Stat>
					<Stat title="Arrows Shot">{json.arrows_shot}</Stat>
					<Stat title="Arrows Hit/Miss">{ratios.ahm}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Kills">{json.kills}</Stat>
					<Stat title="Deaths">{json.deaths}</Stat>
					<Stat title="Assists">{json.assists}</Stat>
					<Stat title="Kill/Death Ratio">{ratios.kd}</Stat>
					<br/>
					<br/>
					<Stat title="Melee Kills">{json.melee_kills}</Stat>
					<Stat title="Void Kills">{json.void_kills}</Stat>
					<Stat title="Bow Kills">{json.bow_kills}</Stat>
					<Stat title="Mob Kills">{json.mob_kills}</Stat>
					<Stat title="Eggs Thrown">{json.egg_thrown}</Stat>
					<Stat title="Pearls Thrown">{json.enderpearls_thrown}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Wins">{json.wins}</Stat>
					<Stat title="Lab Wins">{json.wins_lab}</Stat>
					<Stat title="Losses">{json.losses}</Stat>
					<Stat title="Win/Loss Ratio">{ratios.wl}</Stat>
					<Stat title="Kill/Win Ratio">{ratios.kw}</Stat>
					<br/>
					<Stat title="Heads">{json.heads}</Stat>
					<Stat title="Corruption">{`${Utils.default0(json.angel_of_death_level)}%`}</Stat>
					<Stat title="Total Souls">{json.souls_gathered}</Stat>
					<Stat title="Current Souls">{json.souls}</Stat>
					<Stat title="Paid Souls">{json.paid_souls}</Stat>
					<Stat title="Soul Well Uses">{json.soul_well}</Stat>
				</div>
			</div>
			<div className="stats-separator mb-3"></div>
			<div className="stats-table mb-3">
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
						{tableBody}
					</tbody>
				</table>
			</div>
			<div className="stats-separator mb-3"></div>
			<div className="mb-1">
				<Stat title="Total Heads Gathered">{json.heads}</Stat>
			</div>
			<div className="mb-3">
				<ProgressBar>
					{headProgress}
				</ProgressBar>
			</div>
			<div className="font-bold pb-2">Prestigious Head Collection</div>
			<div className="h-flex flex-wrap mb-2">
			{(() => {
				if (!headButtonState) {
					return <Button onClick={()=>{setHeadButtonState(true)}}>View</Button>;
				} else {
					return prestigiousHeadCollection;
				}
			})()}
			</div>
		</Ribbon>
		);
}