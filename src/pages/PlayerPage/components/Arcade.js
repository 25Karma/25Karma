import React from 'react';
import { Accordion, Box, Stat } from 'components';
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
					Utils.default0(json[`best_round_zombies_${mode.id}`]) > 0 &&
					<tr key={mode.id}>
						<td className={`c-${mode.color}`}>{mode.name}</td>
						<td>{Utils.formatNum(json[`times_knocked_down_zombies_${mode.id}`])}</td>
						<td>{Utils.formatNum(json[`players_revived_zombies_${mode.id}`])}</td>
						<td>{Utils.formatNum(json[`doors_opened_zombies_${mode.id}`])}</td>
						<td>{Utils.formatNum(json[`windows_repaired_zombies_${mode.id}`])}</td>
						<td>{Utils.formatNum(json[`zombie_kills_zombies_${mode.id}`])}</td>
						<td>{Utils.formatNum(json[`deaths_zombies_${mode.id}`])}</td>
						<td>{Utils.formatNum(json[`best_round_zombies_${mode.id}`])}</td>
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
						<td className={`c-${mode.color || 'white'}`}>{mode.name}</td>
						<td>{Utils.formatNum(json[`${mode.id}_zombie_kills_zombies`])}</td>
					</tr>
					)
			}
			</tbody>
		</table>
		);

	return (
		<Accordion title="Arcade" header={header} index={props.index}>
			<div className="mb-3">
				<Stat title="Arcade Coins" color="gold">{json.coins}</Stat>
			</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<div className="font-bold underline mb-1">Blocking Dead</div>
					<Stat title="Wins">{json.wins_dayone}</Stat>
					<Stat title="Kills">{json.kills_dayone}</Stat>
					<Stat title="Headshots">{json.headshots_dayone}</Stat>
					<Stat title="Melee Weapon">
						{Utils.capitalize((json.melee_weapon || '-').split('_').join(' '))}
					</Stat>
					<br />
					<div className="font-bold underline mb-1">Bounty Hunters</div>
					<Stat title="Wins">{json.wins_oneinthequiver}</Stat>
					<Stat title="Kills">{json.kills_oneinthequiver}</Stat>
					<Stat title="Deaths">{json.deaths_oneinthequiver}</Stat>
					<Stat title="Kill/Death Ratio">{Utils.ratio(json.kills_oneinthequiver, json.deaths_oneinthequiver)}</Stat>
					<br />
					<div className="font-bold underline mb-1">Creeper Attack</div>
					<Stat title="Max Wave">{json.max_wave}</Stat>
					<br />
					<div className="font-bold underline mb-1">Dragon Wars</div>
					<Stat title="Wins">{json.wins_dragonwars2}</Stat>
					<Stat title="Kills">{json.kills_dragonwars2}</Stat>
					<br />
					<div className="font-bold underline mb-1">Easter Simulator</div>
					<Stat title="Wins">{json.wins_easter_simulator}</Stat>
					<Stat title="Eggs Found">{json.eggs_found_easter_simulator}</Stat>
					<br />
					<div className="font-bold underline mb-1">Ender Spleef</div>
					<Stat title="Wins">{json.wins_ender}</Stat>
					<br />
					<div className="font-bold underline mb-1">Farm Hunt</div>
					<Stat title="Wins">{json.wins_farm_hunt}</Stat>
					<Stat title="Poop Collected">{json.poop_collected}</Stat>
				</div>
				<div className="flex-1">
					<div className="font-bold underline mb-1">Football</div>
					<Stat title="Wins">{json.wins_soccer}</Stat>
					<Stat title="Goals">{json.goals_soccer}</Stat>
					<Stat title="Kicks">{json.kicks_soccer}</Stat>
					<Stat title="Powerkicks">{json.powerkicks_soccer}</Stat>
					<br />
					<div className="font-bold underline mb-1">Galaxy Wars</div>
					<Stat title="Wins">{json.sw_game_wins}</Stat>
					<Stat title="Kills">{json.sw_kills}</Stat>
					<Stat title="Empire Kills">{json.sw_empire_kills}</Stat>
					<Stat title="Rebel Kills">{json.sw_rebel_kills}</Stat>
					<Stat title="Deaths">{json.sw_deaths}</Stat>
					<Stat title="Kill/Death Ratio">{Utils.ratio(json.sw_wins, json.sw_deaths)}</Stat>
					<Stat title="Shots Fired">{json.sw_shots_fired}</Stat>
					<br />
					<div className="font-bold underline mb-1">Grinch Simulator</div>
					<Stat title="Wins">{json.wins_grinch}</Stat>
					<br />
					<div className="font-bold underline mb-1">Hide and Seek</div>
					<Stat title="Wins as Seeker">{json.seeker_wins_hide_and_seek}</Stat>
					<Stat title="Wins as Hider">{json.hider_wins_hide_and_seek}</Stat>
					<br />
					<div className="font-bold underline mb-1">Hole in the Wall</div>
					<Stat title="Wins">{json.wins_hole_in_the_wall}</Stat>
					<Stat title="Highest Score Qualifications">{json.hitw_record_q}</Stat>
					<Stat title="Highest Score Finals">{json.hitw_record_f}</Stat>
					<br />
					<div className="font-bold underline mb-1">Hypixel Says</div>
					<Stat title="Wins">{json.wins_simon_says}</Stat>
					<Stat title="Rounds">{json.rounds_simon_says}</Stat>
				</div>
				<div className="flex-1">
					<div className="font-bold underline mb-1">Party Games 1</div>
					<Stat title="Wins">{json.wins_party}</Stat>
					<br />
					<div className="font-bold underline mb-1">Party Games 2</div>
					<Stat title="Wins">{json.wins_party_2}</Stat>
					<br />
					<div className="font-bold underline mb-1">Party Games 3</div>
					<Stat title="Wins">{json.wins_party_3}</Stat>
					<br />
					<div className="font-bold underline mb-1">Pixel Painters</div>
					<Stat title="Wins">{json.wins_draw_their_thing}</Stat>
					<br />
					<div className="font-bold underline mb-1">Santa Says</div>
					<Stat title="Wins">{json.wins_santa_says}</Stat>
					<Stat title="Rounds">{json.rounds_santa_says}</Stat>
					<br />
					<div className="font-bold underline mb-1">Santa Simulator</div>
					<Stat title="Presents Delivered">{json.delivered_santa_simulator}</Stat>
					<Stat title="Times Spotted">{json.spotted_santa_simulator}</Stat>
					<br />
					<div className="font-bold underline mb-1">Scuba Simulator</div>
					<Stat title="Wins">{json.wins_scuba_simulator}</Stat>
					<Stat title="Items Found">{json.items_found_scuba_simulator}</Stat>
					<Stat title="Total Points">{json.total_points_scuba_simulator}</Stat>
					<br />
					<div className="font-bold underline mb-1">Throw Out</div>
					<Stat title="Wins">{json.wins_throw_out}</Stat>
					<Stat title="Kills">{json.kills_throw_out}</Stat>
					<Stat title="Deaths">{json.deaths_throw_out}</Stat>
					<Stat title="Kill/Death Ratio">{Utils.ratio(json.kills_throw_out, json.deaths_throw_out)}</Stat>
				</div>
			</div>
			<div className="accordion-separator mb-2"></div>

			<div className="font-bold font-md text-center mb-2">Mini Walls</div>
			<div className="h-flex mb-2">
				<div className="flex-1">
					<Stat title="Wins">{json.wins_mini_walls}</Stat>
					<Stat title="Kit">{Utils.capitalize(json.miniwalls_activeKit || '-')}</Stat>
					<Stat title="Withers Killed">{json.wither_kills_mini_walls}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Kills">{json.kills_mini_walls}</Stat>
					<Stat title="Final Kills">{json.final_kills_mini_walls}</Stat>
					<Stat title="Deaths">{json.deaths_mini_walls}</Stat>
					<Stat title="Kill/Death Ratio">
						{Utils.ratio(json.kills_mini_walls/json.deaths_mini_walls)
							+Utils.ratio(json.final_kills_mini_walls/json.deaths_mini_walls)}
					</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Arrows Hit">{json.arrows_hit_mini_walls}</Stat>
					<Stat title="Arrows Shot">{json.arrows_shot_mini_walls}</Stat>
					<Stat title="Arrow Hit Accuracy">{Utils.ratio(json.arrows_hit_mini_walls, json.arrows_shot_mini_walls)}</Stat>
				</div>
			</div>
			<div className="accordion-separator mb-2"></div>

			<div className="font-bold font-md text-center mb-2">Zombies</div>
			<div className="h-flex mb-2">
				<div className="flex-1">
					<Stat title="Bullets Hit">{json.bullets_hit_zombies}</Stat>
					<Stat title="Bullets Shot">{json.bullets_shot_zombies}</Stat>
					<Stat title="Bullet Hit Accuracy" percentage>{Utils.ratio(json.bullets_hit_zombies, json.bullets_shot_zombies)}</Stat>
					<Stat title="Headshots">{json.headshots_zombies}</Stat>
					<Stat title="Headshot Accuracy" percentage>{Utils.ratio(json.headshots_zombies, json.bullets_hit_zombies)}</Stat>
				</div>
				<div className="flex-1">
					<Stat title="Times Knocked Down">{json.times_knocked_down_zombies}</Stat>
					<Stat title="Players Revived">{json.players_revived_zombies}</Stat>
					<Stat title="Doors Opened">{json.doors_opened_zombies}</Stat>
					<Stat title="Windows Repaired">{json.windows_repaired_zombies}</Stat>
					<Stat title="Zombies Killed">{json.zombie_kills_zombies}</Stat>
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