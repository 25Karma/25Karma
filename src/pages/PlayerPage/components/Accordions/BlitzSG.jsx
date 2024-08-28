import React, { memo } from 'react';
import { Accordion, Button, ExternalLink, HorizontalLine } from 'src/components';
import { Box, Cell, Pair, Row, Table } from 'src/components/Stats';
import { BLITZSG as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { getMostPlayed } from 'src/utils/hypixel';

/**
 * Stats accordion for Blitz Survival Games
 *
 * @param {number} props.index    The order in which to display the row (used by the dnd package)
 */
export const BlitzSG = memo((props) => {

	const { mojang, player } = useAPIContext();
	const json = Utils.traverse(player, 'stats.HungerGames', {});
	const totalWins = Utils.add(json.wins_solo_normal, json.wins_teams_normal);
	const gamesPlayed = Utils.add(totalWins, json.deaths);
	const ratios = {
		kd: Utils.ratio(json.kills, json.deaths),
		kg: Utils.ratio(json.kills, gamesPlayed),
	};
	const mostPlayedKit = getMostPlayed(consts.KITS, 
		({id}) => Utils.default0(json[`time_played_${id}`]));

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
		return Utils.romanize(pres);
	}

	const header = (
		<React.Fragment>
			<Box title="Main" color={mostPlayedKit.name && 'white'}>{mostPlayedKit.name || '-'}</Box>
			<Box title="Kills">{json.kills}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{totalWins}</Box>
		</React.Fragment>
	);

	const kitsTable = (
		<Table>
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
					<Row key={id} isHighlighted={id === mostPlayedKit.id}>
						<Cell color={kitLevel(id) === 'X' && 'darkred'}>{`${name} ${kitLevel(id)}`}</Cell>
						<Cell>{json[`exp_${id}`]}</Cell>
						<Cell>{prestige(id)}</Cell>
						<Cell>{json[`kills_${id}`]}</Cell>
						<Cell>{wins(id)}</Cell>
						<Cell>{losses(id)}</Cell>
						<Cell>{Utils.ratio(wins(id), losses(id))}</Cell>
						<Cell>{Utils.secondsToHms(json[`time_played_${id}`])}</Cell>
					</Row>
				)}
			</tbody>
		</Table>
		);

	const modesTable = (
		<Table>
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
					<Row key={id}>
						<Cell>{name}</Cell>
						<Cell>{json[`kills_${id}`]}</Cell>
						<Cell>{json[`wins_${id}`] || '-'}</Cell>
					</Row>
				)}
			</tbody>
		</Table>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="h-flex mb-2">
				<div className="flex-1">
					<Pair title="Coins" color="gold">{json.coins}</Pair>
					<Pair title="Damage Dealt">{json.damage}</Pair>
					<Pair title="Damage Taken">{json.damage_taken}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Kills">{json.kills}</Pair>
					<Pair title="Deaths">{json.deaths}</Pair>
					<Pair title="Kill/Death Ratio">{ratios.kd}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Wins">{totalWins}</Pair>
					<Pair title="Games Played">{gamesPlayed}</Pair>
					<Pair title="Kill/Game Ratio">{ratios.kg}</Pair>
				</div>
			</div>
			<ExternalLink href={`https://gen.plancke.io/blitz/${mojang.uuid}/3.png`}>
				<Button>
					<span className="font-bold">Kit Levels</span>
				</Button>
			</ExternalLink>

			<HorizontalLine className="my-3"/>

			{kitsTable}

			<HorizontalLine className="my-3"/>

			{modesTable}
		</Accordion>
});