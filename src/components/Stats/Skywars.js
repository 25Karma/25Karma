import React from 'react';

export function Skywars(props) {
	const stats = props.player.stats.SkyWars;
	console.log(props.player);
	console.log(stats);
	const level = props.player.achievements.skywars_level;
	const finalKills = stats.final_kills_bedwars;
	const finalDeaths = stats.final_deaths_bedwars;
	const kills = stats.kills_bedwars;
	const deaths = stats.deaths_bedwars;
	const wins = stats.wins_bedwars;
	const losses = stats.losses_bedwars;
	const bedsBroken = stats.beds_broken_bedwars;
	const bedsLost = stats.beds_lost_bedwars;
	return (
		<div className="font-minecraft">
			Skywars level {level}<br/>
			KDR: {(kills/deaths).toFixed(4)}<br/>
			FKDR: {(finalKills/finalDeaths).toFixed(4)}<br/>
			WL: {(wins/losses).toFixed(4)}<br/>
			BBL: {(bedsBroken/bedsLost).toFixed(4)}
		</div>
		);
}