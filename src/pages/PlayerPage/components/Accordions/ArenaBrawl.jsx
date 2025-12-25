import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'src/components';
import { Box, Cell, Pair, Progress, ProgressBar, Row, Table } from 'src/components/Stats';
import { ARENABRAWL as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { getMostPlayed, findPrefix, calculatePrefixProgression, formatPrefix } from 'src/utils/hypixel';

/**
 * Stats accordion for Arena Brawl
 *
 * @param {number} props.index    The order in which to display the row (used by the dnd package)
 */
export const ArenaBrawl = memo((props) => {

	const { player } = useAPIContext();
	const json = Utils.traverse(player, 'stats.Arena', {});
	const ratios = {
		kd: Utils.ratio(total('kills'), total('deaths')),
		wl: Utils.ratio(total('wins'), total('losses')),
	}
	const mostPlayedMode = getMostPlayed(consts.MODES, 
		({id}) => Utils.add(json[`wins_${id}`], json[`losses_${id}`]));

	function total(stat) {
		return Utils.add(...consts.MODES.map(
			({id}) => json[`${stat}_${id}`]));
	}

	const totalWins = total('wins');
	const { prefix } = findPrefix(consts.PREFIXES, totalWins);
	const progression = calculatePrefixProgression(consts.PREFIXES, totalWins);

	const formattedPrefix = formatPrefix({
		prefixes: consts.PREFIXES,
		score: totalWins,
		trueScore: true
	});

	const header = (
		<React.Fragment>
			<Box title="Prefix">{formattedPrefix}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{total('wins')}</Box>
			<Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
	);

	const prefixProgress = (
		<React.Fragment>
			<div className="flex-1">
				<ProgressBar dataTip={`${totalWins}/${progression.next} Wins`}>
					<Progress
						proportion={progression.progressProportion}
						color={prefix.color === 'rainbow' ? 'gold' : prefix.color}
						dataTip={`${totalWins}/${progression.next} Wins`} />
				</ProgressBar>
			</div>
			{!progression.isMaxed && (
				<span className={`px-1 c-${consts.PREFIXES[findPrefix(consts.PREFIXES, totalWins).index + 1]?.color === 'rainbow' ? 'gold' : consts.PREFIXES[findPrefix(consts.PREFIXES, totalWins).index + 1]?.color || 'gold'}`}>
					{progression.next}
				</span>
			)}
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
					<th>Win Streaks</th>
				</tr>
			</thead>
			<tbody>
				{consts.MODES.map(({id, name}) => 
					Boolean(Utils.add(json[`kills_${id}`], json[`deaths_${id}`])) &&
					<Row key={id} isHighlighted={id === mostPlayedMode.id}>
						<Cell>{name}</Cell>
						<Cell>{json[`kills_${id}`]}</Cell>
						<Cell>{json[`deaths_${id}`]}</Cell>
						<Cell>{Utils.ratio(json[`kills_${id}`], json[`deaths_${id}`])}</Cell>
						<Cell>{json[`wins_${id}`]}</Cell>
						<Cell>{json[`losses_${id}`]}</Cell>
						<Cell>{Utils.ratio(json[`wins_${id}`], json[`losses_${id}`])}</Cell>
						<Cell>{json[`win_streaks_${id}`]}</Cell>
					</Row>
				)}
				{
					Boolean(Utils.add(total('wins'), total('losses'))) &&
					<Row id="">
						<Cell>Overall</Cell>
						<Cell>{total('kills')}</Cell>
						<Cell>{total('deaths')}</Cell>
						<Cell>{Utils.ratio(total('kills'), total('deaths'))}</Cell>
						<Cell>{total('wins')}</Cell>
						<Cell>{total('losses')}</Cell>
						<Cell>{Utils.ratio(total('wins'), total('losses'))}</Cell>
						<Cell>{total('win_streaks')}</Cell>
					</Row>
				}
			</tbody>
		</Table>
	);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="mb-3">
				<div className="mb-1 font-bold">Prefix Progress</div>
				<div className="h-flex">
					{prefixProgress}
				</div>
			</div>
			<Pair title="Coins" color="gold">{json.coins}</Pair>
			<Pair title="Keys" color="aqua">{json.keys}</Pair>
			<Pair title="Win Streaks" color="yellow">{total('win_streaks')}</Pair>

			<HorizontalLine className="my-3"/>

			{table}
		</Accordion>
});