import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'src/components';
import { Box, Br, Cell, Pair, Row, Table, Title } from 'src/components/Stats';
import { MURDERMYSTERY as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { getMostPlayed } from 'src/utils/hypixel';

/**
 * Stats accordion for Murder Mystery
 *
 * @param {number} props.index    The order in which to display the row (used by the dnd package)
 */
export const MurderMystery = memo((props) => {

	// The player's API data for Murder Mystery
	const { player } = useAPIContext();
	const json = Utils.traverse(player,'stats.MurderMystery') || {};

	const losses = Utils.default0(json.games)-Utils.default0(json.wins);
	const knifeSkin = consts.KNIFESKINS[json.active_knife_skin];
	const fastestDetectiveWin = json.quickest_detective_win_time_seconds;
	const fastestMurdererWin = json.quickest_murderer_win_time_seconds;

	const mostPlayedMode = getMostPlayed(consts.MODES, 
		({id}) => Utils.default0(json[`games${id}`]));
	
	const header = (
		<React.Fragment>
			<Box title="Kills">{json.kills}</Box>
			<Box title="Wins">{json.wins}</Box>
		</React.Fragment>
		);

	const table = (() => {
		const legacyStartsAt = '_MURDER_HARDCORE';
		let rowList = [];
		for (const {id, name} of consts.MODES) {
			const losses = Utils.default0(json[`games${id}`])-Utils.default0(json[`wins${id}`]);
			if (id === legacyStartsAt) {
				rowList.push(
					<tr key="legacy"><th><div className="mt-2">Legacy Modes</div></th></tr>
					);
			}
			rowList.push(
				Boolean(json[`games${id}`]) &&
				<Row key={id} id={id} isHighlighted={id === mostPlayedMode.id}>
					<Cell>{name}</Cell>
					<Cell>{json[`kills${id}`]}</Cell>
					<Cell>{json[`bow_kills${id}`]}</Cell>
					<Cell>{json[`knife_kills${id}`]}</Cell>
					<Cell>{json[`thrown_knife_kills${id}`]}</Cell>
					<Cell>{json[`wins${id}`]}</Cell>
					<Cell>{losses}</Cell>
					<Cell>{Utils.ratio(json[`wins${id}`], losses)}</Cell>
					<Cell>{json[`coins_pickedup${id}`]}</Cell>
				</Row>
				);
		}
		return (
			<Table>
				<thead>
					<tr>
						<th>Mode</th>
						<th>Kills</th>
						<th>Bow Kills</th>
						<th>Knife Kills</th>
						<th>Thrown Knife Kills</th>
						<th>Wins</th>
						<th>Losses</th>
						<th>WL</th>
						<th>Gold Collected</th>
					</tr>
				</thead>
				<tbody>
					{rowList}
				</tbody>
			</Table>
			);
	})();

	const infectionStats = (() => {
		const losses = Utils.subtract(json.games_MURDER_INFECTION, json.wins_MURDER_INFECTION);
		return (
			<React.Fragment>
				<Title>Infection</Title>
				<div className="h-flex">
					<div className="flex-1">
						<Pair title="Kills as Infected">{json.kills_as_infected_MURDER_INFECTION}</Pair>
						<Pair title="Kills as Survivor">{json.kills_as_survivor_MURDER_INFECTION}</Pair>
						<Pair title="Final Kills">{json.kills_MURDER_INFECTION}</Pair>
					</div>
					<div className="flex-1">
						<Pair title="Wins">{json.wins_MURDER_INFECTION}</Pair>
						<Pair title="Losses">{Utils.abs(losses)}</Pair>
						<Pair title="Win/Loss Ratio">{Utils.ratio(json.wins_MURDER_INFECTION/Utils.abs(losses))}</Pair>
					</div>
					<div className="flex-1">
						<Pair title="Time Survived">{Utils.secondsToHms(json.total_time_survived_seconds_MURDER_INFECTION)}</Pair>
						<Pair title="Gold Collected">{json.coins_pickedup_MURDER_INFECTION}</Pair>
					</div>
				</div>
			</React.Fragment>
		);
	})();

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="h-flex">
				<div className="flex-1">
					<Pair title="Tokens" color="darkgreen">{json.coins}</Pair>
					<Br />
					<Pair title="Kills">{json.kills}</Pair>
					<Pair title="Kills as Murderer">{json.kills_as_murderer}</Pair>
					<Pair title="Thrown Knife Kills">{json.thrown_knife_kills}</Pair>
					<Pair title="Deaths">{json.deaths}</Pair>
					<Pair title="Kill/Death Ratio">{Utils.ratio(json.kills, json.deaths)}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Murder Weapon" color="red">{knifeSkin || '<unknown>'}</Pair>
					<Br />
					<Pair title="Wins">{json.wins}</Pair>
					<Pair title="Losses">{losses}</Pair>
					<Pair title="Win/Loss Ratio">{Utils.ratio(json.wins/losses)}</Pair>
					<Pair title="Fastest Detective Win">{Utils.secondsToHms(fastestDetectiveWin)}</Pair>
					<Pair title="Fastest Murderer Win">{Utils.secondsToHms(fastestMurdererWin)}</Pair>
				</div>
			</div>
			
			<HorizontalLine className="my-3" />

			{table}

			<HorizontalLine className="my-3" />

			{infectionStats}
		</Accordion>
});