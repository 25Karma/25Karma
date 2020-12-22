import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'components';
import { Box, Br, Cell, Pair, Progress, ProgressBar, Title, Table } from 'components/Stats';
import { COPSANDCRIMS as consts } from 'constants/hypixel';
import { useAPIContext } from 'hooks';
import * as Utils from 'utils';

/*
* Stats accordion for Cops and Crims
*
* @param {number} props.index    The order in which to display the row (used by react-beautiful-dnd)
*/
export const CopsAndCrims = memo((props) => {

	const { player } = useAPIContext();
	const json = Utils.traverse(player, 'stats.MCGO', {});
	const score = Math.floor(
		total('kills') / 2
		+ Utils.add(json.bombs_planted, json.bombs_defused) / 3
		+ total('game_wins')
		+ Utils.ratio(total('kills'), json.shots_fired) * 200
		);
	const prefixColor = (() => {
		for (const s of consts.SCORE.slice().reverse()) {
			if (score >= s.score) return s.color;
		}
	})();
	const ratios = {
		kd: Utils.ratio(total('kills'), total('deaths')),
	}

	function total(id) {
		return Utils.add(json[id], json[`${id}_deathmatch`]);
	}

	const header = (
		<React.Fragment>
			<Box title="Score" color={prefixColor}>{score}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{total('game_wins')}</Box>
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
					<th>Cop Kills</th>
					<th>Criminal Kills</th>
					<th>Wins</th>
				</tr>
			</thead>
			<tbody>
				{consts.MODES.map(({id, name}) =>
					<tr key={id}>
						<Cell>{name}</Cell>
						<Cell>{json[`kills${id}`]}</Cell>
						<Cell>{json[`deaths${id}`]}</Cell>
						<Cell>{Utils.ratio(json[`kills${id}`], json[`deaths${id}`])}</Cell>
						<Cell>{json[`cop_kills${id}`]}</Cell>
						<Cell>{json[`criminal_kills${id}`]}</Cell>
						<Cell>{json[`game_wins${id}`]}</Cell>
					</tr>
				)}
			</tbody>
		</Table>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="h-flex my-3">
				<div className="flex-1">
					<Pair title="Coins" color="gold">{json.coins}</Pair>
					<Br />
					<Br />
					<Pair title="Kills">{total('kills')}</Pair>
					<Pair title="Assists">{total('assists')}</Pair>
					<Pair title="Deaths">{total('deaths')}</Pair>
					<Pair title="Kill/Death Ratio">{ratios.kd}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Game Wins">{total('game_wins')}</Pair>
					<Pair title="Round Wins">{json.round_wins}</Pair>
					<Br />
					<Pair title="Bombs Planted">{json.bombs_planted}</Pair>
					<Pair title="Bombs Defused">{json.bombs_defused}</Pair>
					<Pair title="Shots Fired">{json.shots_fired}</Pair>
					<Pair title="Headshots">{json.headshot_kills}</Pair>
				</div>
			</div>
			
			<HorizontalLine />

			<div className="overflow-x my-3">
				{table}
			</div>

			<HorizontalLine />

			<Title>Weapons</Title>
			<div className="h-flex justify-content-center flex-wrap overflow-x mb-3">
				{consts.GUNS.map(gun => <Gun gun={gun} json={json} key={gun.id}/>)}
			</div>
		</Accordion>
});

function Gun(props) {
	const { json, gun: {id, name} } = props;
	const upgrades = [];
	consts.UPGRADES.map(upgrade => {
		const level = Utils.default0(json[`${id}_${upgrade.id}`]);
		if (Boolean(level)) {
			upgrades.push({name: upgrade.name, level, color: getUpgradeColor(level)});
		}
		return null;
	})

	function getUpgradeColor(level) {
		for (const l of consts.UPGRADELEVELS.slice().reverse()) {
			if (level >= l.level) return l.color;
		}
	}

	return Boolean(upgrades.length) &&
		<table className="w-100 p-1" style={{maxWidth: '30rem'}}>
			<thead>
				<tr><th colSpan="2">{name}</th></tr>
			</thead>
			<tbody>
				{upgrades.map(upgrade =>
					<tr key={upgrade.name}>
						<td className="td-shrink text-right">{upgrade.name}</td>
						<td>
							<ProgressBar>
								<Progress 
									proportion={upgrade.level/9}
									color={upgrade.color}>
									{Utils.romanize(upgrade.level)}
								</Progress>
							</ProgressBar>
						</td>
					</tr>
				)}
			</tbody>
		</table>
}