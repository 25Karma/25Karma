import React, { memo } from 'react';
import { Accordion, Button, ExternalLink, HorizontalLine } from 'src/components';
import { Box, Cell, Pair, Row, Span, Table } from 'src/components/Stats';
import { SMASHHEROES as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { getMostPlayed } from 'src/utils/hypixel';

/*
* Stats accordion for Smash Heroes
*
* @param {number} props.index    The order in which to display the row (used by react-beautiful-dnd)
*/
export const SmashHeroes = memo((props) => {

	const { mojang, player } = useAPIContext();
	const json = Utils.traverse(player, 'stats.SuperSmash', {});
	const ratios = {
		kd: Utils.ratio(json.kills, json.deaths),
		wl: Utils.ratio(json.wins, json.losses)
	};
	const mostPlayedMode = getMostPlayed(consts.MODES, 
		({id}) => Utils.add(json[`wins${id}`], json[`losses${id}`]));
	const mostPlayedHero = getMostPlayed(consts.HEROES, 
		({id}) => Utils.traverse(json, `class_stats.${id}.games`, 0));

	const header = (
		<React.Fragment>
			<Box title="Main" color={consts.DIFFICULTY[mostPlayedHero.difficulty-1]}>{mostPlayedHero.name || '-'}</Box>
			<Box title="Level">{`§b${Utils.default0(json.smashLevel)}§6\u2736`}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
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
				{consts.MODES.map(({id, name}) =>
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
				)}
			</tbody>
		</Table>
		);

		const heroesTable = (
		<Table>
			<thead>
				<tr>
					<th>Hero</th>
					<th>Kills</th>
					<th>Deaths</th>
					<th>KD</th>
					<th>Wins</th>
					<th>Losses</th>
					<th>WL</th>
				</tr>
			</thead>
			<tbody>
				{consts.HEROES.map(({id, name, difficulty}) =>
					Utils.isObject(Utils.traverse(json.class_stats, id)) &&
					<Row key={id} id={id} isHighlighted={id === mostPlayedHero.id}>
						<Cell shrink>
							<Span color={consts.DIFFICULTY[difficulty-1]}>{name}</Span>
							<Span color="gray">{' Lv'}</Span>
							<Span color="aqua">{json[`lastLevel_${id}`]}</Span>
							{json[`pg_${id}`] &&
								<Span 
									color={consts.PRESTIGECOLORS[json[`pg_${id}`]-1]}>
									{`【${json[`pg_${id}`]}】`}
								</Span>
							}
							&emsp;&emsp;
						</Cell>
						<Cell>{json.class_stats[id].kills}</Cell>
						<Cell>{json.class_stats[id].deaths}</Cell>
						<Cell>{Utils.ratio(json.class_stats[id].kills, json.class_stats[id].deaths)}</Cell>
						<Cell>{json.class_stats[id].wins}</Cell>
						<Cell>{json.class_stats[id].losses}</Cell>
						<Cell>{Utils.ratio(json.class_stats[id].wins, json.class_stats[id].losses)}</Cell>
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
					<Pair title="Smash Level" color="aqua">{json.smashLevel}</Pair>
					<Pair title="Damage Dealt">{json.damage_dealt}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Kills">{json.kills}</Pair>
					<Pair title="Deaths">{json.deaths}</Pair>
					<Pair title="Kill/Death Ratio">{ratios.kd}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Wins">{json.wins}</Pair>
					<Pair title="Losses">{json.losses}</Pair>
					<Pair title="Win/Loss Ratio">{ratios.wl}</Pair>
				</div>
			</div>
			<ExternalLink href={`gen.plancke.io/supersmash/${mojang.uuid}/2.png`}>
				<Button>
					<span className="font-bold">Hero Skins and Levels</span>
				</Button>
			</ExternalLink>

			<HorizontalLine className="my-3" />

			{modesTable}

			<HorizontalLine className="my-3" />

			{heroesTable}
		</Accordion>
});