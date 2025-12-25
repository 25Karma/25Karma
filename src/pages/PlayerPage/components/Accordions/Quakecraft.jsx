import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'src/components';
import { Box, Br, Cell, Pair, Progress, ProgressBar, Row, Table } from 'src/components/Stats';
import { QUAKECRAFT as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { findPrefix, calculatePrefixProgression, formatPrefix, abbreviateNumber } from 'src/utils/hypixel';

/**
 * Stats accordion for Quakecraft
 *
 * @param {number} props.index    The order in which to display the row (used by the dnd package)
 */
export const Quakecraft = memo((props) => {

	const { player } = useAPIContext();
	const json = Utils.traverse(player, 'stats.Quake', {});
	const godlikes = Utils.traverse(player, 'achievements.quake_godlikes');
	const ratios = {
		kd: Utils.ratio(total('kills'), total('deaths')),
		hk: Utils.ratio(total('headshots'), total('kills_since_update_feb_2017')),
		ks: Utils.ratio(total('kills_since_update_feb_2017'), total('shots_fired')),
	}

	function total(stat) {
		return Utils.add(...consts.MODES.map(
			({id}) => json[`${stat}${id}`]));
	}

	const totalKills = total('kills');
	const cappedKills = Math.min(totalKills, 2000000);
	const { prefix } = findPrefix(consts.PREFIXES, cappedKills);
	const progression = calculatePrefixProgression(consts.PREFIXES, cappedKills);

	const formattedPrefix = formatPrefix({
		prefixes: consts.PREFIXES,
		score: cappedKills,
		trueScore: true
	});

	const header = (
		<React.Fragment>
			<Box title="Prefix">{formattedPrefix}</Box>
			<Box title="Kills">{total('kills')}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{total('wins')}</Box>
		</React.Fragment>
	);

	const prefixProgress = (
		<React.Fragment>
			<div className="flex-1">
				<ProgressBar dataTip={`${Utils.formatNum(cappedKills)}/${Utils.formatNum(progression.next)} Kills`}>
					<Progress
						proportion={progression.progressProportion}
						color={prefix.color}
						dataTip={`${Utils.formatNum(cappedKills)}/${Utils.formatNum(progression.next)} Kills`} />
				</ProgressBar>
			</div>
			{!progression.isMaxed && (
				<span className={`px-1 c-${consts.PREFIXES[findPrefix(consts.PREFIXES, cappedKills).index + 1]?.color || 'gold'}`}>
					{(() => { const [num, suffix] = abbreviateNumber(progression.next); return Math.floor(num) + suffix; })()}
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
						<Cell>{Utils.ratio(json[`headshots${id}`], json[`kills_since_update_feb_2017${id}`])}</Cell>
						<Cell>{Utils.ratio(json[`kills_since_update_feb_2017${id}`], json[`shots_fired${id}`])}</Cell>
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
			<div className="mb-3">
				<div className="mb-1 font-bold">Prefix Progress</div>
				<div className="h-flex">
					{prefixProgress}
				</div>
			</div>
			<Pair title="Coins" color="gold">{json.coins}</Pair>
			<Br />
			<Pair title="Godlikes">{godlikes}</Pair>
			<Pair title="Highest Killstreak">{json.highest_killstreak}</Pair>
			<Pair title="Dash Cooldown">
				{json.dash_cooldown ? Number(json.dash_cooldown)+1 : 0}
			</Pair>
			<Pair title="Dash Power">
				{json.dash_power ? Number(json.dash_power)+1 : 0}
			</Pair>

			<HorizontalLine className="my-3" />

			{table}
		</Accordion>
});