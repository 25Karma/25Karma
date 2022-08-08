import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'components';
import { Box, Br, Cell, Pair, Progress, ProgressBar, Row, Table } from 'components/Stats';
import { WOOLWARS as consts } from 'constants/hypixel';
import { useAPIContext } from 'hooks';
import * as Utils from 'utils';
import { HypixelLeveling, getMostPlayed } from 'utils/hypixel';

export const WoolWars = memo((props) => {
	const { player } = useAPIContext();
	const json = Utils.traverse(player, 'stats.WoolGames', {});
	const progression = Utils.traverse(json, 'progression', {});
	const stats = Utils.traverse(json, 'wool_wars.stats', {});
	const classes = {
		assault: {},
		tank: {},
		golem: {},
		swordsman: {},
		engineer: {},
		archer: {}
	};
	Object.assign(classes, Utils.traverse(stats, 'classes', {}));

	const leveling = new HypixelLeveling(xpToLevel, levelToXP, Utils.default0(progression.experience));
	const prestige = getPrestige(leveling.level);
	const ratios = {
		kd: Utils.ratio(stats.kills, stats.deaths),
		wl: Utils.ratio(stats.wins, Utils.subtract(stats.games_played, stats.wins))
	}

	const mostPlayedClass = getMostPlayed(consts.CLASSES,
		({id}) => Utils.add(classes[id].kills, classes[id].blocks_broken, classes[id].wool_placed, classes[id].assists, classes[id].powerups_gotten));
	
	const selectedClass = Utils.traverse(json, 'wool_wars', {}).selected_class || 'None'
	const selectedClassColor = (() => {
		if (selectedClass === 'None') return 1
		return consts.DIFFICULTIES[consts.CLASSES.filter(({ id }) => id === selectedClass.toLowerCase())[0].difficulty]
	})();

	function getExpReq(level) {
		let progress = level % 100

		if (progress === 0) {
			return consts.EASY_XP[progress](level);
		}
		else {
			return consts.EASY_XP[progress];
		}
	}

	function xpToLevel(xp) {
		let remainingXP = xp;
		let lvl = 0;
		let deltaXP = getExpReq(lvl);
		while(remainingXP > 0) {
			deltaXP = consts.NORMAL_XP;
			if (lvl % 100 < 5) {
				deltaXP = getExpReq(lvl);
			}
			remainingXP -= deltaXP;
			lvl++;
		}
		return lvl + remainingXP/deltaXP;
	}

	function levelToXP(lvl) {
		let xp = 0;
		for (let i = 0; i < lvl; i++) {
			if (i % 100 < 5) {
				xp += getExpReq(i);
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
			<Box title="Wins">{stats.wins || 0}</Box>
			<Box title="Kills">{stats.kills || 0}</Box>
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

	const table = (
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
			<div className="h-flex">
				<div className='flex-1'>
					<Pair title="Selected Class" color={selectedClassColor}>
						{titleCase(selectedClass)}
					</Pair>
				</div>
			</div>
			<Br/>
			<div className="mb-3">
				<div className="mb-1 font-bold">Leveling Progress</div>
				<div className="h-flex">
					{progressBar}
				</div>
			</div>
			<div className="h-flex">
				<div className="flex-1">
					<Pair title="Level">{leveling.level}</Pair>
					<Pair title="Layers"><span className="c-green">{progression.available_layers || 0}</span>/<span className="c-green">100</span></Pair>
					<Pair title="Prestige" color={prestige.color}>{prestige.name}</Pair>
					<Pair title="Coins" color="gold">{json.coins}</Pair>
					<Br/>
					<Pair title="Kills">{stats.kills}</Pair>
					<Pair title="Assists">{stats.assists}</Pair>
					<Pair title="Deaths">{stats.deaths}</Pair>
					<Pair title="Kill/Death Ratio">{ratios.kd}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Wins">{stats.wins}</Pair>
					<Pair title="Losses">{Utils.subtract(stats.games_played, stats.wins)}</Pair>
					<Pair title="Win/Loss Ratio">{ratios.wl}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Wool Placed">{stats.wool_placed}</Pair>
					<Pair title="Wool Broken">{stats.blocks_broken}</Pair>
					<Pair title="Powerups">{stats.powerups_gotten}</Pair>
				</div>
			</div>

			<HorizontalLine className="my-3" />

			{table}
		</Accordion>
});