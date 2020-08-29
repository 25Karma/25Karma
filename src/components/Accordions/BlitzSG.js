import React, { memo } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Accordion, Box, Button, ExternalLink, 
	HorizontalLine, ReactIcon, StatCell, StatPair, StatRow, StatTable } from 'components';
import { BLITZSG as consts } from 'constants/hypixel';
import { useHypixelContext } from 'hooks';
import * as Utils from 'utils';

/*
* Stats accordion for Blitz Survival Games
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export const BlitzSG = memo((props) => {

	const { mojang, player } = useHypixelContext();
	const json = Utils.traverse(player, 'stats.HungerGames', {});
	const totalWins = Utils.add(json.wins_solo_normal, json.wins_teams_normal);
	const gamesPlayed = Utils.add(totalWins, json.deaths);
	const ratios = {
		kd: Utils.ratio(json.kills, json.deaths),
		kg: Utils.ratio(json.kills, gamesPlayed),
	};
	const mostPlayedKit = (() => {
		let mostPlayed = null;
		let mostTime = 0;
		for (const {id, name} of consts.KITS) {
			const playTime = Utils.default0(json[`time_played_${id}`])
			if (playTime > mostTime) {
				mostPlayed = name;
				mostTime = playTime;
			}
		}
		return mostPlayed;
	})();

	function wins(kit) {
		return Utils.add(json[`wins_${kit}`], json[`wins_teams_${kit}`]);
	}

	function losses(kit) {
		return Utils.subtract(json[`games_played_${kit}`], wins(kit));
	}

	function kitLevel(kit) {
		let level = json[kit];
		if (level === undefined) {
			level = -1;
			const exp = Utils.default0(json[`exp_${kit}`]);
			for (const kitexp of consts.KITEXP.slice()) {
				if (exp >= kitexp) {
					level++;
				}
				else {
					break;
				}
			}
		}
		return Utils.romanize(level+1);
	}

	function prestige(kit) {
		const pres = json[`p${kit}`];
		return pres === undefined ? '-' : Utils.romanize(pres);
	}

	const header = (
		<React.Fragment>
			<Box title="Main" color={mostPlayedKit && 'white'}>{mostPlayedKit || '-'}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{totalWins}</Box>
		</React.Fragment>
	);

	const kitsTable = (
		<StatTable>
			<thead>
				<tr>
					<th>Kit</th>
					<th>Exp</th>
					<th>Prestige</th>
					<th>Kills</th>
					<th>Wins</th>
					<th>Losses</th>
					<th>WL</th>
					<th>Time Played</th>
				</tr>
			</thead>
			<tbody>
				{consts.KITS.map(({id, name}) =>
					(Boolean(json[`time_played_${id}`]) || Boolean(json[id])) &&
					<StatRow key={id} isHighlighted={name === mostPlayedKit}>
						<StatCell color={kitLevel(id) === 'X' && 'darkred'}>{`${name} ${kitLevel(id)}`}</StatCell>
						<StatCell>{json[`exp_${id}`]}</StatCell>
						<StatCell>{prestige(id)}</StatCell>
						<StatCell>{json[`kills_${id}`]}</StatCell>
						<StatCell>{wins(id)}</StatCell>
						<StatCell>{losses(id)}</StatCell>
						<StatCell>{Utils.ratio(wins(id), losses(id))}</StatCell>
						<StatCell>{Utils.secondsToHms(json[`time_played_${id}`])}</StatCell>
					</StatRow>
				)}
			</tbody>
		</StatTable>
		);

	const modesTable = (
		<StatTable>
			<thead>
				<tr>
					<th>Mode</th>
					<th>Kills</th>
					<th>Wins</th>
				</tr>
			</thead>
			<tbody>
				{consts.MODES.map(({id, name}) => 
					(Boolean(json[`wins_${id}`]) || Boolean(json[`kills_${id}`])) &&
					<StatRow key={id}>
						<StatCell>{name}</StatCell>
						<StatCell>{json[`kills_${id}`]}</StatCell>
						<StatCell>{json[`wins_${id}`] || '-'}</StatCell>
					</StatRow>
				)}
			</tbody>
		</StatTable>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="h-flex mt-3 mb-2">
				<div className="flex-1">
					<StatPair title="Coins" color="gold">{json.coins}</StatPair>
					<StatPair title="Damage Dealt">{json.damage}</StatPair>
					<StatPair title="Damage Taken">{json.damage_taken}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Kills">{json.kills}</StatPair>
					<StatPair title="Deaths">{json.deaths}</StatPair>
					<StatPair title="Kill/Death Ratio">{ratios.kd}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Wins">{totalWins}</StatPair>
					<StatPair title="Games Played">{gamesPlayed}</StatPair>
					<StatPair title="Kill/Game Ratio">{ratios.kg}</StatPair>
				</div>
			</div>
			<div className="mb-3">
				<ExternalLink href={`https://gen.plancke.io/blitz/${mojang.uuid}/3.png`}>
					<Button>
						<span className="font-bold pr-1">Kit Levels</span>
						<ReactIcon icon={FaExternalLinkAlt} size="sm" />
					</Button>
				</ExternalLink>
			</div>

			<HorizontalLine />

			<div className="overflow-x my-3">
				{kitsTable}
			</div>

			<HorizontalLine />

			<div className="overflow-x my-3">
				{modesTable}
			</div>
		</Accordion>
});