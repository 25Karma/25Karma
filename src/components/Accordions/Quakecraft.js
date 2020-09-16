import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'components';
import { Box, Br, Cell, Pair, Row, Table } from 'components/Stats';
import { QUAKECRAFT as consts } from 'constants/hypixel';
import { useAPIContext } from 'hooks';
import * as Utils from 'utils';

/*
* Stats accordion for Quakecraft
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export const Quakecraft = memo((props) => {

	const { player } = useAPIContext();
	const json = Utils.traverse(player, 'stats.Quake', {});
	const ratios = {
		kd: Utils.ratio(total('kills'), total('deaths')),
		hk: Utils.ratio(total('headshots'), total('kills')),
		ks: Utils.ratio(total('kills'), total('shots_fired')),
	}

	function total(stat) {
		return Utils.add(...consts.MODES.map(
			({id}) => json[`${stat}${id}`]));
	}

	const header = (
		<Box title="KD">{ratios.kd}</Box>
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
					<th>Killstreaks</th>
					<th>Headshots</th>
					<th>Shots Fired</th>
					<th>HK</th>
					<th>KS</th>
				</tr>
			</thead>
			<tbody>
				{consts.MODES.map(({id, name}) =>
					Boolean(json[`shots_fired${id}`]) &&
					<Row key={id}>
						<Cell>{name}</Cell>
						<Cell>{json[`kills${id}`]}</Cell>
						<Cell>{json[`deaths${id}`]}</Cell>
						<Cell>{Utils.ratio(json[`kills${id}`], json[`deaths${id}`])}</Cell>
						<Cell>{json[`wins${id}`]}</Cell>
						<Cell>{json[`killstreaks${id}`]}</Cell>
						<Cell>{json[`headshots${id}`]}</Cell>
						<Cell>{json[`shots_fired${id}`]}</Cell>
						<Cell>{Utils.ratio(json[`headshots${id}`], json[`kills${id}`])}</Cell>
						<Cell>{Utils.ratio(json[`kills${id}`], json[`shots_fired${id}`])}</Cell>
					</Row>
				)}
				{
					Boolean(total('shots_fired')) &&
					<Row id="">
						<Cell>Overall</Cell>
						<Cell>{total('kills')}</Cell>
						<Cell>{total('deaths')}</Cell>
						<Cell>{ratios.kd}</Cell>
						<Cell>{total('wins')}</Cell>
						<Cell>{total('killstreaks')}</Cell>
						<Cell>{total('headshots')}</Cell>
						<Cell>{total('shots_fired')}</Cell>
						<Cell>{ratios.hk}</Cell>
						<Cell>{ratios.ks}</Cell>
					</Row>
				}
			</tbody>
		</Table>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="my-3">
				<Pair title="Coins" color="gold">{json.coins}</Pair>
				<Br />
				<Pair title="Highest Killstreak">{json.highest_killstreak}</Pair>
				<Pair title="Dash Cooldown">
					{json.dash_cooldown ? Number(json.dash_cooldown)+1 : 0}
				</Pair>
				<Pair title="Dash Power">
					{json.dash_power ? Number(json.dash_power)+1 : 0}
				</Pair>
			</div>

			<HorizontalLine />

			<div className="overflow-x my-3">
				{table}
			</div>
		</Accordion>
});