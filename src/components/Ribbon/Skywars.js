import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { Banner, Box, Button, Crafatar, Stat } from 'components';
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
	const skywarsConstants = {
		PRESTIGE : [
			[0, '7', 'None'], // gray
			[5, 'f', 'Iron'], // white
			[10, '6', 'Gold'], // gold
			[15, 'b', 'Diamond'], // aqua
			[20, '2', 'Emerald'], // darkgreen
			[25, '3', 'Sapphire'], // darkaqua
			[30, '4', 'Ruby'], // darkred
			[35, 'd', 'Crystal'], // pink
			[40, '9', 'Opal'], // blue
			[45, '5', 'Amethyst'], // purple
			[50, 'R', 'Rainbow'], // rainbow
			[100, 'K', 'Mythic'] // rainbow bold
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
			['ranked', 'Ranked'],
			['solo_normal', 'Solo Normal'],
			['solo_insane', 'Solo Insane'],
			['team_normal', 'Teams Normal'],
			['team_insane', 'Teams Insane'],
			['mega_normal', 'Mega'],
			['mega_doubles', 'Mega Doubles'],
		],
	};
	
	// Get the player's API data for SkyWars
	const json = Utils.traverse(props.player,'stats.SkyWars') || {};

	// State for the head collection 'View' button
	const [headButtonState, setHeadButtonState] = useState(false);

	const skywarsLevel = getSkywarsLevel();

	const ratios = {
		ahm: Utils.ratio(json.arrows_hit, json.arrows_shot),
		kd : Utils.ratio(json.kills, json.deaths),
		wl : Utils.ratio(json.wins, json.losses),
		kw : Utils.ratio(json.kills, json.wins)
	}

	function getSkywarsLevel() {
		const xpString = Utils.default0(json.skywars_experience);
		const xp = parseInt(xpString);
		var xps = [0, 20, 70, 150, 250, 500, 1000, 2000, 3500, 6000, 10000, 15000];
		if(xp >= 15000) {
			return (xp - 15000) / 10000 + 12;
		} else {
			for(let i = 0; i < xps.length; i++) {
				if(xp < xps[i]) {
					return i + (xp - xps[i-1]) / (xps[i] - xps[i-1]);
				}
			}
		}
	}

	function getPrestige() {
		const prestige = skywarsConstants.PRESTIGE;
		for (const [k, c, n] of prestige.slice().reverse()) {
			if (k <= Math.floor(skywarsLevel)) return {color: c, name: n}
		}
	}

	function getPrestigeIcon() {
		const icon = json.selected_prestige_icon;
		if (icon === undefined) {
			return '\u22c6';
		}
		const icons = skywarsConstants.ICONS;
		return icons[icon];
	}

	function getMostPlayedMode() {
		const modes = skywarsConstants.MODES;
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
	}

	function renderTableBody() {
		const modes = skywarsConstants.MODES;

		const mostPlayed = getMostPlayedMode();

		return modes.map(mode => {
			const [id,name] = mode;
			return (
				<tr key={id} className={name === mostPlayed ? 'c-pink' : ''}>
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
	}

	function renderHeadCollection() {
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
	}

	const header = (
		<React.Fragment>
			<Box title="Level">
				{`§${
					getPrestige().color
				}[${
					Math.floor(skywarsLevel)
				}${
					getPrestigeIcon()
				}]`}
			</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{Utils.default0(json.wins)}</Box>
			<Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
		);

	return (
		<Ribbon title="Skywars" header={header} index={props.index}>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Stat title="Level">{skywarsLevel}</Stat>
					<Stat title="Prestige">{`${getPrestige().name} ${getPrestigeIcon()}`}</Stat>
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
			<table className="mb-3">
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
					{renderTableBody()}
				</tbody>
			</table>
			<div className="stats-separator mb-3"></div>
			<div className="font-bold pb-2">Prestigious Head Collection</div>
			<div className="h-flex flex-wrap mb-2">
			{(() => {
				if (!headButtonState) {
					return <Button onClick={()=>{setHeadButtonState(true)}}>View</Button>;
				} else {
					return renderHeadCollection();
				}
			})()}
			</div>
		</Ribbon>
		);
}