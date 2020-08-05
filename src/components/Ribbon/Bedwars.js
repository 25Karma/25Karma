import React from 'react';
import Cookies from 'js-cookie';
import { Box } from 'components';
import { Ribbon } from 'components/Ribbon';
import * as Utils from 'utils';

/*
* Stats ribbon for Bedwars
*
* @param {Object} props.player Player data in JSON object
* @param {number} props.index The order in which to display the row (used by react-beautiful-dnd)
*/
export function Bedwars(props) {
	const json = Utils.traverse(props.player,'stats.Bedwars');
	const decimal = Cookies.get('decimal') || 2;
	const stats = {
		level : Utils.default0(Utils.traverse(props.player,'achievements.bedwars_level')),
		finalKills : Utils.default0(json.final_kills_bedwars),
		finalDeaths : Utils.default0(json.final_deaths_bedwars),
		kills : Utils.default0(json.kills_bedwars),
		deaths : Utils.default0(json.deaths_bedwars),
		wins : Utils.default0(json.wins_bedwars),
		losses : Utils.default0(json.losses_bedwars),
		bedsBroken : Utils.default0(json.beds_broken_bedwars),
		bedsLost : Utils.default0(json.beds_lost_bedwars)
	}
	const ratios = {
		kd : (stats.kills/Utils.set1If0(stats.deaths)).toFixed(decimal),
		fkd : (stats.finalKills/Utils.set1If0(stats.finalDeaths)).toFixed(decimal),
		wl : (stats.wins/Utils.set1If0(stats.losses)).toFixed(decimal),
		bbl : (stats.bedsBroken/Utils.set1If0(stats.bedsLost)).toFixed(decimal)
	}
	
	function getPrestige(num) {
		const prestigeColors = [
			[0, '7'], // gray
			[100, 'f'], // white
			[200, '6'], // gold
			[300, 'b'], // aqua
			[400, '2'], // darkgreen
			[500, '3'], // darkaqua
			[600, '4'], // darkred
			[700, 'd'], // pink
			[800, '9'], // blue
			[900, '5'], // purple
			[1000, 'R'], // rainbow
			[2000, 'R'] // rainbow
		];
		for (const [k, v] of prestigeColors.reverse()) {
			if (k <= parseInt(num)) return v
		}
	}

	const header = (
		<React.Fragment>
			<Box title="Level">{`§${getPrestige(stats.level)}[${stats.level}☆]`}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="FKD">{ratios.fkd}</Box>
			<Box title="WL">{ratios.wl}</Box>
			<Box title="BBL">{ratios.bbl}</Box>
		</React.Fragment>
		);


	return (
		<Ribbon title="Bedwars" header={header} index={props.index}>
			
		</Ribbon>
		);
}