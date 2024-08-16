import React, { memo } from 'react';
import { Accordion } from 'src/components';
import { Box, Br, Pair } from 'src/components/Stats';
import { PIT as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';

/*
* Stats accordion for the Hypixel Pit
*
* @param {number} props.index    The order in which to display the row (used by react-beautiful-dnd)
*/
export const Pit = memo((props) => {

	const { player } = useAPIContext();
	const stats = Utils.traverse(player, 'stats.Pit.pit_stats_ptl', {});
	const profile = Utils.traverse(player, 'stats.Pit.profile', {});
	const ratios = {
		kd: Utils.ratio(stats.kills, stats.deaths),
		kad: Utils.ratio(Utils.add(stats.kills, stats.assists), stats.deaths),
		shm: Utils.ratio(stats.sword_hits, stats.left_clicks),
		ahm: Utils.ratio(stats.arrow_hits, stats.arrows_fired),
		ddt: Utils.ratio(stats.damage_dealt, stats.damage_received),
	}
	const prestige = (() => {
		let length = Utils.traverse(profile, 'prestiges', {}).length
		return (length > consts.MAXPRESTIGE ? consts.MAXPRESTIGE : length) || 0
	})()
	const level = (() => {
		let xp = profile.xp;
		let PRESTIGE_MULTIPLIERS = consts.PRESTIGE_MULTIPLIERS
		let LEVEL_REQUIREMENTS = consts.LEVEL_REQUIREMENTS

		if (prestige > 0) {
			xp = xp - PRESTIGE_MULTIPLIERS[prestige-1]['SumXp']
		}
		
		let multiplier = PRESTIGE_MULTIPLIERS[prestige]['Multiplier']
		let level = 0

		while (xp > 0 && level < 120) {
			let levelXp = LEVEL_REQUIREMENTS[Math.floor(level / 10)] * multiplier
			if (xp >= levelXp * 10) {
				xp -= levelXp * 10
				level += 10
			}
			else {
				let gain = Math.floor(xp / levelXp)
				level += gain
				xp -= gain * levelXp
				xp = 0
			}
		}

		return level
	})();
	const levelColor = (() => {
		for (const lvl of consts.LEVELCOLORS.slice().reverse()) {
			if (lvl.level <= level) return lvl.color;
		}
	})();
	const prestigeColor = (() => {
		for (const pres of consts.PRESTIGECOLORS.slice().reverse()) {
			if (pres.prestige <= prestige) return pres.color;
		}
	})();

	const header = (
		<React.Fragment>
			<Box title="Level">
				{
					prestige > 0 ?
					`${
						Utils.toColorCode(prestigeColor)
					}[§e${
						Utils.romanize(prestige)
					}${
						Utils.toColorCode(prestigeColor)
					}-${
						Utils.toColorCode(levelColor)
					}${
						level
					}${
						Utils.toColorCode(prestigeColor)
					}]`
					:
					`§7[${Utils.toColorCode(levelColor)}${level}§7]`
				}
			</Box>
			<Box title="KD">{ratios.kd}</Box>
		</React.Fragment>
		);

	return Utils.isEmpty(stats) || Utils.isEmpty(profile) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="h-flex">
				<div className="flex-1">
					<Pair title="Prestige" color={prestigeColor}>{Utils.romanize(prestige)}</Pair>
					<Pair title="Level" color={levelColor}>{level}</Pair>
					<Pair title="Gold" color="gold">{Math.floor(Utils.default0(profile.cash))}</Pair>
					<Pair title="Lifetime Gold" color="gold">{stats.cash_earned}</Pair>
					<Pair title="XP" color="aqua">{profile.xp}</Pair>
					<Pair title="Renown" color="yellow">{profile.renown}</Pair>
					<Br />
					<Pair title="Playtime">{Utils.secondsToHms(Utils.default0(stats.playtime_minutes)*60)}</Pair>
					<Pair title="Kill+Assists/Hour">
						{Utils.ratio(Utils.add(stats.kills, stats.assists), Utils.default0(stats.playtime_minutes)/60)}
					</Pair>
					<Pair title="Gold/Hour" color="gold">
						{Utils.ratio(stats.cash_earned, Utils.default0(stats.playtime_minutes)/60)}
					</Pair>
					<Pair title="XP/Hour" color="aqua">
						{Utils.ratio(profile.xp, Utils.default0(stats.playtime_minutes)/60)}
					</Pair>
					<Br />
					<Pair title="Kills">{stats.kills}</Pair>
					<Pair title="Assists">{stats.assists}</Pair>
					<Pair title="Deaths">{stats.deaths}</Pair>
					<Pair title="Kill/Death Ratio">{ratios.kd}</Pair>
					<Pair title="Kill+Assist/Death Ratio">{ratios.kad}</Pair>
					<Pair title="Highest Killstreak">{stats.max_streak}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Damage Dealt">{stats.damage_dealt}</Pair>
					<Pair title="Damage Taken">{stats.damage_received}</Pair>
					<Pair title="Melee Damage Dealt">{stats.melee_damage_dealt}</Pair>
					<Pair title="Melee Damage Taken">{stats.melee_damage_received}</Pair>
					<Pair title="Bow Damage Dealt">{stats.bow_damage_dealt}</Pair>
					<Pair title="Bow Damage Taken">{stats.bow_damage_received}</Pair>
					<Pair title="Damage Dealt/Taken Ratio">{ratios.ddt}</Pair>
					<Br />
					<Pair title="Sword Hits">{stats.sword_hits}</Pair>
					<Pair title="Sword Swings">{stats.left_clicks}</Pair>
					<Pair title="Sword Hit Accuracy" percentage>{ratios.shm}</Pair>
					<Br />
					<Pair title="Arrows Hit">{stats.arrow_hits}</Pair>
					<Pair title="Arrows Shot">{stats.arrows_fired}</Pair>
					<Pair title="Arrow Hit Accuracy" percentage>{ratios.ahm}</Pair>
					<Br />
					<Pair title="Contracts Completed">{stats.contracts_completed}</Pair>
					<Pair title="Jumps into Pit">{stats.jumped_into_pit}</Pair>
					<Pair title="Launcher Launches">{stats.launched_by_launchers}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Golden Apples Eaten">{stats.gapple_eaten}</Pair>
					<Pair title="Golden Heads Eaten">{stats.ghead_eaten}</Pair>
					<Pair title="Soups Drank">{stats.soups_drank}</Pair>
					<Pair title="Rage Potatoes Eaten">{stats.rage_potatoes_eaten}</Pair>
					<Pair title="Fishing Rods Launched">{stats.fishing_rod_launched}</Pair>
					<Pair title="Lava Buckets Emptied">{stats.lava_bucket_emptied}</Pair>
					<Pair title="Diamond Items Purchased">{stats.diamond_items_purchased}</Pair>
					<Pair title="Blocks Placed">{stats.blocks_placed}</Pair>
					<Pair title="Blocks Broken">{stats.blocks_broken}</Pair>
					<Br />
					<Pair title="Tier 1 Mystics Enchanted">{stats.enchanted_tier1}</Pair>
					<Pair title="Tier 2 Mystics Enchanted">{stats.enchanted_tier2}</Pair>
					<Pair title="Tier 3 Mystics Enchanted">{stats.enchanted_tier3}</Pair>
					<Pair title="Dark Pants Created">{stats.dark_pants_crated}</Pair>
					<Br />
					<Pair title="Wheat Farmed">{stats.wheat_farmed}</Pair>
					<Pair title="Fished Anything">{stats.fished_anything}</Pair>
					<Pair title="Fished Fish">{stats.fishes_fished}</Pair>
					<Pair title="King's Quest Completions">{stats.king_quest_completion}</Pair>
					<Pair title="Sewer Treasures Found">{stats.sewer_treasures_found}</Pair>
				</div>
			</div>
		</Accordion>
});