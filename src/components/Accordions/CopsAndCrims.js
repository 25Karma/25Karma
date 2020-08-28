import React, { memo } from 'react';
import { Accordion, Box, HorizontalLine, Progress, 
	ProgressBar, StatCell, StatPair } from 'components';
import { COPSANDCRIMS as consts } from 'constants/hypixel';
import { useHypixelContext } from 'hooks';
import * as Utils from 'utils';

/*
* Stats accordion for Cops and Crims
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export const CopsAndCrims = memo((props) => {

	const { player } = useHypixelContext();
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
			<Box title="Kills">{total('kills')}</Box>
			<Box title="Wins">{total('game_wins')}</Box>
		</React.Fragment>
		);

	const table = (
		<table>
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
						<StatCell>{name}</StatCell>
						<StatCell>{json[`kills${id}`]}</StatCell>
						<StatCell>{json[`deaths${id}`]}</StatCell>
						<StatCell>{Utils.ratio(json[`kills${id}`], json[`deaths${id}`])}</StatCell>
						<StatCell>{json[`cop_kills${id}`]}</StatCell>
						<StatCell>{json[`criminal_kills${id}`]}</StatCell>
						<StatCell>{json[`game_wins${id}`]}</StatCell>
					</tr>
				)}
			</tbody>
		</table>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="h-flex my-3">
				<div className="flex-1">
					<StatPair title="Coins" color="gold">{json.coins}</StatPair>
					<br />
					<StatPair title="Kills">{total('kills')}</StatPair>
					<StatPair title="Assists">{total('assists')}</StatPair>
					<StatPair title="Deaths">{total('deaths')}</StatPair>
					<StatPair title="Kill/Death Ratio">{ratios.kd}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Game Wins">{total('game_wins')}</StatPair>
					<StatPair title="Round Wins">{json.round_wins}</StatPair>
					<br />
					<StatPair title="Bombs Planted">{json.bombs_planted}</StatPair>
					<StatPair title="Bombs Defused">{json.bombs_defused}</StatPair>
					<StatPair title="Shots Fired">{json.shots_fired}</StatPair>
					<StatPair title="Headshots">{json.headshot_kills}</StatPair>
				</div>
			</div>
			
			<HorizontalLine />

			<div className="overflow-x my-3">
				{table}
			</div>

			<HorizontalLine />

			<div className="font-bold font-md text-center mt-3 mb-2">Weapons</div>
			<div className="h-flex justify-content-center flex-wrap mb-3">
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
		<div className="v-flex w-100 mb-2 p-1" style={{maxWidth: '21rem'}}>
			<span className="font-bold mb-1 text-center">{name}</span>
			{upgrades.map(upgrade =>
				<div className="mb-1" key={upgrade.name}>
					<div>{upgrade.name}</div>
					<ProgressBar>
						<Progress 
							proportion={upgrade.level/9}
							color={upgrade.color}>
							{Utils.romanize(upgrade.level)}
						</Progress>
					</ProgressBar>
				</div>
			)}
		</div>
}