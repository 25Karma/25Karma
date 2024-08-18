import React, { memo, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Button, HorizontalLine, PlayerHead, Tippy } from 'src/components';
import { Box, Br, Cell, Pair, Progress, ProgressBar, Row, Table } from 'src/components/Stats';
import { SKYWARS as consts } from 'src/constants/hypixel';
import { useAPIContext, useAppContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { HypixelLeveling, getMostPlayed } from 'src/utils/hypixel';

/*
* Stats accordion for Skywars
*
* @param {number} props.index    The order in which to display the row (used by react-beautiful-dnd)
*/
export const SkyWars = memo((props) => {

	// Get the player's API data for SkyWars
	const { player } = useAPIContext();
	const { setBanner } = useAppContext();
	const json = useMemo(() => Utils.traverse(player,'stats.SkyWars') || {}, [player]);

	const leveling = new HypixelLeveling(xpToLevel, levelToXP,
		Utils.default0(json.skywars_experience));
	const prestige = getPrestige(leveling.level);
	const ratios = {
		ahm: Utils.ratio(json.arrows_hit, json.arrows_shot),
		kd : Utils.ratio(json.kills, json.deaths),
		wl : Utils.ratio(json.wins, json.losses),
		kw : Utils.ratio(json.kills, json.wins)
	}

	const corruptionChance = Utils.add(
		json.angel_of_death_level,
		json.angels_offering,
		Utils.traverse(json, 'packages', []).includes('favor_of_the_angel') && 1
	)
	
	const opalsEarned = Utils.traverse(player, 'achievements.skywars_opal_obsession');
	const totalOpals = Utils.add(opalsEarned, Math.max(0, consts.PRESTIGES.findIndex(n => n.name === prestige.name)-1));
	const totalShards = Utils.add(opalsEarned*20000, json.shard);

	const mostPlayedMode = getMostPlayed(consts.MODES,
		({id}) => Utils.add(json[`wins${id}`], json[`losses${id}`]));

	// State for the head collection 'View' button
	const [headButtonState, setHeadButtonState] = useState(false);

	function xpToLevel(xp) {
		var xps = consts.INITIAL_XP;
		if(xp >= 15000) {
			return (xp - 15000) / consts.RECURRING_XP + 12;
		} else {
			for(let i = 0; i < xps.length; i++) {
				if(xp < xps[i]) {
					return i + (xp - xps[i-1]) / (xps[i] - xps[i-1]);
				}
			}
		}
	}

	function levelToXP(lvl) {
		let xp = 0;
		for (let i = 0; i < lvl; i++) {
			if (i < consts.INITIAL_XP.length) {
				xp = consts.INITIAL_XP[i];
			}
			else {
				xp += consts.RECURRING_XP;
			}
		}
		return xp;
	}

	function getPrestige(level) {
		for (const pres of consts.PRESTIGES.slice().reverse()) {
			if (pres.level <= Math.floor(level)) return pres
		}
	}

	const prestigeIcon = (() => {
		const icon = json.selected_prestige_icon;
		if (icon === undefined) {
			return '\u22c6';
		}
		const icons = consts.ICONS;
		return icons[icon];
	})();

	const header = (
		<React.Fragment>
			<Box title="Level">
			{`${
				Utils.toColorCode(prestige.b_color)}[${
				Utils.toColorCode(prestige.color)}${leveling.levelFloor}${prestigeIcon}\ufe0e${
				Utils.toColorCode(prestige.b_color)}]
			`}
			</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{json.wins}</Box>
			<Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
		);

	const levelProgress = (
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
				consts.MODES.map(({id, name}) => 
					Boolean(Utils.add(json[`wins${id}`], json[`losses${id}`])) &&
					<Row key={id} id={id} isHighlighted={id === mostPlayedMode.id}>
						<Cell>{name}</Cell>
						<Cell>{json[`kills${id}`]}</Cell>
						<Cell>{json[`deaths${id}`]}</Cell>
						<Cell>{Utils.ratio(json[`kills${id}`],json[`deaths${id}`])}</Cell>
						<Cell>{json[`wins${id}`]}</Cell>
						<Cell>{json[`losses${id}`]}</Cell>
						<Cell>{Utils.ratio(json[`wins${id}`],json[`losses${id}`])}</Cell>
					</Row>
					)
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
					<Pair title="Prestige" color={prestige.color}>{`${prestige.name} ${prestigeIcon}\ufe0e`}</Pair>
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
					<Pair title="Kills">{json.kills}</Pair>
					<Pair title="Deaths">{json.deaths}</Pair>
					<Pair title="Assists">{json.assists}</Pair>
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
					<Pair title="Wins">{json.wins}</Pair>
					<Pair title="Lab Wins">{json.wins_lab}</Pair>
					<Pair title="Losses">{json.losses}</Pair>
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