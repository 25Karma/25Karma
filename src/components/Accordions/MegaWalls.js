import React, { memo } from 'react';
import { Accordion, Button, ExternalLink, HorizontalLine } from 'components';
import { Box, Br, Cell, Pair, Row, Table } from 'components/Stats';
import { MEGAWALLS as consts } from 'constants/hypixel';
import { useAPIContext } from 'hooks';
import * as Utils from 'utils';
import { getMostPlayed } from 'utils/hypixel';

/*
* Stats accordion for Mega Walls
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export const MegaWalls = memo((props) => {

	const { mojang, player } = useAPIContext();
	const json = Utils.traverse(player, 'stats.Walls3', {});
	const ratios = {
		kd: Utils.ratio(json.kills, json.deaths),
		fkd: Utils.ratio(json.final_kills, json.final_deaths),
		wl: Utils.ratio(json.wins, json.losses),
	};

	const mostPlayedClass = getMostPlayed(consts.CLASSES,
		({id}) => Utils.add(json[`${id}_wins`], json[`${id}_losses`]));

	const mostPlayedMode = getMostPlayed(consts.MODES,
		({id}) => Utils.add(json[`wins${id}`], json[`losses${id}`]));

	function classLevels(id) {
		const classData = Utils.traverse(json, `classes.${id}`, {});
		return (
			<React.Fragment>
				<Cell>{Utils.romanize(Utils.default0(classData.prestige))}</Cell>
				<Cell>{classData.enderchest_rows}</Cell>
			</React.Fragment>
			)
	}

	const header = (
		<React.Fragment>
			<Box title="Main" color={consts.DIFFICULTIES[mostPlayedClass.difficulty]}>{mostPlayedClass.name || '-'}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="FKD">{ratios.fkd}</Box>
			<Box title="Wins">{json.wins}</Box>
      <Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
		);

	const classesTable = (
		<Table>
			<thead>
				<tr>
					<th></th>
					<th colSpan="3">Normal</th>
					<th colSpan="3">Final</th>
				</tr>
				<tr>
					<th>Class</th>
					<th>Kills</th>
					<th>Deaths</th>
					<th>KD</th>
					<th>Kills</th>
					<th>Deaths</th>
					<th>KD</th>
					<th>Wins</th>
					<th>Losses</th>
					<th>WL</th>
					<th>Prestige</th>
					<th>Ender Chest</th>
				</tr>
			</thead>
			<tbody>
				{
					consts.CLASSES.map(({id,name,difficulty}) => 
						Boolean(Utils.add(json[`${id}_wins`], json[`${id}_losses`])) &&
						<Row key={id} isHighlighted={id === mostPlayedClass.id}>
							<Cell color={consts.DIFFICULTIES[difficulty]}>{name}</Cell>
							<Cell>{json[`${id}_kills`]}</Cell>
							<Cell>{json[`${id}_deaths`]}</Cell>
							<Cell>{Utils.ratio(json[`${id}_kills`], json[`${id}_deaths`])}</Cell>
							<Cell>{json[`${id}_final_kills`]}</Cell>
							<Cell>{json[`${id}_final_deaths`]}</Cell>
							<Cell>{Utils.ratio(json[`${id}_final_kills`], json[`${id}_final_deaths`])}</Cell>
							<Cell>{json[`${id}_wins`]}</Cell>
							<Cell>{json[`${id}_losses`]}</Cell>
							<Cell>{Utils.ratio(json[`${id}_wins`], json[`${id}_losses`])}</Cell>
							{classLevels(id)}
						</Row>
						)
				}
			</tbody>
		</Table>
		);

	const modesTable = (
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
					consts.MODES.map(({id, name}) => Boolean(Utils.add(json[`kills${id}`], json[`deaths${id}`])) &&
						<Row key={id} id={id} isHighlighted={id === mostPlayedMode.id}>
							<Cell>{name}</Cell>
							<Cell>{json[`kills${id}`]}</Cell>
							<Cell>{json[`deaths${id}`]}</Cell>
							<Cell>{Utils.ratio(json[`kills${id}`], json[`deaths${id}`])}</Cell>
							<Cell>{json[`wins${id}`]}</Cell>
							<Cell>{json[`losses${id}`]}</Cell>
							<Cell>{Utils.ratio(json[`wins${id}`], json[`losses${id}`])}</Cell>
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
			<div className="mt-3 mb-2 h-flex">
				<div className="flex-1">
					<Pair title="Coins" color="gold">{json.coins}</Pair>
					<Pair title="Wither Damage Dealt">{Utils.add(json.witherDamage, json.wither_damage)}</Pair>
					<Br />
					<Br />
					<Pair title="Wins">{json.wins}</Pair>
					<Pair title="Practice Wins">{json.wins_practice}</Pair>
					<Pair title="Losses">{json.losses}</Pair>
					<Pair title="Practice Losses">{json.losses_practice}</Pair>
					<Pair title="Win/Loss Ratio">{ratios.wl}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Kills">{json.kills}</Pair>
					<Pair title="Assists">{json.assists}</Pair>
					<Pair title="Deaths">{json.deaths}</Pair>
					<Pair title="Kill/Death Ratio">{ratios.kd}</Pair>
					<Br />
					<Pair title="Final Kills">{json.final_kills}</Pair>
					<Pair title="Final Assists">{json.final_assists}</Pair>
					<Pair title="Final Deaths">{json.final_deaths}</Pair>
					<Pair title="Final Kill/Death Ratio">{ratios.fkd}</Pair>
				</div>
			</div>
			<div className="mb-3">
				<ExternalLink href={`https://gen.plancke.io/mw/${mojang.uuid}/2.png`}>
					<Button>
						<span className="font-bold">Class Skins and Levels</span>
					</Button>
				</ExternalLink>
			</div>

			<HorizontalLine />

			<div className="overflow-x my-3">
				{classesTable}
			</div>

			<HorizontalLine />

			<div className="overflow-x my-3">
				{modesTable}
			</div>
		</Accordion>
})