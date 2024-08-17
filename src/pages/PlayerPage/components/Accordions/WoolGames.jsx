import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'src/components';
import { Box, Br, Cell, Pair, Progress, ProgressBar, Row, Table, Title } from 'src/components/Stats';
import { WOOLGAMES as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { HypixelLeveling, getMostPlayed } from 'src/utils/hypixel';

export const WoolGames = memo((props) => {
	const { player } = useAPIContext();
	const json = Utils.traverse(player, 'stats.WoolGames', {});
	const progression = Utils.traverse(json, 'progression', {});
	const ctwStats = Utils.traverse(json, 'capture_the_wool.stats', {});
	const sheepWarsStats = Utils.traverse(json, 'sheep_wars.stats', {});
	const woolWarsStats = Utils.traverse(json, 'wool_wars.stats', {});

	const total = {
		wins: Utils.add(ctwStats.participated_wins, sheepWarsStats.wins, woolWarsStats.wins),
		kills: Utils.add(ctwStats.kills, sheepWarsStats.kills, woolWarsStats.kills),
	};

	const leveling = new HypixelLeveling(xpToLevel, levelToXP, Utils.default0(progression.experience));
	const prestige = getPrestige(leveling.level);

	// Stats specific to Wool Wars
	const classes = {
		assault: {},
		tank: {},
		golem: {},
		swordsman: {},
		engineer: {},
		archer: {}
	};
	Object.assign(classes, Utils.traverse(woolWarsStats, 'classes', {}));

	const mostPlayedClass = getMostPlayed(consts.CLASSES,
		({id}) => Utils.add(classes[id].kills, classes[id].blocks_broken, classes[id].wool_placed, classes[id].assists, classes[id].powerups_gotten));
	
	const selectedClass = Utils.traverse(json, 'wool_wars', {}).selected_class || 'None'
	const selectedClassColor = (() => {
		if (selectedClass === 'None') return 1
		return consts.DIFFICULTIES[consts.CLASSES.filter(({ id }) => id === selectedClass.toLowerCase())[0].difficulty]
	})();

	function getExpReq(level) {
		let progress = level % 100

		if (level === 0) return 0;
		else if (progress < 5) return consts.EASY_XP[progress];
		else return consts.NORMAL_XP;
	}

	function xpToLevel(xp) {
		let remainingXP = xp;
		let lvl = 1;
		let deltaXP = getExpReq(lvl);
		while(remainingXP > 0) {
			deltaXP = getExpReq(lvl);
			remainingXP -= deltaXP;
			lvl++;
		}
		return lvl + remainingXP/deltaXP;
	}

	function levelToXP(lvl) {
		let xp = 0;
		for (let i = 0; i < lvl; i++) {
			xp += getExpReq(i);
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
			const icon = Utils.traverse(json, 'wool_wars_prestige_icon', 'HEART');
			return consts.ICONS[icon] || `<Error icon="${icon}"/>`;
		})();

		const tag = `[${levelFloor}${prestigeIcon}]`;
		const coloredTag = tag.split('').map((char, index) => {
			const color = prestige.colormap[index];
			return color ? `§${color}${char}` : char;
		}).join('');

		return {tag: coloredTag, ...prestige};
	}

	function titleCase(str) {
		return str.toLowerCase().split(' ').map(function(word) {
			return (word.charAt(0).toUpperCase() + word.slice(1));
		}).join(' ');
	}

	const header = (
		<React.Fragment>
			<Box title="Main" color={consts.DIFFICULTIES[mostPlayedClass.difficulty]}>{mostPlayedClass.name || '-'}</Box>
			<Box title="Level">{prestige.tag}</Box>
			<Box title="Wins">{total.wins}</Box>
			<Box title="Kills">{total.kills}</Box>
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

	const woolWarsTable = (
		<Table>
			<thead>
				<tr>
					<th>Class</th>
					<th>Kills</th>
					<th>Assists</th>
					<th>Deaths</th>
					<th>KD</th>
					<th>Wool Placed</th>
					<th>Wool Broken</th>
					<th>Powerups</th>
				</tr>
			</thead>
			<tbody>
				{
					consts.CLASSES.map(({id,name,difficulty}) => 
						Boolean(Utils.add(classes[id].kills, classes[id].deaths)) &&
						<Row key={id} isHighlighted={id === mostPlayedClass.id}>
							<Cell color={consts.DIFFICULTIES[difficulty]}>{name}</Cell>
							<Cell>{classes[id].kills}</Cell>
							<Cell>{classes[id].assists}</Cell>
							<Cell>{classes[id].deaths}</Cell>
							<Cell>{Utils.ratio(classes[id].kills, classes[id].deaths)}</Cell>
							<Cell>{classes[id].wool_placed}</Cell>
							<Cell>{classes[id].blocks_broken}</Cell>
							<Cell>{classes[id].powerups_gotten}</Cell>
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

			<div className="mb-3">
				<div className="mb-1 font-bold">Leveling Progress</div>
				<div className="h-flex">
					{progressBar}
				</div>
			</div>
			<div className="h-flex">
				<div className="flex-1">
					<Pair title="Level">{leveling.level}</Pair>
					<Pair title="Prestige" color={prestige.color}>{prestige.name}</Pair>
					<Pair title="Playtime">{Utils.secondsToHms(Utils.default0(json.playtime)*60)}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Wool" color="gold">{json.coins}</Pair>
					<Pair title="Layers"><span className="c-green">{progression.available_layers || 0}</span>/<span className="c-green">100</span></Pair>
				</div>
				<div className="flex-1">
					<Pair title="Total Kills">{total.kills}</Pair>
					<Pair title="Total Wins">{total.wins}</Pair>
				</div>
			</div>

			<HorizontalLine className="my-3" />

			<Title>Capture The Wool</Title>
			<div className="h-flex">
				<div className="flex-1">
					<Pair title="Kills">{ctwStats.kills}</Pair>
					<Pair title="Assists">{ctwStats.assists}</Pair>
					<Pair title="Deaths">{ctwStats.deaths}</Pair>
					<Pair title="Kill/Death Ratio">{Utils.ratio(ctwStats.kills, ctwStats.deaths)}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Wins">{ctwStats.participated_wins}</Pair>
					<Pair title="Losses">{ctwStats.participated_losses}</Pair>
					<Pair title="Win/Loss Ratio">{Utils.ratio(ctwStats.participated_wins, ctwStats.participated_losses)}</Pair>
					<Pair title="Fastest Win">{Utils.secondsToHms(ctwStats.fastest_win)}</Pair>
					<Pair title="Longest Game">{Utils.secondsToHms(ctwStats.longest_game)}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Wools Stolen">{ctwStats.wools_stolen}</Pair>
					<Pair title="Wools Captured">{ctwStats.wools_captured}</Pair>
					<Pair title="Fastest Wool Capture">{Utils.secondsToHms(ctwStats.fastest_wool_capture)}</Pair>
					<Pair title="Total Gold Earned" color="gold">{ctwStats.gold_earned}</Pair>
					<Pair title="Total Gold Spent" color="gold">{Utils.abs(ctwStats.gold_spent)}</Pair>
				</div>
			</div>

			<HorizontalLine className="my-3" />

			<Title>Sheep Wars</Title>
			<div className="h-flex">
				<div className="flex-1">
					<Pair title="Kills">{sheepWarsStats.kills}</Pair>
					<Pair title="Deaths">{sheepWarsStats.deaths}</Pair>
					<Pair title="Kill/Death Ratio">{Utils.ratio(sheepWarsStats.kills, sheepWarsStats.deaths)}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Wins">{sheepWarsStats.wins}</Pair>
					<Pair title="Losses">{sheepWarsStats.losses}</Pair>
					<Pair title="Win/Loss Ratio">{Utils.ratio(sheepWarsStats.wins, sheepWarsStats.losses)}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Sheep Thrown">{sheepWarsStats.sheep_thrown}</Pair>
					<Pair title="Damage Dealt">{sheepWarsStats.damage_dealt}</Pair>
				</div>
			</div>

			<HorizontalLine className="my-3" />

			<Title>Wool Wars</Title>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Pair title="Selected Class" color={selectedClassColor}>{titleCase(selectedClass)}</Pair>
					<Pair title="Kills">{woolWarsStats.kills}</Pair>
					<Pair title="Assists">{woolWarsStats.assists}</Pair>
					<Pair title="Deaths">{woolWarsStats.deaths}</Pair>
					<Pair title="Kill/Death Ratio">{Utils.ratio(woolWarsStats.kills, woolWarsStats.deaths)}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Wins">{woolWarsStats.wins}</Pair>
					<Pair title="Losses">{Utils.subtract(woolWarsStats.games_played, woolWarsStats.wins)}</Pair>
					<Pair title="Win/Loss Ratio">{Utils.ratio(woolWarsStats.wins, Utils.subtract(woolWarsStats.games_played, woolWarsStats.wins))}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Wool Placed">{woolWarsStats.wool_placed}</Pair>
					<Pair title="Wool Broken">{woolWarsStats.blocks_broken}</Pair>
					<Pair title="Powerups">{woolWarsStats.powerups_gotten}</Pair>
				</div>
			</div>
			{woolWarsTable}

		</Accordion>
});