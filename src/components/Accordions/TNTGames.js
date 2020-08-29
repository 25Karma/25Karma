import React, { memo } from 'react';
import { Accordion, Box, HorizontalLine, ProgressBar, 
	Progress, StatCell, StatPair, StatTitle, StatTable } from 'components';
import { TNTGAMES as consts } from 'constants/hypixel';
import { useHypixelContext } from 'hooks';
import * as Utils from 'utils';

/*
* Stats accordion for TNT Games
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export const TNTGames = memo((props) => {

	const { player } = useHypixelContext();
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
				<StatCell color={wizard.color}>{wizard.name}</StatCell>
				<StatCell>{wizardStats.kills}</StatCell>
				<StatCell>{wizardStats.deaths}</StatCell>
				<StatCell>{wizardStats.assists}</StatCell>
				<StatCell>{Utils.ratio(wizardStats.kills, wizardStats.deaths)}</StatCell>
				<StatCell>
					<ProgressBar>
						<Progress 
							proportion={Utils.ratio(wizardStats.explode, 7)}
							color={wizard.color}>
							{Utils.romanize(wizardStats.explode || 0)}
						</Progress>
					</ProgressBar>
				</StatCell>
				<StatCell>
					<ProgressBar>
						<Progress 
							proportion={Utils.ratio(wizardStats.regen, 7)}
							color={wizard.color}>
							{Utils.romanize(wizardStats.regen || 0)}
						</Progress>
					</ProgressBar>
				</StatCell>
			</tr>
			);
	}

	const header = (
		<React.Fragment>
			<Box title="Wins">{json.wins}</Box>
		</React.Fragment>
		);

	const wizardsTable = (
		<StatTable>
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
		</StatTable>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="mt-3">
				<StatPair title="Coins" color="gold">{json.coins}</StatPair>
				<StatPair title="Total Wins">{json.wins}</StatPair>
			</div>
			<div className="h-flex my-3">
				<div className="flex-1">
					<div className="font-bold underline mb-1">TNT Run</div>
					<StatPair title="Wins">{json.wins_tntrun}</StatPair>
					<StatPair title="Record Time">{Utils.secondsToHms(json.record_tntrun)}</StatPair>
					<br />
					<div className="font-bold underline mb-1">PVP Run</div>
					<StatPair title="Wins">{json.wins_pvprun}</StatPair>
					<StatPair title="Kills">{json.kills_pvprun}</StatPair>
					<StatPair title="Record Time">{Utils.secondsToHms(json.record_pvprun)}</StatPair>
				</div>
				<div className="flex-1">
					<div className="font-bold underline mb-1">TNT Tag</div>
					<StatPair title="Wins">{json.wins_tntag}</StatPair>
					<StatPair title="Kills">{json.kills_tntag}</StatPair>
					<br />
					<div className="font-bold underline mb-1">Bow Spleef</div>
					<StatPair title="Wins">{json.wins_bowspleef}</StatPair>
					<StatPair title="Losses">{json.deaths_bowspleef}</StatPair>
					<StatPair title="Win/Loss Ratio">{Utils.ratio(json.wins_bowspleef, json.deaths_bowspleef)}</StatPair>
				</div>
			</div>

			<HorizontalLine />

			<div className="my-3">
				<StatTitle>Wizards</StatTitle>
				<StatPair title="Wins">{json.wins_capture}</StatPair>
				<StatPair title="Kills">{json.kills_capture}</StatPair>
				<StatPair title="Deaths">{json.deaths_capture}</StatPair>
				<StatPair title="Kill/Death Ratio">{Utils.ratio(json.kills_capture, json.deaths_capture)}</StatPair>
				<div className="overflow-x mt-3">
					{wizardsTable}
				</div>
			</div>
		</Accordion>
});