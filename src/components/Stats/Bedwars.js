import React from 'react';
import Cookies from 'js-cookie';
import { Box, Stats } from '../../components';
import * as Utils from '../../utils';

export function Bedwars(props) {
	let json = props.player.stats.Bedwars;
	if (json === undefined) {
		json = {}
	}
	const decimal = Cookies.get('decimal') || 2;
	const stats = {
		level : Utils.default0(props.player.achievements.bedwars_level),
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

	function prestige(num) {
		const prestigeColors = [
			[0, 'gray'],
			[100, 'white'],
			[200, 'gold'],
			[300, 'aqua'],
			[400, 'darkgreen'],
			[500, 'darkaqua'],
			[600, 'darkred'],
			[700, 'pink'],
			[800, 'blue'],
			[900, 'purple'],
			[1000, 'rainbow'],
			[2000, 'rainbow']
		];
		for (const [k, v] of prestigeColors.reverse()) {
			if (k <= parseInt(num)) return v
		}
	}

	function getHeader() {
		return (
			<React.Fragment>
				<Box title="Level" color={prestige(stats.level)}>[{stats.level}☆]</Box>
				<Box title="KD">{ratios.kd}</Box>
				<Box title="FKD">{ratios.fkd}</Box>
				<Box title="WL">{ratios.wl}</Box>
				<Box title="BBL">{ratios.bbl}</Box>
			</React.Fragment>
			);
	}

	return (
		<Stats.Stats title="Bedwars" header={getHeader()}>
			
		</Stats.Stats>
		);
}