import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'src/components';
import { Box, Br, Cell, Pair, Row, Table, Title } from 'src/components/Stats';
import { ARCADE as consts, HYPIXEL } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { getMostPlayed } from 'src/utils/hypixel';

/*
* Stats accordion for Arcade Games
*
* @param {number} props.index    The order in which to display the row (used by react-beautiful-dnd)
*/
export const Arcade = memo((props) => {

	// The player's API data for Arcade Games
	const { player } = useAPIContext();
	const json = Utils.traverse(player, 'stats.Arcade', {});
	const dropperJson = Utils.traverse(json, 'dropper', {});

	const pixelPartyJson = Utils.traverse(json, 'pixel_party', {});
	consts.PIXELPARTYMODES.forEach(({id}) => {
		pixelPartyJson[`losses${id}`] = Utils.subtract(pixelPartyJson[`games_played${id}`], pixelPartyJson[`wins${id}`])
		pixelPartyJson[`wl${id}`] = Utils.ratio(pixelPartyJson[`wins${id}`], pixelPartyJson[`losses${id}`])
	})
	const mostPlayedPixelPartyMode = getMostPlayed(consts.PIXELPARTYMODES, 
		({id}) => Utils.default0(pixelPartyJson[`games_played${id}`]))
	
	const totalWins = Utils.add(...HYPIXEL.TOTALWINS.filter(i => i.includes('Arcade')
		).map(n => Utils.traverse(player, n)));
	
	const header = (
		<Box title="Wins">{totalWins}</Box>
		);

	const zombiesMapTable = (
		<Table className="mb-3">
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
					<th>Wins</th>
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
						<Cell>{json[`wins_zombies_${id}`]}</Cell>
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

	const pixelPartyTable = (
		<Table>
			<thead>
				<tr>
					<th>Mode</th>
					<th>Wins</th>
					<th>Losses</th>
					<th>WL</th>
					<th>Games Played</th>
					<th>Rounds Completed</th>
					<th>Power-Ups Collected</th>
				</tr>
			</thead>
			<tbody>
			{
				consts.PIXELPARTYMODES.map(mode => 
					pixelPartyJson[`games_played${mode.id}`] &&
					<Row key={mode.name} id={mode.id} isHighlighted={mode.id === mostPlayedPixelPartyMode.id}>
						<Cell>{mode.name}</Cell>
						<Cell>{pixelPartyJson[`wins${mode.id}`]}</Cell>
						<Cell>{pixelPartyJson[`losses${mode.id}`]}</Cell>
						<Cell>{pixelPartyJson[`wl${mode.id}`]}</Cell>
						<Cell>{pixelPartyJson[`games_played${mode.id}`]}</Cell>
						<Cell>{pixelPartyJson[`rounds_completed${mode.id}`]}</Cell>
						<Cell>{pixelPartyJson[`power_ups_collected${mode.id}`]}</Cell>
					</Row>
					)
			}
			</tbody>
		</Table>
		);

	return Utils.isEmpty(json) ? 
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div>
				<Pair title="Arcade Coins" color="gold">{json.coins}</Pair>
			</div>

			<HorizontalLine className="my-3" />

			<Title>Capture The Wool</Title>
			<div className="h-flex">
				<div className="flex-1">
					<Pair title="Wins">{json.woolhunt_participated_wins}</Pair>
					<Pair title="Losses">{json.woolhunt_participated_losses}</Pair>
					<Pair title="Win/Loss Ratio">{Utils.ratio(json.woolhunt_participated_wins, json.woolhunt_participated_losses)}</Pair>
					<Pair title="Fastest Win">{Utils.secondsToHms(json.woolhunt_fastest_win)}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Kills">{json.woolhunt_kills}</Pair>
					<Pair title="Assists">{json.woolhunt_assists}</Pair>
					<Pair title="Deaths">{json.woolhunt_deaths}</Pair>
					<Pair title="Kill/Death Ratio">{Utils.ratio(json.woolhunt_kills, json.woolhunt_deaths)}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Wools Stolen">{json.woolhunt_wools_stolen}</Pair>
					<Pair title="Wools Captured">{json.woolhunt_wools_captured}</Pair>
					<Pair title="Fastest Wool Capture">{Utils.secondsToHms(json.woolhunt_fastest_wool_capture)}</Pair>
					<Pair title="Total Gold Earned" color="gold">{json.woolhunt_gold_earned}</Pair>
					<Pair title="Total Gold Spent" color="gold">{Utils.abs(json.woolhunt_gold_spent)}</Pair>
				</div>
			</div>

			<HorizontalLine className="my-3" />

			<Title>Mini Walls</Title>
			<div className="h-flex">
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

			<HorizontalLine className="my-3" />

			<Title>Pixel Party</Title>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Pair title="Wins">{pixelPartyJson.wins}</Pair>
					<Pair title="Losses">{pixelPartyJson.losses}</Pair>
					<Pair title="Win/Loss Ratio">{pixelPartyJson.wl}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Games Played">{pixelPartyJson.games_played}</Pair>
					<Pair title="Rounds Completed">{pixelPartyJson.rounds_completed}</Pair>
					<Pair title="Highest Round">{pixelPartyJson.highest_round}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Power-Ups Collected">{pixelPartyJson.power_ups_collected}</Pair>
				</div>
			</div>
			{pixelPartyTable}

			<HorizontalLine className="my-3" />

			<Title>Zombies</Title>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Pair title="Wins">{json.wins_zombies}</Pair>
					<Br/>
					<Pair title="Rounds Survived">{json.total_rounds_survived_zombies}</Pair>
					<Pair title="Best Round">{json.best_round_zombies}</Pair>
					<Pair title="Zombies Killed">{json.zombie_kills_zombies}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Bullets Hit">{json.bullets_hit_zombies}</Pair>
					<Pair title="Bullets Shot">{json.bullets_shot_zombies}</Pair>
					<Pair title="Bullet Hit Accuracy" percentage>{Utils.ratio(json.bullets_hit_zombies, json.bullets_shot_zombies)}</Pair>
					<Pair title="Headshots">{json.headshots_zombies}</Pair>
					<Pair title="Headshot Accuracy" percentage>{Utils.ratio(json.headshots_zombies, json.bullets_hit_zombies)}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Players Revived">{json.players_revived_zombies}</Pair>
					<Pair title="Times Knocked Down">{json.times_knocked_down_zombies}</Pair>
					<Br/>
					<Pair title="Doors Opened">{json.doors_opened_zombies}</Pair>
					<Pair title="Windows Repaired">{json.windows_repaired_zombies}</Pair>
				</div>
			</div>
			{zombiesMapTable}
			{zombiesTypeTable}

			<HorizontalLine className="mt-3" />

			<div className="h-flex flex-wrap">
				<ArcadeMinigame title="Blocking Dead">
					<Pair title="Wins">{json.wins_dayone}</Pair>
					<Pair title="Kills">{json.kills_dayone}</Pair>
					<Pair title="Headshots">{json.headshots_dayone}</Pair>
					<Pair title="Melee Weapon"> 
						{Utils.capitalize((json.melee_weapon || '-').split('_').join(' '))} 
					</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Bounty Hunters">
					<Pair title="Wins">{json.wins_oneinthequiver}</Pair>
					<Pair title="Kills">{json.kills_oneinthequiver}</Pair>
					<Pair title="Deaths">{json.deaths_oneinthequiver}</Pair>
					<Pair title="Kill/Death Ratio">{Utils.ratio(json.kills_oneinthequiver, json.deaths_oneinthequiver)}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Creeper Attack">
					<Pair title="Best Wave">{json.max_wave}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Dragon Wars">
					<Pair title="Wins">{json.wins_dragonwars2}</Pair>
					<Pair title="Kills">{json.kills_dragonwars2}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Dropper">
					<Pair title="Wins">{dropperJson.wins}</Pair>
					<Pair title="Flawless Games">{dropperJson.flawless_games}</Pair>
					<Pair title="Games Completed">{dropperJson.games_finished}</Pair>
					<Pair title="Maps Completed">{dropperJson.maps_completed}</Pair>
					<Pair title="Fastest Game">{Utils.millisecondsToHmsl(dropperJson.fastest_game)}</Pair>
					<Pair title="Fails">{dropperJson.fails}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Easter Simulator">
					<Pair title="Wins">{json.wins_easter_simulator}</Pair>
					<Pair title="Eggs Found">{json.eggs_found_easter_simulator}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Ender Spleef">
					<Pair title="Wins">{json.wins_ender}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Farm Hunt">
					<Pair title="Wins">{json.wins_farm_hunt}</Pair>
					<Pair title="Poop Collected">{json.poop_collected}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Football">
					<Pair title="Wins">{json.wins_soccer}</Pair>
					<Pair title="Goals">{json.goals_soccer}</Pair>
					<Pair title="Kicks">{json.kicks_soccer}</Pair>
					<Pair title="Powerkicks">{json.powerkicks_soccer}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Galaxy Wars">
					<Pair title="Wins">{json.sw_game_wins}</Pair>
					<Pair title="Kills">{json.sw_kills}</Pair>
					<Pair title="Empire Kills">{json.sw_empire_kills}</Pair>
					<Pair title="Rebel Kills">{json.sw_rebel_kills}</Pair>
					<Pair title="Deaths">{json.sw_deaths}</Pair>
					<Pair title="Kill/Death Ratio">{Utils.ratio(json.sw_wins, json.sw_deaths)}</Pair>
					<Pair title="Shots Fired">{json.sw_shots_fired}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Grinch Simulator v2">
					<Pair title="Wins">{json.wins_grinch_simulator_v2}</Pair>
					<Pair title="Presents Stolen">{json.gifts_grinch_simulator_v2}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Halloween Simulator">
					<Pair title="Wins">{json.wins_halloween_simulator}</Pair>
					<Pair title="Candy Found">{json.candy_found_halloween_simulator}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Hide and Seek">
					<Pair title="Wins as Seeker">{json.seeker_wins_hide_and_seek}</Pair>
					<Pair title="Wins as Hider">{json.hider_wins_hide_and_seek}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Hole in the Wall">
					<Pair title="Wins">{json.wins_hole_in_the_wall}</Pair>
					<Pair title="Highest Score Qualifications">{json.hitw_record_q}</Pair>
					<Pair title="Highest Score Finals">{json.hitw_record_f}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Hypixel Says">
					<Pair title="Wins">{json.wins_simon_says}</Pair>
					<Pair title="Rounds">{json.rounds_simon_says}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Party Games">					
					<Pair title="Wins">{Utils.add(json.wins_party, json.wins_party_2, json.wins_party_3)}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Pixel Painters">
					<Pair title="Wins">{json.wins_draw_their_thing}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Santa Simulator">
					<Pair title="Presents Delivered">{json.delivered_santa_simulator}</Pair>
					<Pair title="Times Spotted">{json.spotted_santa_simulator}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Scuba Simulator">
					<Pair title="Wins">{json.wins_scuba_simulator}</Pair>
					<Pair title="Items Found">{json.items_found_scuba_simulator}</Pair>
					<Pair title="Total Points">{json.total_points_scuba_simulator}</Pair>
				</ArcadeMinigame>

				<ArcadeMinigame title="Throw Out">
					<Pair title="Wins">{json.wins_throw_out}</Pair>
					<Pair title="Kills">{json.kills_throw_out}</Pair>
					<Pair title="Deaths">{json.deaths_throw_out}</Pair>
					<Pair title="Kill/Death Ratio">{Utils.ratio(json.kills_throw_out, json.deaths_throw_out)}</Pair>
				</ArcadeMinigame>
			</div>
		</Accordion>
});

function ArcadeMinigame({title, children}) {
	return (
		<div className="mt-3" style={{width: '33%'}}>
			<p className="font-bold font-md pb-1">{title}</p>
			{children}
		</div>
	)
}