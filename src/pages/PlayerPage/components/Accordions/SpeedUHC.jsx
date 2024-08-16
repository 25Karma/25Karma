import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'src/components';
import { Box, Cell, Pair, Progress, ProgressBar, Row, Table } from 'src/components/Stats';
import { SPEEDUHC as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { HypixelLeveling, getMostPlayed } from 'src/utils/hypixel';

/*
* Stats accordion for Speed UHC
*
* @param {number} props.index    The order in which to display the row (used by react-beautiful-dnd)
*/
export const SpeedUHC = memo((props) => {

	// The player's API data for Speed UHC
	const { player } = useAPIContext();
	const json = Utils.traverse(player,'stats.SpeedUHC') || {};
	const coins = Utils.traverse(player, 'stats.UHC.coins');
	
	const leveling = new HypixelLeveling(scoreToStar, starToScore, Utils.default0(json.score));
	if (leveling.levelCeiling > 10) leveling.levelCeiling = 10;
	const title = getTitle(leveling.levelFloor);
	const ratios = {
		kd : Utils.ratio(json.kills, json.deaths),
		wl : Utils.ratio(json.wins, json.losses),
	}

	const mostPlayedMode = getMostPlayed(consts.MODES,
		({id}) => Utils.add(json[`wins${id}`], json[`losses${id}`]));

	const mostPlayedMastery = getMostPlayed(consts.MASTERIES,
		({id}) => Utils.add(json[`wins${id}`], json[`losses${id}`]));

	function scoreToStar(score) {
		const title = consts.TITLES;
		for(let i = 0; i < title.length; i++) {
			if(score < title[i].value) {
				return i + (score - title[i-1].value) / (title[i].value - title[i-1].value);
			}
		}
	}

	function starToScore(star) {
		return consts.TITLES[star-1].value;	
	}

	function getTitle(star) {
		return consts.TITLES[star-1].name;
	}

	const header = (
		<React.Fragment>
			<Box title="Star" color="pink">{`[${leveling.levelFloor}❋]`}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{json.wins}</Box>
			<Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
		);

	const progressBar = (() => {
		let levelingProgressProps = {
			proportion: leveling.xp / starToScore(leveling.levelCeiling),
			color: 'white',
			dataTip: `${Utils.formatNum(leveling.xp)}/${Utils.formatNum(starToScore(leveling.levelCeiling))} Score`
		}
		if (leveling.levelFloor === 10) {
			levelingProgressProps = {
					proportion: 1,
					color: 'white',
					dataTip: `${Utils.formatNum(leveling.xp)}/${Utils.formatNum(starToScore(10))} Score`
				}
		}
		return (
			<React.Fragment>
				<div className="flex-1">
					<ProgressBar {...levelingProgressProps}>
						<Progress {...levelingProgressProps} />
					</ProgressBar>
				</div>
				<span className="px-1 c-white">
					{getTitle(leveling.levelCeiling)}
				</span>
			</React.Fragment>
			);
	})();

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
				</tr>
			</thead>
			<tbody>
			{
				consts.MODES.map(({id, name}) =>
					Boolean(Utils.add(json[`wins${id}`], json[`deaths${id}`])) &&
					<Row key={id} id={id} isHighlighted={id === mostPlayedMode.id}>
						<Cell>{name}</Cell>
						<Cell>{json[`kills${id}`]}</Cell>
						<Cell>{json[`deaths${id}`]}</Cell>
						<Cell>{Utils.ratio(json[`kills${id}`],json[`deaths${id}`])}</Cell>
						<Cell>{json[`wins${id}`]}</Cell>
						<Cell>{json[`losses${id}`]}</Cell>
						<Cell>{Utils.ratio(json[`wins${id}`],json[`losses${id}`])}</Cell>
					</Row>
					)
			}
			</tbody>
		</Table>
		);

	const masteriesTable = (
		<Table>
			<thead>
				<tr>
					<th>Mastery</th>
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
				consts.MASTERIES.map(({id, name}) =>
					Boolean(Utils.add(json[`wins${id}`], json[`losses${id}`])) &&
					<Row key={id} id={id} isHighlighted={id === mostPlayedMastery.id}>
						<Cell>{name}</Cell>
						<Cell>{json[`kills${id}`]}</Cell>
						<Cell>{json[`deaths${id}`]}</Cell>
						<Cell>{Utils.ratio(json[`kills${id}`],json[`deaths${id}`])}</Cell>
						<Cell>{json[`wins${id}`]}</Cell>
						<Cell>{json[`losses${id}`]}</Cell>
						<Cell>{Utils.ratio(json[`wins${id}`],json[`losses${id}`])}</Cell>
					</Row>
					)
			}
			</tbody>
		</Table>
	)

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="mb-3">
				<div className="mb-1 font-bold">Title Progress</div>
				<div className="h-flex">
					{progressBar}
				</div>
			</div>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Pair title="Score">{json.score}</Pair>
					<Pair title="Title" color="white">{title}</Pair>
					<Pair title="Coins" color="gold">{coins}</Pair>
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
			{table}

			<HorizontalLine className="my-3" />

			{masteriesTable}
		</Accordion>
});