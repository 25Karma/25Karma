import React from 'react';
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
	const json = Utils.traverse(props.player,'stats.Bedwars') || {};
	const stats = {
		level : Utils.default0(Utils.traverse(props.player,'achievements.bedwars_level')),
	}
	const ratios = {
		kd : Utils.ratio(json.kills_bedwars,json.deaths_bedwars),
		fkd : Utils.ratio(json.final_kills_bedwars,json.final_deaths_bedwars),
		wl : Utils.ratio(json.wins_bedwars,json.losses_bedwars),
		bbl : Utils.ratio(json.beds_broken_bedwars,json.beds_lost_bedwars)
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