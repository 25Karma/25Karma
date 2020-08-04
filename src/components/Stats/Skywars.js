import React from 'react';
import Cookies from 'js-cookie';
import { Box } from 'components';
import { Stats } from './Stats.js';
import * as Utils from 'utils';

/*
* Stats row for Skywars
*
* @param {Object} props.player Player data in JSON object
* @param {number} props.index The order in which to display the row (used by react-beautiful-dnd)
*/
export function Skywars(props) {
	const json = Utils.traverse(props.player,'stats.SkyWars');
	const decimal = Cookies.get('decimal') || 2;
	const stats = {
		level: getSkywarsLevel(Utils.default0(json.skywars_experience)).toFixed(decimal),
		prestigeIcon: json.selected_prestige_icon,
		kills: Utils.default0(json.kills),
		deaths: Utils.default0(json.deaths),
		wins: Utils.default0(json.wins),
		losses: Utils.default0(json.losses)
	}
	const ratios = {
		kd : (stats.kills/Utils.set1If0(stats.deaths)).toFixed(decimal),
		wl : (stats.wins/Utils.set1If0(stats.losses)).toFixed(decimal)
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
			[0, '7'], // gray
			[5, 'f'], // white
			[10, '6'], // gold
			[15, 'b'], // aqua
			[20, '2'], // darkgreen
			[25, '3'], // darkaqua
			[30, '4'], // darkred
			[25, 'd'], // pink
			[40, '9'], // blue
			[45, '5'], // purple
			[50, 'R'], // rainbow
			[100, 'K'] // rainbow bold
		];
		for (const [k, v] of prestigeColors.reverse()) {
			if (k <= parseInt(num)) return v
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

	const header = (
		<React.Fragment>
			<Box title="Level">
				{`§${
					getPrestige(stats.level)
				}[${
					Math.floor(stats.level)
				}${
					getPrestigeIcon(stats.prestigeIcon)
				}]`}
			</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{stats.wins}</Box>
			<Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
		);

	return (
		<Stats title="Skywars" header={header} index={props.index}>

		</Stats>
		);
}