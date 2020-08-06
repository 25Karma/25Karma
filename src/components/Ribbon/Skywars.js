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
	const json = Utils.traverse(props.player,'stats.SkyWars') || {};
	// State for the head collection 'View' button
	const [headButtonState, setHeadButtonState] = useState(false);
	const stats = {
		level: getSkywarsLevel(Utils.default0(json.skywars_experience)),
		prestigeIcon: json.selected_prestige_icon,
	}
	const ratios = {
		ahm: Utils.ratio(json.arrows_hit, json.arrows_shot),
		kd : Utils.ratio(json.kills, json.deaths),
		wl : Utils.ratio(json.wins, json.losses),
		kw : Utils.ratio(json.kills, json.wins)
	}

	function getSkywarsLevel(xpString) {
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

	function getPrestige(num) {
		const prestigeColors = [
			[0, '7', 'None'], // gray
			[5, 'f', 'Iron'], // white
			[10, '6', 'Gold'], // gold
			[15, 'b', 'Diamond'], // aqua
			[20, '2', 'Emerald'], // darkgreen
			[25, '3', 'Sapphire'], // darkaqua
			[30, '4', 'Ruby'], // darkred
			[25, 'd', 'Crystal'], // pink
			[40, '9', 'Opal'], // blue
			[45, '5', 'Amethyst'], // purple
			[50, 'R', 'Rainbow'], // rainbow
			[100, 'K', 'Mythic'] // rainbow bold
		];
		for (const [k, c, n] of prestigeColors.reverse()) {
			if (k <= parseInt(num)) return {color: c, name: n}
		}
	}

	function getPrestigeIcon(icon) {
		if (icon === undefined) {
			return '\u22c6';
		}
		const icons = {
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

		};
		return icons[icon];
	}

	function renderHeadCollection(headArray) {
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
				<div key={`head-${i++}`} data-tip={head.sacrifice}>
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
					getPrestige(stats.level).color
				}[${
					Math.floor(stats.level)
				}${
					getPrestigeIcon(stats.prestigeIcon)
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
					<Stat title="Level">{stats.level}</Stat>
					<Stat title="Prestige">{`${getPrestige(stats.level).name} ${getPrestigeIcon(stats.prestigeIcon)}`}</Stat>
					<Stat title="Coins">{json.coins}</Stat>
					<Stat title="Tokens">{json.cosmetic_tokens}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Kills">{json.kills}</Stat>
					<Stat title="Deaths">{json.deaths}</Stat>
					<Stat title="Assists">{json.assists}</Stat>
					<Stat title="Kill/Death Ratio">{ratios.kd}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Wins">{json.wins}</Stat>
					<Stat title="Lab Wins">{json.wins_lab}</Stat>
					<Stat title="Losses">{json.losses}</Stat>
					<Stat title="Win/Loss Ratio">{ratios.wl}</Stat>
					<Stat title="Kill/Win Ratio">{ratios.kw}</Stat>
				</div>
			</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Stat title="Blocks Placed">{json.blocks_placed}</Stat>
					<Stat title="Blocks Broken">{json.blocks_broken}</Stat>
					<Stat title="Chests Opened">{json.chests_opened}</Stat>
					<Stat title="Arrows Hit">{json.arrows_hit}</Stat>
					<Stat title="Arrows Shot">{json.arrows_shot}</Stat>
					<Stat title="Arrows Hit/Miss">{ratios.ahm}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Melee Kills">{json.melee_kills}</Stat>
					<Stat title="Void Kills">{json.void_kills}</Stat>
					<Stat title="Bow Kills">{json.bow_kills}</Stat>
					<Stat title="Mob Kills">{json.mob_kills}</Stat>
					<Stat title="Eggs Thrown">{json.egg_thrown}</Stat>
					<Stat title="Pearls Thrown">{json.enderpearls_thrown}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Heads">{json.heads}</Stat>
					<Stat title="Corruption">{`${Utils.default0(json.harvesting_season)}%`}</Stat>
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
					<tr>
						<td>Ranked</td>
						<td>{Utils.formatNum(json.kills_ranked)}</td>
						<td>{Utils.formatNum(json.deaths_ranked)}</td>
						<td>{Utils.formatNum(Utils.ratio(json.kills_ranked,json.deaths_ranked))}</td>
						<td>{Utils.formatNum(json.wins_ranked)}</td>
						<td>{Utils.formatNum(json.losses_ranked)}</td>
						<td>{Utils.formatNum(Utils.ratio(json.wins_ranked,json.losses_ranked))}</td>
					</tr>
					<tr>
						<td>Solo Normal</td>
						<td>{Utils.formatNum(json.kills_solo_normal)}</td>
						<td>{Utils.formatNum(json.deaths_solo_normal)}</td>
						<td>{Utils.formatNum(Utils.ratio(json.kills_solo_normal,json.deaths_solo_normal))}</td>
						<td>{Utils.formatNum(json.wins_solo_normal)}</td>
						<td>{Utils.formatNum(json.losses_solo_normal)}</td>
						<td>{Utils.formatNum(Utils.ratio(json.wins_solo_normal,json.losses_solo_normal))}</td>
					</tr>
					<tr>
						<td>Solo Insane</td>
						<td>{Utils.formatNum(json.kills_solo_insane)}</td>
						<td>{Utils.formatNum(json.deaths_solo_insane)}</td>
						<td>{Utils.formatNum(Utils.ratio(json.kills_solo_insane,json.deaths_solo_insane))}</td>
						<td>{Utils.formatNum(json.wins_solo_insane)}</td>
						<td>{Utils.formatNum(json.losses_solo_insane)}</td>
						<td>{Utils.formatNum(Utils.ratio(json.wins_solo_insane,json.losses_solo_insane))}</td>
					</tr>
					<tr>
						<td>Teams Normal</td>
						<td>{Utils.formatNum(json.kills_team_normal)}</td>
						<td>{Utils.formatNum(json.deaths_team_normal)}</td>
						<td>{Utils.formatNum(Utils.ratio(json.kills_team_normal,json.deaths_team_normal))}</td>
						<td>{Utils.formatNum(json.wins_team_normal)}</td>
						<td>{Utils.formatNum(json.losses_team_normal)}</td>
						<td>{Utils.formatNum(Utils.ratio(json.wins_team_normal,json.losses_team_normal))}</td>
					</tr>
					<tr>
						<td>Teams Insane</td>
						<td>{Utils.formatNum(json.kills_team_insane)}</td>
						<td>{Utils.formatNum(json.deaths_team_insane)}</td>
						<td>{Utils.formatNum(Utils.ratio(json.kills_team_insane,json.deaths_team_insane))}</td>
						<td>{Utils.formatNum(json.wins_team_insane)}</td>
						<td>{Utils.formatNum(json.losses_team_insane)}</td>
						<td>{Utils.formatNum(Utils.ratio(json.wins_team_insane,json.losses_team_insane))}</td>
					</tr>
					<tr>
						<td>Mega Normal</td>
						<td>{Utils.formatNum(json.kills_mega_normal)}</td>
						<td>{Utils.formatNum(json.deaths_mega_normal)}</td>
						<td>{Utils.formatNum(Utils.ratio(json.kills_mega_normal,json.deaths_mega_normal))}</td>
						<td>{Utils.formatNum(json.wins_mega_normal)}</td>
						<td>{Utils.formatNum(json.losses_mega_normal)}</td>
						<td>{Utils.formatNum(Utils.ratio(json.wins_mega_normal,json.losses_mega_normal))}</td>
					</tr>
					<tr>
						<td>Mega Doubles</td>
						<td>{Utils.formatNum(json.kills_mega_doubles)}</td>
						<td>{Utils.formatNum(json.deaths_mega_doubles)}</td>
						<td>{Utils.formatNum(Utils.ratio(json.kills_mega_doubles,json.deaths_mega_doubles))}</td>
						<td>{Utils.formatNum(json.wins_mega_doubles)}</td>
						<td>{Utils.formatNum(json.losses_mega_doubles)}</td>
						<td>{Utils.formatNum(Utils.ratio(json.wins_mega_doubles,json.losses_mega_doubles))}</td>
					</tr>
				</tbody>
			</table>
			<div className="stats-separator mb-3"></div>
			<div className="font-bold pb-2">Prestigious Head Collection</div>
			<div className="h-flex flex-wrap">
			{(() => {
				if (!headButtonState) {
					return <Button onClick={()=>{setHeadButtonState(true)}}>View</Button>;
				} else {
					return renderHeadCollection(Utils.traverse(json,'head_collection.prestigious'));
				}
			})()}
			</div>
		</Ribbon>
		);
}