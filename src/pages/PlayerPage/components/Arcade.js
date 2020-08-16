import React from 'react';
import { Accordion, Box, StatCell, StatPair } from 'components';
import * as Utils from 'utils';

/*
* Stats accordion for Arcade Games
*
* @param {Object} props.player 	Player data in JSON object
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export function Arcade(props) {
	const consts = {
		ZOMBIESMODES : [
			{id: 'deadend', name: 'Dead End', color: 'gold'},
			{id: 'badblood', name: 'Bad Blood', color: 'red'},
			{id: 'alienarcadium', name: 'Alien Arcadium', color: 'pink'},
		],
		ZOMBIESTYPES : [
			{id: 'basic', name: 'Basic'},
			{id: 'blaze', name: 'Blaze'},
			{id: 'empowered', name: 'Empowered'},
			{id: 'ender', name: 'Ender'},
			{id: 'endermite', name: 'Endermite'},
			{id: 'fire', name: 'Fire'},
			{id: 'guardian', name: 'Guardian'},
			{id: 'magma', name: 'Magma'},
			{id: 'magma_cube', name: 'Magma Cube'},
			{id: 'pig_zombie', name: 'Pig Zombie'},
			{id: 'skelefish', name: 'Skelefish'},
			{id: 'tnt_baby', name: 'TNT Baby'},
			{id: 'tnt', name: 'Bombie', color: 'gold'},
			{id: 'inferno', name: 'Inferno', color: 'gold'},
			{id: 'broodmother', name: 'Broodmother', color: 'gold'},
			{id: 'king_slime', name: 'King Slime', color: 'red'},
			{id: 'wither', name: 'Wither', color: 'red'},
			{id: 'herobrine', name: 'Herobrine', color: 'red'},
			{id: 'mega_blob', name: 'Mega Blob', color: 'pink'},
			{id: 'mega_magma', name: 'Mega Magma', color: 'pink'},
			{id: 'world_ender', name: 'World Ender', color: 'pink'},
		],
	};

	// The player's API data for Arcade Games
	const json = Utils.traverse(props.player,'stats.Arcade') || {};
	const totalWins = Object.entries(json)
		// The point of substring() is to filter out 'prop_hunt_hider_wins_hide_and_seek' from the
		// total wins since it is a duplicate of 'hider_wins_hide_and_seek' (same for seekers)
		.map(e => e[0].substring(0,16).includes('wins_') ? e[1] : 0)
		.reduce((a, b) => a + b, 0);
	
	const header = (
		<Box title="Wins">{totalWins}</Box>
		);

	const zombiesMapTable = (
		<table>
			<thead>
				<tr>
					<th>Map</th>
					<th>Downs</th>
					<th>Revives</th>
					<th>Doors Opened</th>
					<th>Windows Repaired</th>
					<th>Zombies Killed</th>
					<th>Deaths</th>
					<th>Best Round</th>
				</tr>
			</thead>
			<tbody>
			{
				consts.ZOMBIESMODES.map(mode => 
					Boolean(json[`best_round_zombies_${mode.id}`]) &&
					<tr key={mode.id}>
						<StatCell color={mode.color}>{mode.name}</StatCell>
						<StatCell>{json[`times_knocked_down_zombies_${mode.id}`]}</StatCell>
						<StatCell>{json[`players_revived_zombies_${mode.id}`]}</StatCell>
						<StatCell>{json[`doors_opened_zombies_${mode.id}`]}</StatCell>
						<StatCell>{json[`windows_repaired_zombies_${mode.id}`]}</StatCell>
						<StatCell>{json[`zombie_kills_zombies_${mode.id}`]}</StatCell>
						<StatCell>{json[`deaths_zombies_${mode.id}`]}</StatCell>
						<StatCell>{json[`best_round_zombies_${mode.id}`]}</StatCell>
					</tr>
					)
			}
			</tbody>
		</table>
		);

	const zombiesTypeTable = (
		<table>
			<thead>
				<tr>
					<th>Zombie</th>
					<th>Kills</th>
				</tr>
			</thead>
			<tbody>
			{
				consts.ZOMBIESTYPES.map(mode => 
					json[`${mode.id}_zombie_kills_zombies`] &&
					<tr key={mode.id}>
						<StatCell color={mode.color}>{mode.name}</StatCell>
						<StatCell>{json[`${mode.id}_zombie_kills_zombies`]}</StatCell>
					</tr>
					)
			}
			</tbody>
		</table>
		);

	return (
		<Accordion title="Arcade" header={header} index={props.index}>
			<div className="mb-3">
				<StatPair title="Arcade Coins" color="gold">{json.coins}</StatPair>
			</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<div className="font-bold underline mb-1">Blocking Dead</div>
					<StatPair title="Wins">{json.wins_dayone}</StatPair>
					<StatPair title="Kills">{json.kills_dayone}</StatPair>
					<StatPair title="Headshots">{json.headshots_dayone}</StatPair>
					<StatPair title="Melee Weapon">
						{Utils.capitalize((json.melee_weapon || '-').split('_').join(' '))}
					</StatPair>
					<br />
					<div className="font-bold underline mb-1">Bounty Hunters</div>
					<StatPair title="Wins">{json.wins_oneinthequiver}</StatPair>
					<StatPair title="Kills">{json.kills_oneinthequiver}</StatPair>
					<StatPair title="Deaths">{json.deaths_oneinthequiver}</StatPair>
					<StatPair title="Kill/Death Ratio">{Utils.ratio(json.kills_oneinthequiver, json.deaths_oneinthequiver)}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Creeper Attack</div>
					<StatPair title="Max Wave">{json.max_wave}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Dragon Wars</div>
					<StatPair title="Wins">{json.wins_dragonwars2}</StatPair>
					<StatPair title="Kills">{json.kills_dragonwars2}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Easter Simulator</div>
					<StatPair title="Wins">{json.wins_easter_simulator}</StatPair>
					<StatPair title="Eggs Found">{json.eggs_found_easter_simulator}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Ender Spleef</div>
					<StatPair title="Wins">{json.wins_ender}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Farm Hunt</div>
					<StatPair title="Wins">{json.wins_farm_hunt}</StatPair>
					<StatPair title="Poop Collected">{json.poop_collected}</StatPair>
				</div>
				<div className="flex-1">
					<div className="font-bold underline mb-1">Football</div>
					<StatPair title="Wins">{json.wins_soccer}</StatPair>
					<StatPair title="Goals">{json.goals_soccer}</StatPair>
					<StatPair title="Kicks">{json.kicks_soccer}</StatPair>
					<StatPair title="Powerkicks">{json.powerkicks_soccer}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Galaxy Wars</div>
					<StatPair title="Wins">{json.sw_game_wins}</StatPair>
					<StatPair title="Kills">{json.sw_kills}</StatPair>
					<StatPair title="Empire Kills">{json.sw_empire_kills}</StatPair>
					<StatPair title="Rebel Kills">{json.sw_rebel_kills}</StatPair>
					<StatPair title="Deaths">{json.sw_deaths}</StatPair>
					<StatPair title="Kill/Death Ratio">{Utils.ratio(json.sw_wins, json.sw_deaths)}</StatPair>
					<StatPair title="Shots Fired">{json.sw_shots_fired}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Grinch Simulator</div>
					<StatPair title="Wins">{json.wins_grinch}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Hide and Seek</div>
					<StatPair title="Wins as Seeker">{json.seeker_wins_hide_and_seek}</StatPair>
					<StatPair title="Wins as Hider">{json.hider_wins_hide_and_seek}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Hole in the Wall</div>
					<StatPair title="Wins">{json.wins_hole_in_the_wall}</StatPair>
					<StatPair title="Highest Score Qualifications">{json.hitw_record_q}</StatPair>
					<StatPair title="Highest Score Finals">{json.hitw_record_f}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Hypixel Says</div>
					<StatPair title="Wins">{json.wins_simon_says}</StatPair>
					<StatPair title="Rounds">{json.rounds_simon_says}</StatPair>
				</div>
				<div className="flex-1">
					<div className="font-bold underline mb-1">Party Games 1</div>
					<StatPair title="Wins">{json.wins_party}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Party Games 2</div>
					<StatPair title="Wins">{json.wins_party_2}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Party Games 3</div>
					<StatPair title="Wins">{json.wins_party_3}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Pixel Painters</div>
					<StatPair title="Wins">{json.wins_draw_their_thing}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Santa Says</div>
					<StatPair title="Wins">{json.wins_santa_says}</StatPair>
					<StatPair title="Rounds">{json.rounds_santa_says}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Santa Simulator</div>
					<StatPair title="Presents Delivered">{json.delivered_santa_simulator}</StatPair>
					<StatPair title="Times Spotted">{json.spotted_santa_simulator}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Scuba Simulator</div>
					<StatPair title="Wins">{json.wins_scuba_simulator}</StatPair>
					<StatPair title="Items Found">{json.items_found_scuba_simulator}</StatPair>
					<StatPair title="Total Points">{json.total_points_scuba_simulator}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Throw Out</div>
					<StatPair title="Wins">{json.wins_throw_out}</StatPair>
					<StatPair title="Kills">{json.kills_throw_out}</StatPair>
					<StatPair title="Deaths">{json.deaths_throw_out}</StatPair>
					<StatPair title="Kill/Death Ratio">{Utils.ratio(json.kills_throw_out, json.deaths_throw_out)}</StatPair>
				</div>
			</div>
			<div className="accordion-separator mb-2"></div>

			<div className="font-bold font-md text-center mb-2">Mini Walls</div>
			<div className="h-flex mb-2">
				<div className="flex-1">
					<StatPair title="Wins">{json.wins_mini_walls}</StatPair>
					<StatPair title="Kit">{Utils.capitalize(json.miniwalls_activeKit || '-')}</StatPair>
					<StatPair title="Withers Killed">{json.wither_kills_mini_walls}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Kills">{json.kills_mini_walls}</StatPair>
					<StatPair title="Final Kills">{json.final_kills_mini_walls}</StatPair>
					<StatPair title="Deaths">{json.deaths_mini_walls}</StatPair>
					<StatPair title="Kill/Death Ratio">
						{Utils.ratio(json.kills_mini_walls/json.deaths_mini_walls)
							+Utils.ratio(json.final_kills_mini_walls/json.deaths_mini_walls)}
					</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Arrows Hit">{json.arrows_hit_mini_walls}</StatPair>
					<StatPair title="Arrows Shot">{json.arrows_shot_mini_walls}</StatPair>
					<StatPair title="Arrow Hit Accuracy">{Utils.ratio(json.arrows_hit_mini_walls, json.arrows_shot_mini_walls)}</StatPair>
				</div>
			</div>
			<div className="accordion-separator mb-2"></div>

			<div className="font-bold font-md text-center mb-2">Zombies</div>
			<div className="h-flex mb-2">
				<div className="flex-1">
					<StatPair title="Bullets Hit">{json.bullets_hit_zombies}</StatPair>
					<StatPair title="Bullets Shot">{json.bullets_shot_zombies}</StatPair>
					<StatPair title="Bullet Hit Accuracy" percentage>{Utils.ratio(json.bullets_hit_zombies, json.bullets_shot_zombies)}</StatPair>
					<StatPair title="Headshots">{json.headshots_zombies}</StatPair>
					<StatPair title="Headshot Accuracy" percentage>{Utils.ratio(json.headshots_zombies, json.bullets_hit_zombies)}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Times Knocked Down">{json.times_knocked_down_zombies}</StatPair>
					<StatPair title="Players Revived">{json.players_revived_zombies}</StatPair>
					<StatPair title="Doors Opened">{json.doors_opened_zombies}</StatPair>
					<StatPair title="Windows Repaired">{json.windows_repaired_zombies}</StatPair>
					<StatPair title="Zombies Killed">{json.zombie_kills_zombies}</StatPair>
				</div>
			</div>
			<div className="overflow-x mb-2">
				{zombiesMapTable}
			</div>
			<div className="overflow-x mb-2" style={{width: '50%'}}>
				{zombiesTypeTable}
			</div>
		</Accordion>
		)
}