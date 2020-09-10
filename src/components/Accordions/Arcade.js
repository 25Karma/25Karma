import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'components';
import { Box, Br, Cell, Pair, Table, Title } from 'components/Stats';
import { ARCADE as consts } from 'constants/hypixel';
import { useHypixelContext } from 'hooks';
import * as Utils from 'utils';

/*
* Stats accordion for Arcade Games
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export const Arcade = memo((props) => {

	// The player's API data for Arcade Games
	const { player } = useHypixelContext();
	const json = Utils.traverse(player,'stats.Arcade') || {};
	
	const totalWins = Object.entries(json)
		// The point of substring() is to filter out 'prop_hunt_hider_wins_hide_and_seek' from the
		// total wins since it is a duplicate of 'hider_wins_hide_and_seek' (same for seekers)
		.map(e => e[0].substring(0,16).includes('wins_') ? e[1] : 0)
		.reduce((a, b) => a + b, 0);
	
	const header = (
		<Box title="Wins">{totalWins}</Box>
		);

	const zombiesMapTable = (
		<Table>
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
				consts.ZOMBIESMODES.map(({id, name, color}) => 
					Boolean(json[`best_round_zombies_${id}`]) &&
					<tr key={id}>
						<Cell color={color}>{name}</Cell>
						<Cell>{json[`times_knocked_down_zombies_${id}`]}</Cell>
						<Cell>{json[`players_revived_zombies_${id}`]}</Cell>
						<Cell>{json[`doors_opened_zombies_${id}`]}</Cell>
						<Cell>{json[`windows_repaired_zombies_${id}`]}</Cell>
						<Cell>{json[`zombie_kills_zombies_${id}`]}</Cell>
						<Cell>{json[`deaths_zombies_${id}`]}</Cell>
						<Cell>{json[`best_round_zombies_${id}`]}</Cell>
					</tr>
					)
			}
			</tbody>
		</Table>
		);

	const zombiesTypeTable = (
		<Table>
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
						<Cell color={mode.color}>{mode.name}</Cell>
						<Cell>{json[`${mode.id}_zombie_kills_zombies`]}</Cell>
					</tr>
					)
			}
			</tbody>
		</Table>
		);

	return Utils.isEmpty(json) ? 
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="my-3">
				<Pair title="Arcade Coins" color="gold">{json.coins}</Pair>
			</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<div className="font-bold underline mb-1">Blocking Dead</div>
					<Pair title="Wins">{json.wins_dayone}</Pair>
					<Pair title="Kills">{json.kills_dayone}</Pair>
					<Pair title="Headshots">{json.headshots_dayone}</Pair>
					<Pair title="Melee Weapon">
						{Utils.capitalize((json.melee_weapon || '-').split('_').join(' '))}
					</Pair>
					<Br />
					<div className="font-bold underline mb-1">Bounty Hunters</div>
					<Pair title="Wins">{json.wins_oneinthequiver}</Pair>
					<Pair title="Kills">{json.kills_oneinthequiver}</Pair>
					<Pair title="Deaths">{json.deaths_oneinthequiver}</Pair>
					<Pair title="Kill/Death Ratio">{Utils.ratio(json.kills_oneinthequiver, json.deaths_oneinthequiver)}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Creeper Attack</div>
					<Pair title="Max Wave">{json.max_wave}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Dragon Wars</div>
					<Pair title="Wins">{json.wins_dragonwars2}</Pair>
					<Pair title="Kills">{json.kills_dragonwars2}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Easter Simulator</div>
					<Pair title="Wins">{json.wins_easter_simulator}</Pair>
					<Pair title="Eggs Found">{json.eggs_found_easter_simulator}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Ender Spleef</div>
					<Pair title="Wins">{json.wins_ender}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Farm Hunt</div>
					<Pair title="Wins">{json.wins_farm_hunt}</Pair>
					<Pair title="Poop Collected">{json.poop_collected}</Pair>
				</div>
				<div className="flex-1">
					<div className="font-bold underline mb-1">Football</div>
					<Pair title="Wins">{json.wins_soccer}</Pair>
					<Pair title="Goals">{json.goals_soccer}</Pair>
					<Pair title="Kicks">{json.kicks_soccer}</Pair>
					<Pair title="Powerkicks">{json.powerkicks_soccer}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Galaxy Wars</div>
					<Pair title="Wins">{json.sw_game_wins}</Pair>
					<Pair title="Kills">{json.sw_kills}</Pair>
					<Pair title="Empire Kills">{json.sw_empire_kills}</Pair>
					<Pair title="Rebel Kills">{json.sw_rebel_kills}</Pair>
					<Pair title="Deaths">{json.sw_deaths}</Pair>
					<Pair title="Kill/Death Ratio">{Utils.ratio(json.sw_wins, json.sw_deaths)}</Pair>
					<Pair title="Shots Fired">{json.sw_shots_fired}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Grinch Simulator</div>
					<Pair title="Wins">{json.wins_grinch}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Hide and Seek</div>
					<Pair title="Wins as Seeker">{json.seeker_wins_hide_and_seek}</Pair>
					<Pair title="Wins as Hider">{json.hider_wins_hide_and_seek}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Hole in the Wall</div>
					<Pair title="Wins">{json.wins_hole_in_the_wall}</Pair>
					<Pair title="Highest Score Qualifications">{json.hitw_record_q}</Pair>
					<Pair title="Highest Score Finals">{json.hitw_record_f}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Hypixel Says</div>
					<Pair title="Wins">{json.wins_simon_says}</Pair>
					<Pair title="Rounds">{json.rounds_simon_says}</Pair>
				</div>
				<div className="flex-1">
					<div className="font-bold underline mb-1">Party Games 1</div>
					<Pair title="Wins">{json.wins_party}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Party Games 2</div>
					<Pair title="Wins">{json.wins_party_2}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Party Games 3</div>
					<Pair title="Wins">{json.wins_party_3}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Pixel Painters</div>
					<Pair title="Wins">{json.wins_draw_their_thing}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Santa Says</div>
					<Pair title="Wins">{json.wins_santa_says}</Pair>
					<Pair title="Rounds">{json.rounds_santa_says}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Santa Simulator</div>
					<Pair title="Presents Delivered">{json.delivered_santa_simulator}</Pair>
					<Pair title="Times Spotted">{json.spotted_santa_simulator}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Scuba Simulator</div>
					<Pair title="Wins">{json.wins_scuba_simulator}</Pair>
					<Pair title="Items Found">{json.items_found_scuba_simulator}</Pair>
					<Pair title="Total Points">{json.total_points_scuba_simulator}</Pair>
					<Br />
					<div className="font-bold underline mb-1">Throw Out</div>
					<Pair title="Wins">{json.wins_throw_out}</Pair>
					<Pair title="Kills">{json.kills_throw_out}</Pair>
					<Pair title="Deaths">{json.deaths_throw_out}</Pair>
					<Pair title="Kill/Death Ratio">{Utils.ratio(json.kills_throw_out, json.deaths_throw_out)}</Pair>
				</div>
			</div>

			<HorizontalLine />

			<Title>Mini Walls</Title>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Pair title="Wins">{json.wins_mini_walls}</Pair>
					<Pair title="Kit">{Utils.capitalize(json.miniwalls_activeKit || '-')}</Pair>
					<Pair title="Withers Killed">{json.wither_kills_mini_walls}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Kills">{json.kills_mini_walls}</Pair>
					<Pair title="Final Kills">{json.final_kills_mini_walls}</Pair>
					<Pair title="Deaths">{json.deaths_mini_walls}</Pair>
					<Pair title="Kill/Death Ratio">
						{Utils.ratio(json.kills_mini_walls/json.deaths_mini_walls)
							+Utils.ratio(json.final_kills_mini_walls/json.deaths_mini_walls)}
					</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Arrows Hit">{json.arrows_hit_mini_walls}</Pair>
					<Pair title="Arrows Shot">{json.arrows_shot_mini_walls}</Pair>
					<Pair title="Arrow Hit Accuracy">{Utils.ratio(json.arrows_hit_mini_walls, json.arrows_shot_mini_walls)}</Pair>
				</div>
			</div>

			<HorizontalLine />

			<Title>Zombies</Title>
			<div className="h-flex mb-2">
				<div className="flex-1">
					<Pair title="Bullets Hit">{json.bullets_hit_zombies}</Pair>
					<Pair title="Bullets Shot">{json.bullets_shot_zombies}</Pair>
					<Pair title="Bullet Hit Accuracy" percentage>{Utils.ratio(json.bullets_hit_zombies, json.bullets_shot_zombies)}</Pair>
					<Pair title="Headshots">{json.headshots_zombies}</Pair>
					<Pair title="Headshot Accuracy" percentage>{Utils.ratio(json.headshots_zombies, json.bullets_hit_zombies)}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Times Knocked Down">{json.times_knocked_down_zombies}</Pair>
					<Pair title="Players Revived">{json.players_revived_zombies}</Pair>
					<Pair title="Doors Opened">{json.doors_opened_zombies}</Pair>
					<Pair title="Windows Repaired">{json.windows_repaired_zombies}</Pair>
					<Pair title="Zombies Killed">{json.zombie_kills_zombies}</Pair>
				</div>
			</div>
			<div className="overflow-x mb-2">
				{zombiesMapTable}
			</div>
			<div className="overflow-x mb-3" style={{width: '50%'}}>
				{zombiesTypeTable}
			</div>
		</Accordion>
});