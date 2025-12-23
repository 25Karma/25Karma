import React, { memo } from 'react';
import { Accordion, HorizontalLine, MinecraftText } from 'src/components';
import { Box, Br, Cell, Pair, ProgressBar, Progress, Title, Table } from 'src/components/Stats';
import { TNTGAMES as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { findPrefix, colorToCode, rainbow } from 'src/utils/hypixel';

/**
 * Stats accordion for TNT Games
 *
 * @param {number} props.index    The order in which to display the row (used by the dnd package)
 */
export const TNTGames = memo((props) => {

	const { player } = useAPIContext();
	const json = Utils.traverse(player, 'stats.TNTGames', {});

	function renderWizardRow(wizard) {
		const ids = ['kills', 'deaths', 'assists', 'explode', 'regen'];
		const wizardStats = {};
		ids.map(id => {
			const value = json[`new_${wizard.id}wizard_${id}`]
			if(value !== undefined) {
				wizardStats[id] = value;
			}
			return null;
		})
		if (Utils.isEmpty(wizardStats)) return null;
		else return (
			<tr key={wizard.id}>
				<Cell color={wizard.color}>{wizard.name}</Cell>
				<Cell>{wizardStats.kills}</Cell>
				<Cell>{wizardStats.deaths}</Cell>
				<Cell>{wizardStats.assists}</Cell>
				<Cell>{Utils.ratio(wizardStats.kills, wizardStats.deaths)}</Cell>
				<Cell>
					<ProgressBar>
						<Progress 
							proportion={Utils.ratio(wizardStats.explode, 7)}
							color={wizard.color}>
							{Utils.romanize(wizardStats.explode)}
						</Progress>
					</ProgressBar>
				</Cell>
				<Cell>
					<ProgressBar>
						<Progress 
							proportion={Utils.ratio(wizardStats.regen, 7)}
							color={wizard.color}>
							{Utils.romanize(wizardStats.regen)}
						</Progress>
					</ProgressBar>
				</Cell>
			</tr>
			);
	}

	const formatModePrefix = (prefixes, wins) => {
		const score = Utils.default0(wins);
		const { prefix } = findPrefix(prefixes, score);
		if (prefix.color === 'rainbow') {
			return rainbow(`${score}`);
		}
		const colorCode = colorToCode(prefix.color);
		return `${colorCode}${score}`;
	};

	const tntRunPrefix = formatModePrefix(consts.RUN_PREFIXES, json.wins_tntrun);
	const pvpRunPrefix = formatModePrefix(consts.RUN_PREFIXES, json.wins_pvprun);
	const bowSpleefPrefix = formatModePrefix(consts.RUN_PREFIXES, json.wins_bowspleef);
	const tntTagPrefix = formatModePrefix(consts.TAG_PREFIXES, json.wins_tntag);
	const wizardsPrefix = formatModePrefix(consts.TAG_PREFIXES, json.wins_capture);

	const header = (
		<React.Fragment>
			<Box title="Total Wins">{json.wins}</Box>
		</React.Fragment>
		);

	const wizardsTable = (
		<Table>
			<thead>
				<tr>
					<th>Wizard</th>
					<th>Kills</th>
					<th>Deaths</th>
					<th>Assists</th>
					<th>KD</th>
					<th>Power</th>
					<th>Regen</th>
				</tr>
			</thead>
			<tbody>
				{consts.WIZARDS.map(renderWizardRow)}
			</tbody>
		</Table>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<Pair title="Tokens" color="darkgreen">{json.coins}</Pair>
			<Pair title="Total Wins">{json.wins}</Pair>
			<div className="h-flex mt-3">
				<div className="flex-1">
					<p className="font-bold font-md mb-1">TNT Run <MinecraftText font={false} size="sm">{tntRunPrefix}</MinecraftText></p>
					<Pair title="Wins">{json.wins_tntrun}</Pair>
					<Pair title="Record Time">{Utils.secondsToHms(json.record_tntrun)}</Pair>
					<Br />
					<p className="font-bold font-md mb-1">PVP Run <MinecraftText font={false} size="sm">{pvpRunPrefix}</MinecraftText></p>
					<Pair title="Wins">{json.wins_pvprun}</Pair>
					<Pair title="Kills">{json.kills_pvprun}</Pair>
					<Pair title="Record Time">{Utils.secondsToHms(json.record_pvprun)}</Pair>
				</div>
				<div className="flex-1">
					<p className="font-bold font-md mb-1">TNT Tag <MinecraftText font={false} size="sm">{tntTagPrefix}</MinecraftText></p>
					<Pair title="Wins">{json.wins_tntag}</Pair>
					<Pair title="Kills">{json.kills_tntag}</Pair>
					<Br />
					<p className="font-bold font-md mb-1">Bow Spleef <MinecraftText font={false} size="sm">{bowSpleefPrefix}</MinecraftText></p>
					<Pair title="Wins">{json.wins_bowspleef}</Pair>
					<Pair title="Losses">{json.deaths_bowspleef}</Pair>
					<Pair title="Win/Loss Ratio">{Utils.ratio(json.wins_bowspleef, json.deaths_bowspleef)}</Pair>
				</div>
			</div>

			<HorizontalLine className="my-3" />

			<Title>Wizards <MinecraftText font={false} size="sm">{wizardsPrefix}</MinecraftText></Title>
			<Pair title="Wins">{json.wins_capture}</Pair>
			<Pair title="Kills">{json.kills_capture}</Pair>
			<Pair title="Deaths">{json.deaths_capture}</Pair>
			<Pair title="Kill/Death Ratio">{Utils.ratio(json.kills_capture, json.deaths_capture)}</Pair>
			<div className="overflow-x mt-3">
				{wizardsTable}
			</div>
		</Accordion>
});