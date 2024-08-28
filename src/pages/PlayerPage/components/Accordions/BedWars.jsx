import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'src/components';
import { Box, Br, Cell, Pair, Progress, ProgressBar, Row, Table } from 'src/components/Stats';
import { BEDWARS as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { HypixelLeveling, getMostPlayed } from 'src/utils/hypixel';

/**
 * Stats accordion for Bed Wars
 *
 * @param {number} props.index    The order in which to display the row (used by the dnd package)
 */
export const BedWars = memo((props) => {
	
	// The player's API data for Bed Wars
	const { player } = useAPIContext();
	const json = Utils.traverse(player,'stats.Bedwars', {});

	const leveling = new HypixelLeveling(xpToLevel, levelToXP, 
		Utils.default0(json.Experience) + Utils.default0(json.Experience_new));
	const prestige = getPrestige(leveling.level);
	const ratios = {
		kd : Utils.ratio(getCoreModeStat('kills_bedwars'), getCoreModeStat('deaths_bedwars')),
		fkd : Utils.ratio(getCoreModeStat('final_kills_bedwars'), getCoreModeStat('final_deaths_bedwars')),
		wl : Utils.ratio(getCoreModeStat('wins_bedwars'), getCoreModeStat('losses_bedwars')),
		bbl : Utils.ratio(getCoreModeStat('beds_broken_bedwars'), getCoreModeStat('beds_lost_bedwars'))
	}

	const mostPlayedMode = getMostPlayed(consts.MODES,
		({id}) => Utils.add(json[`${id}wins_bedwars`], json[`${id}losses_bedwars`]));

	const mostPlayedPracticeMode = getMostPlayed(consts.PRACTICEMODES,
		({id}) => Utils.add(Utils.traverse(json, `practice,${id}.successful_attempts`), 
		Utils.traverse(json, `practice.${id}.failed_attempts`)));

	const slumberJson = Utils.traverse(json, 'slumber', {});
	const slumberDoor = (() => {
		const roomList = Utils.traverse(slumberJson, 'room', {});
		for (const room of consts.SLUMBER_ROOMS.slice().reverse()) {
			if (roomList[room.id] === true) return room.name;
		}
		return '-';
	})();

	function xpToLevel(xp) {
		let remainingXP = xp;
		let lvl = 0;
		let deltaXP = consts.EASY_XP[0];
		while(remainingXP > 0) {
			deltaXP = consts.NORMAL_XP;
			if (lvl % 100 < 4) {
				deltaXP = consts.EASY_XP[lvl%100];
			}
			remainingXP -= deltaXP;
			lvl++;
		}
		return lvl + remainingXP/deltaXP;
	}

	function levelToXP(lvl) {
		let xp = 0;
		for (let i = 0; i < lvl; i++) {
			if (i % 100 < 4) {
				xp += consts.EASY_XP[i%100];
			}
			else {
				xp += consts.NORMAL_XP;
			}
		}
		return xp;
	}

	function getPrestige(level) {
		const levelFloor = Math.floor(level);
		const prestige = (() => {
			for (const pres of consts.PRESTIGES.slice().reverse()) {
				if (pres.level <= levelFloor) return pres;
			}
		})();
		const prestigeIcon = (() => {
			for (const icon of consts.PRESTIGE_ICONS.slice().reverse()) {
				if (icon.level <= levelFloor) return icon.symbol;
			}
		})();

		const tag = `[${levelFloor}${prestigeIcon}]`;
		const coloredTag = tag.split('').map((char, index) => {
			const color = prestige.colormap[index];
			return color ? `§${color}${char}` : char;
		}).join('');

		return {tag: coloredTag, icon: prestigeIcon, ...prestige};
	}

	function getCoreModeStat(suffix) {
		if (suffix === consts.WINSTREAK_SUFFIX) {
			return Utils.defaultUnknown(json.winstreak);
		}
		return Utils.subtract(json[suffix],json[`two_four_${suffix}`]);
	}

	const header = (
		<React.Fragment>
			<Box title="Level">{prestige.tag}</Box>
			<Box title="WS">{Utils.defaultUnknown(json.winstreak)}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="FKD">{ratios.fkd}</Box>
			<Box title="WL">{ratios.wl}</Box>
			<Box title="BBL">{ratios.bbl}</Box>
		</React.Fragment>
		);

	const progressBar = (
		<React.Fragment>
			<span className={`px-1 c-${getPrestige(leveling.levelFloor).color}`}>
				{leveling.levelFloor}
			</span>
			<div className="flex-1">
				<ProgressBar 
					dataTip={`${leveling.xpAboveLevel}/${leveling.levelTotalXP} XP`}>
					<Progress 
						proportion={leveling.proportionAboveLevel}
						color={prestige.color}
						dataTip={`${leveling.xpAboveLevel}/${leveling.levelTotalXP} XP`} />
				</ProgressBar>
			</div>
			<span className={`px-1 c-${getPrestige(leveling.levelCeiling).color}`}>
				{leveling.levelCeiling}
			</span>
		</React.Fragment>
		);

	const table = (() => {
		function renderRowForMode(id, name, computeStats) {
			return Boolean(Utils.add(json[`${id}wins_bedwars`], json[`${id}losses_bedwars`])) &&
				<Row key={name} id={id} isHighlighted={id === mostPlayedMode.id}>
					<Cell>{name}</Cell>
					<Cell>{computeStats('kills_bedwars')}</Cell>
					<Cell>{computeStats('deaths_bedwars')}</Cell>
					<Cell>{Utils.ratio(computeStats('kills_bedwars'),computeStats('deaths_bedwars'))}</Cell>

					<Cell>{computeStats('final_kills_bedwars')}</Cell>
					<Cell>{computeStats('final_deaths_bedwars')}</Cell>
					<Cell>{Utils.ratio(computeStats('final_kills_bedwars'),computeStats('final_deaths_bedwars'))}</Cell>

					<Cell>{computeStats('wins_bedwars')}</Cell>
					<Cell>{computeStats('losses_bedwars')}</Cell>
					<Cell>{Utils.ratio(computeStats('wins_bedwars'),computeStats('losses_bedwars'))}</Cell>
					<Cell>{Utils.defaultUnknown(computeStats(consts.WINSTREAK_SUFFIX))}</Cell>

					<Cell>{computeStats('beds_broken_bedwars')}</Cell>
					<Cell>{computeStats('beds_lost_bedwars')}</Cell>
					<Cell>{Utils.ratio(computeStats('beds_broken_bedwars'),computeStats('beds_lost_bedwars'))}</Cell>
				</Row>
		}

		const dreamsStartAt = 'two_four_';
		let rowList = [];
		for (const {id, name} of consts.MODES) {
			if (id === dreamsStartAt) {
				rowList.push(renderRowForMode('', 'Core Modes', getCoreModeStat));
				rowList.push(<tr key="spacer"><th>&nbsp;</th></tr>);
			}
			rowList.push(renderRowForMode(id, name, (suffix) => json[`${id}${suffix}`]));
		}
		return (
			<Table>
				<thead>
					<tr>
						<th></th>
						<th colSpan="3">Normal</th>
						<th colSpan="3">Final</th>
					</tr>
					<tr>
						<th>Mode</th>
						<th>Kills</th>
						<th>Deaths</th>
						<th>KD</th>
						<th>Kills</th>
						<th>Deaths</th>
						<th>KD</th>
						<th>Wins</th>
						<th>Losses</th>
						<th>WL</th>
						<th>WS</th>
						<th>BB</th>
						<th>BL</th>
						<th>BBL</th>
					</tr>
				</thead>
				<tbody>
					{rowList}
				</tbody>
			</Table>
			);
	})();

	const practiceTable = (
		<Table className="mb-2">
			<thead>
				<tr>
					<th>Practice Mode</th>
					<th>Blocks Placed</th>
					<th>Successes</th>
					<th>Fails</th>
					<th>Success Rate</th>
				</tr>
			</thead>
			<tbody>
			{
				consts.PRACTICEMODES.map(({id, name}) => {
					const modeJson = Utils.traverse(json, `practice.${id}`, {});
					const modeAttempts = Utils.add(modeJson.successful_attempts, modeJson.failed_attempts);
					return Boolean(modeAttempts) &&
						<Row key={id} id={id} isHighlighted={id === mostPlayedPracticeMode.id}>
							<Cell>{name}</Cell>
							<Cell>{modeJson.blocks_placed}</Cell>
							<Cell>{modeJson.successful_attempts}</Cell>
							<Cell>{modeJson.failed_attempts}</Cell>
							<Cell percentage>{Utils.ratio(modeJson.successful_attempts, modeAttempts)}</Cell>
						</Row>
				})
			}
			</tbody>
		</Table>
		);

	const bridgingRecordTable = (
		<Table>
			<thead>
				<tr>
					<th>Bridging Personal Bests</th>
					{
						consts.PRACTICEBRIDGING.bridging_distance.map((distance) => 
							<th key={distance}>{`${distance} Block`}</th>
						)
					}
				</tr>
			</thead>
			<tbody>
			{
				consts.PRACTICEBRIDGING.angle.map(({id: angleId, name: angleName}) =>
					consts.PRACTICEBRIDGING.elevation.map(({id: eleId, name: eleName}) =>
						Utils.traverse(json, 'practice.records', false) &&
						<Row key={eleId}>
							<Cell >{`${angleName} ${eleName}`}</Cell>
							{
								consts.PRACTICEBRIDGING.bridging_distance.map((distance) => {
									const personalBest = Utils.traverse(json, `practice.records.bridging_distance_${distance}:elevation_${eleId}:angle_${angleId}:`);
									return <Cell key={distance}>{personalBest !== undefined ? `${Utils.formatNum(personalBest/1000)}s` : '-'}</Cell>
								})
							}
						</Row>
					
				))
			}
			</tbody>
		</Table>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="mb-3">
				<div className="mb-1 font-bold">Leveling Progress</div>
				<div className="h-flex">
					{progressBar}
				</div>
			</div>
			<div className="h-flex">
				<div className="flex-1">
					<Pair title="Level">{leveling.level}</Pair>
					<Pair title="Prestige" color={prestige.color}>{prestige.name} {prestige.icon}</Pair>
					<Pair title="Tokens" color="darkgreen">{json.coins}</Pair>
					<Br/>
					<Pair title="Kills">{json.kills_bedwars}</Pair>
					<Pair title="Deaths">{json.deaths_bedwars}</Pair>
					<Pair title="Kill/Death Ratio">{ratios.kd}</Pair>
					<Pair title="Final Kills">{json.final_kills_bedwars}</Pair>
					<Pair title="Final Deaths">{json.final_deaths_bedwars}</Pair>
					<Pair title="Final Kill/Death Ratio">{ratios.fkd}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Winstreak">{json.winstreak}</Pair>
					<Pair title="Wins">{json.wins_bedwars}</Pair>
					<Pair title="Losses">{json.losses_bedwars}</Pair>
					<Pair title="Win/Loss Ratio">{ratios.wl}</Pair>
					<Br/>
					<Pair title="Beds Broken">{json.beds_broken_bedwars}</Pair>
					<Pair title="Beds Lost">{json.beds_lost_bedwars}</Pair>
					<Pair title="Beds Broken/Lost Ratio">{ratios.bbl}</Pair>
					<Br/>
					<Pair title="Total Challenges Completed">{json.total_challenges_completed}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Slumber Tickets"><span className="c-aqua">{Utils.formatNum(slumberJson.tickets)}</span>/{Utils.formatNum(consts.SLUMBER_WALLETS[slumberJson.bag_type])}</Pair>
					<Pair title="Lifetime Slumber Tickets" color="aqua">{slumberJson.total_tickets_earned}</Pair>
					<Pair title="Door Unlocked">{slumberDoor}</Pair>
					<Br/>
					<Pair title="Iron Collected">{json.iron_resources_collected_bedwars}</Pair>
					<Pair title="Gold Collected">{json.gold_resources_collected_bedwars}</Pair>
					<Pair title="Diamonds Collected">{json.diamond_resources_collected_bedwars}</Pair>
					<Pair title="Emeralds Collected">{json.emerald_resources_collected_bedwars}</Pair>
					<Pair title="Wrapped Presents Collected">{json.wrapped_present_resources_collected_bedwars}</Pair>
					<Pair title="Total Shop Purchases">{json._items_purchased_bedwars}</Pair>
				</div>
			</div>
			
			<HorizontalLine className="my-3" />

			{table}
			
			<HorizontalLine className="my-3" />

			{practiceTable}
			{bridgingRecordTable}
			
			<HorizontalLine className="my-3" />

			<div className="h-flex">
				<div className="flex-1">
					<Pair title="Projectile Kills">{Utils.add(json.projectile_kills_bedwars, json.projectile_final_kills_bedwars)}</Pair>
					<Pair title="Deaths to Drowning">{Utils.add(json.drowning_deaths_bedwars, json.drowning_final_deaths_bedwars)}</Pair>
					<Pair title="Deaths to Fire">{Utils.default0(json.fire_tick_deaths_bedwars)+Utils.default0(json.fire_deaths_bedwars)}</Pair>
					<Pair title="Deaths to Suffocation">{Utils.default0(json.suffocation_deaths_bedwars)+Utils.default0(json.suffocation_final_deaths_bedwars)}</Pair>
				</div>
			</div>
		</Accordion>
});