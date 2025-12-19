import React, { memo, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Button, HorizontalLine, MinecraftText, PlayerHead, Tippy } from 'src/components';
import { Box, Br, Cell, Pair, Progress, ProgressBar, Row, Table } from 'src/components/Stats';
import { SKYWARS as consts } from 'src/constants/hypixel';
import { useAPIContext, useAppContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { HypixelLeveling, getMostPlayed } from 'src/utils/hypixel';

/**
 * Stats accordion for Skywars
 *
 * @param {number} props.index    The order in which to display the row (used by the dnd package)
 */
export const SkyWars = memo((props) => {

	const { player } = useAPIContext();
	const { setBanner } = useAppContext();
	const json = useMemo(() => Utils.traverse(player,'stats.SkyWars') || {}, [player]);

	const cumulativeXP = useMemo(() => consts.XP_TO_LEVEL.reduce((acc, xp, i) => {
		acc.push((acc[i - 1] || 0) + xp);
		return acc;
	}, []), []);
	const constantLevelingXP = cumulativeXP[cumulativeXP.length - 1];

	function xpToLevel(xp) {
		if (xp >= constantLevelingXP) {
			const xpAboveConstant = xp - constantLevelingXP;
			const level = (xpAboveConstant / consts.RECURRING_XP) + consts.XP_TO_LEVEL.length;
			return Math.min(level, consts.LEVEL_MAX);
		}
		for (let i = 0; i < cumulativeXP.length; i++) {
			if (xp < cumulativeXP[i]) {
				const prevXP = i > 0 ? cumulativeXP[i - 1] : 0;
				return i + (xp - prevXP) / (cumulativeXP[i] - prevXP);
			}
		}
		return consts.XP_TO_LEVEL.length;
	}

	function levelToXP(lvl) {
		if (lvl <= 0) return 0;
		if (lvl < cumulativeXP.length) {
			return cumulativeXP[lvl - 1] || 0;
		}
		return constantLevelingXP + (lvl - consts.XP_TO_LEVEL.length) * consts.RECURRING_XP;
	}

	const leveling = new HypixelLeveling(xpToLevel, levelToXP,
		Utils.default0(json.skywars_experience));

	const prestige = consts.getPrestige(json.active_scheme, leveling.level);

	const formattedLevel = consts.getFormattedLevel(
		leveling.level,
		json.active_scheme,
		json.active_emblem,
		json.levelFormattedWithBrackets
	);

	// exclude mini from overall stats (kills, wins, and assists are included in api totals, but deaths/losses are not)
	const miniWins = json.wins_mini || 0;
	const miniKills = json.kills_mini || 0;
	const miniAssists = json.assists_mini || 0;
	
	const overallKills = Utils.subtract(json.kills, miniKills);
	const overallDeaths = json.deaths;
	const overallWins = Utils.subtract(json.wins, miniWins);
	const overallLosses = json.losses;
	const overallAssists = Utils.subtract(json.assists, miniAssists);

	const ratios = {
		ahm: Utils.ratio(json.arrows_hit, json.arrows_shot),
		kd : Utils.ratio(overallKills, overallDeaths),
		wl : Utils.ratio(overallWins, overallLosses),
		kw : Utils.ratio(overallKills, overallWins)
	}

	const corruptionChance = Utils.add(
		json.angel_of_death_level,
		json.angels_offering,
		Utils.traverse(json, 'packages', []).includes('favor_of_the_angel') && 1
	)
	
	const opalsEarned = Utils.traverse(player, 'achievements.skywars_opal_obsession');
	const totalOpals = Utils.add(opalsEarned, Math.max(0, consts.PRESTIGE_SCHEMES.findIndex(n => n.name === prestige.name) - 1));
	const totalShards = Utils.add(opalsEarned*20000, json.shard);

	const mostPlayedMode = getMostPlayed(consts.MODES,
		({id}) => Utils.add(json[`wins${id}`], json[`losses${id}`]));

	// State for the head collection 'View' button
	const [headButtonState, setHeadButtonState] = useState(false);

	const header = (
		<React.Fragment>
			<Box title="Level">{formattedLevel}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{overallWins}</Box>
			<Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
		);

	// use default prestige colors for progress bar
	const defaultPrestige = consts.getDefaultPrestige(leveling.level);
	const progressGradient = consts.getSchemeGradientColors(defaultPrestige.id);

	// formatted level numbers for progress bar with no brackets or emblem
	const floorLevelFormatted = consts.getLevelNumberFormatted(leveling.levelFloor);
	const ceilingLevelFormatted = consts.getLevelNumberFormatted(leveling.levelCeiling);

	const levelProgress = (
		<React.Fragment>
			<span className="px-1">
				<MinecraftText font={false} size="sm">{floorLevelFormatted}</MinecraftText>
			</span>
			<div className="flex-1">
				<ProgressBar 
					dataTip={`${leveling.xpAboveLevel}/${leveling.levelTotalXP} XP`}>
					<Progress
						proportion={leveling.proportionAboveLevel}
						color={defaultPrestige.color}
						gradient={progressGradient}
						dataTip={`${leveling.xpAboveLevel}/${leveling.levelTotalXP} XP`} />
				</ProgressBar>
			</div>
			<span className="px-1">
				<MinecraftText font={false} size="sm">{ceilingLevelFormatted}</MinecraftText>
			</span>
		</React.Fragment>
		);

	const table = (
		<Table>
			<thead>
				<tr>
					<th>Mode</th>
					<th>Kills</th>
					<th>Deaths</th>
					<th>KD</th>
					<th>Wins</th>
					<th>Losses</th>
					<th>WL</th>
				</tr>
			</thead>
			<tbody>
			{
					consts.MODES.map(({ id, name, isMini }) => {
						// mini is calculated differently than other modes
						if (isMini) {
							const wins = json.wins_mini;
							const kills = json.kills_mini;
							const games = json.games_mini;
							// mini doesn't track deaths/losses - calculate from games
							const losses = Utils.subtract(games, wins);
							const deaths = losses;
							if (!games) return null;
							return (
								<Row key={id} id={id} isHighlighted={id === mostPlayedMode.id}>
									<Cell>{name}</Cell>
									<Cell>{kills}</Cell>
									<Cell>{deaths}</Cell>
									<Cell>{Utils.ratio(kills, deaths)}</Cell>
									<Cell>{wins}</Cell>
									<Cell>{losses}</Cell>
									<Cell>{Utils.ratio(wins, losses)}</Cell>
								</Row>
							);
						}
						// overall stats
						if (id === '') {
							if (!Utils.add(overallWins, overallLosses)) return null;
							return (
								<Row key={id} id={id} isHighlighted={id === mostPlayedMode.id}>
									<Cell>{name}</Cell>
									<Cell>{overallKills}</Cell>
									<Cell>{overallDeaths}</Cell>
									<Cell>{Utils.ratio(overallKills, overallDeaths)}</Cell>
									<Cell>{overallWins}</Cell>
									<Cell>{overallLosses}</Cell>
									<Cell>{Utils.ratio(overallWins, overallLosses)}</Cell>
								</Row>
							);
						}
						return (
							Boolean(Utils.add(json[`wins${id}`], json[`losses${id}`])) &&
							<Row key={id} id={id} isHighlighted={id === mostPlayedMode.id}>
								<Cell>{name}</Cell>
								<Cell>{json[`kills${id}`]}</Cell>
								<Cell>{json[`deaths${id}`]}</Cell>
								<Cell>{Utils.ratio(json[`kills${id}`], json[`deaths${id}`])}</Cell>
								<Cell>{json[`wins${id}`]}</Cell>
								<Cell>{json[`losses${id}`]}</Cell>
								<Cell>{Utils.ratio(json[`wins${id}`], json[`losses${id}`])}</Cell>
							</Row>
					);
				})
			}
			</tbody>
		</Table>
	);
	const shardProgress = (
		<ProgressBar 
			dataTip={`${Utils.default0(json.shard)}/20,000 Shards`}>
			<Progress
				proportion={Utils.ratio(json.shard, 20000)}
				color="aqua"
				dataTip={`${Utils.default0(json.shard)}/20,000 Shards`} />
		</ProgressBar>
	);
	
	// Data used by the 'Total Heads Gathered' section
	const headProgress = (() => {
		let progressList = [];
		for (const rank of consts.HEADS.slice().reverse()) {
			const amount = Utils.default0(json[`heads_${rank.id}`]);
			// Do not render a span if they are no heads with that rank
			if (amount === 0) continue;
			const proportion = Utils.ratio(amount/json.heads);
			progressList.push(
				<Progress
				key={rank.id}
				color={rank.color}	
				proportion={proportion}
				dataTip={`${amount} ${rank.name} head${amount === 1 ? '' : 's'}`}/>
				);
		}
		return (
			<ProgressBar>
				{progressList}
			</ProgressBar>
			)
	})();

	const prestigiousHeadCollection = (() => {
		const headArray = Utils.traverse(json,'head_collection.prestigious');
		if (headArray === undefined || headArray.length === 0) {
			return null;
		}
		let imgList = [];
		let i = 0;
		for (const head of headArray) {
			imgList.push(
				<Tippy key={`head-${i++}`} content={Utils.capitalize(head.sacrifice)}>
					<span>
						<Link to={`/player/${head.uuid}`} target="_blank" rel="noopener noreferrer">
							<PlayerHead uuid={head.uuid} type='head'/>
						</Link>
					</span>
				</Tippy>
				);
		} 
		imgList.reverse();
		return imgList;
	})();

	useEffect(() => {
		const headArray = Utils.traverse(json,'head_collection.prestigious');
		if (headButtonState && (headArray === undefined || headArray.length === 0)) {
			setBanner({
				style: "info",
				title: "This player has no prestigious heads. 😔",
				expire: true
			});
		}
	}, [headButtonState, json, setBanner]);

	
	return Utils.isEmpty(json) ? 
		<Accordion title={consts.TITLE} index={props.index} /> 
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="mb-3">
				<div className="mb-1 font-bold">Leveling Progress</div>
				<div className="h-flex">
					{levelProgress}
				</div>
			</div>
			<div className="h-flex">
				<div className="flex-1">
					<Pair title="Level">{leveling.level}</Pair>
					<Pair title="Prestige"><MinecraftText font={false} size="sm">{`${consts.getFormattedPrestigeName(leveling.level)} ${consts.getFormattedEmblem(json.active_emblem, leveling.level)}\ufe0e`}</MinecraftText></Pair>
					<Pair title="Coins" color="gold">{json.coins}</Pair>
					<Pair title="Tokens" color="darkgreen">{json.cosmetic_tokens}</Pair>
					<Br/>
					<Br/>
					<Pair title="Blocks Placed">{json.blocks_placed}</Pair>
					<Pair title="Blocks Broken">{json.blocks_broken}</Pair>
					<Pair title="Chests Opened">{json.chests_opened}</Pair>
					<Pair title="Arrows Hit">{json.arrows_hit}</Pair>
					<Pair title="Arrows Shot">{json.arrows_shot}</Pair>
					<Pair title="Arrow Hit Accuracy" percentage>{ratios.ahm}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Kills">{overallKills}</Pair>
					<Pair title="Deaths">{overallDeaths}</Pair>
					<Pair title="Assists">{overallAssists}</Pair>
					<Pair title="Kill/Death Ratio">{ratios.kd}</Pair>
					<Br/>
					<Br/>
					<Pair title="Melee Kills">{json.melee_kills}</Pair>
					<Pair title="Void Kills">{json.void_kills}</Pair>
					<Pair title="Bow Kills">{json.bow_kills}</Pair>
					<Pair title="Mob Kills">{json.mob_kills}</Pair>
					<Pair title="Eggs Thrown">{json.egg_thrown}</Pair>
					<Pair title="Pearls Thrown">{json.enderpearls_thrown}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Wins">{overallWins}</Pair>
					<Pair title="Lab Wins">{json.wins_lab}</Pair>
					<Pair title="Losses">{overallLosses}</Pair>
					<Pair title="Win/Loss Ratio">{ratios.wl}</Pair>
					<Pair title="Kill/Win Ratio">{ratios.kw}</Pair>
					<Br/>
					<Pair title="Heads">{json.heads}</Pair>
					<Pair title="Corruption">{`${corruptionChance}%`}</Pair>
					<Pair title="Total Souls">{json.souls_gathered}</Pair>
					<Pair title="Current Souls" color="aqua">{json.souls}</Pair>
					<Pair title="Paid Souls">{json.paid_souls}</Pair>
					<Pair title="Soul Well Uses">{json.soul_well}</Pair>
				</div>
			</div>
			
			<HorizontalLine className="my-3" />

			{table}
			
			<HorizontalLine className="my-3" />

			<div className="mb-1 font-bold">Shard Progress</div>
			<div className="mb-2">
				{shardProgress}
			</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Pair title="Shards" color="aqua">{json.shard}</Pair>
					<Pair title="Lifetime Shards" color="aqua">{totalShards}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Opals" color="blue">{json.opals}</Pair>
					<Pair title="Lifetime Opals" color="blue">{totalOpals}</Pair>
				</div>
			</div>
			<div className="mb-1">
				<Pair title="Total Heads Gathered">{json.heads}</Pair>
			</div>
			<div className="mb-3">
				{headProgress}
			</div>
			<div className="font-bold mb-2">Prestigious Head Collection</div>
			<div className="h-flex flex-wrap">
			{
				headButtonState ?
				prestigiousHeadCollection :
				<Button onClick={()=>{setHeadButtonState(true)}}>
					<span className="font-bold">View</span>
				</Button>
			}
			</div>
		</Accordion>
});