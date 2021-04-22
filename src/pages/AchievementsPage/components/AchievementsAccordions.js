import React, { memo } from 'react';
import { useAPIContext } from 'hooks';
import { HYPIXEL } from 'constants/hypixel';
import { Accordion, HorizontalLine } from 'components';
import { Box, Cell, Progress, ProgressBar, Span, Table } from 'components/Stats';
import * as Utils from 'utils';
import { gamemodeAchievements } from 'utils/hypixel';
import ReactTooltip from 'react-tooltip';

/*
* An Accordion that displays the achievements of a player for a specific game mode
* Returns a memoized component function (different from JSX) to be consumed by AccordionList
*/
function generateAchievementsAccordions(gameMode) {
	return memo(({ index }) => {
		const title = HYPIXEL.ACHIEVEMENTS[gameMode];
		const { player, resources: { achievements: allAchmts } } = useAPIContext();
		const overallAchmts = gamemodeAchievements(gameMode, allAchmts, player);
		const ratios = {
			unlocked: Utils.ratio(overallAchmts.unlocked, overallAchmts.total),
			legacy_unlocked: Utils.ratio(overallAchmts.legacy_unlocked, overallAchmts.legacy_total),
			points: Utils.ratio(overallAchmts.points, overallAchmts.total_points),
			legacy_points: Utils.ratio(overallAchmts.legacy_points, overallAchmts.total_legacy_points),
		};
		const gameAchmts = allAchmts[gameMode];
		const oneTimeAchmts = player.achievementsOneTime || [];
		const tieredAchmts = player.achievements || {};

		const header = (
			<React.Fragment>
				<div className="flex-1">
					<Box title="Unlocked">
						{`§b${overallAchmts.unlocked}§7/§b${overallAchmts.total}§7 (${Utils.formatNum(100*ratios.unlocked)}%)`}
					</Box>
				</div>
				<div className="flex-1 pr-4">
					<Box title="Points">
						{`§e${overallAchmts.points}§7/§e${overallAchmts.total_points}§7 (${Utils.formatNum(100*ratios.points)}%)`}
					</Box>
				</div>
			</React.Fragment>
		);

		function renderProgressBars(isLegacy) {
			const adj = isLegacy ? 'Legacy ' : '';
			const prefix = isLegacy ? 'legacy_' : '';
			return (
				<table>
					<tbody>
						<tr><td colSpan="2" className="font-bold">{`${adj}Achievement Progress`}</td></tr>
						<tr>
							<td>
								<ProgressBar>
									<Progress 
									color="aqua" 
									proportion={ratios[`${prefix}unlocked`]}>
										{overallAchmts[`${prefix}unlocked`]}
									</Progress>
								</ProgressBar>
							</td>
							<td className="td-shrink c-aqua px-1">{overallAchmts[`${prefix}total`]}</td>						
						</tr>
						<tr><td colSpan="2" className="font-bold pt-2">{`${adj}Points`}</td></tr>
						<tr>
							<td>
								<ProgressBar>
									<Progress 
									color="yellow" 
									proportion={ratios[`${prefix}points`]}>
										{overallAchmts[`${prefix}points`]}
									</Progress>
								</ProgressBar>
							</td>
							<td className="td-shrink c-yellow px-1">{overallAchmts[`total_${prefix}points`]}</td>						
						</tr>
					</tbody>
				</table>
			);
		}

		const challengeTable = (
			<Table display="comfortable">
				<thead>
					<tr>
						<th>Challenge Achievements</th>
						<th>Description</th>
						<th>Points</th>
						<th>{`${title} Players Unlocked`}</th>
						<th>All Players Unlocked</th>
					</tr>
				</thead>
				<tbody>
				{Object.entries(allAchmts[gameMode].one_time).filter(n => !n[1].legacy).map(([name, data]) => (
					<tr key={name}>
						<Cell>{data.name}</Cell>
						<Cell>{data.description}</Cell>
						<Cell color={oneTimeAchmts.includes(`${gameMode}_${name.toLowerCase()}`) ? 'green' : 'red'}>
							{data.points}
						</Cell>
						<Cell percentage>{Utils.ratio(data.gamePercentUnlocked, 100)}</Cell>
						<Cell percentage>{Utils.ratio(data.globalPercentUnlocked, 100)}</Cell>
					</tr>
				))}
				</tbody>
			</Table>
		);

		const tieredTable = (
			<Table display="comfortable">
				<thead>
					<tr>
						<th>Tiered Achievements</th>
						<th>Description</th>
						<th>Points</th>
						<th>Amounts</th>
					</tr>
				</thead>
				<tbody>
				{Object.entries(gameAchmts.tiered).filter(n => !n[1].legacy).map(([name, data]) => {
					const playerAmount = Utils.default0(tieredAchmts[`${gameMode}_${name.toLowerCase()}`]);
					let nextAmount = data.tiers[data.tiers.length-1].amount;
					for (const tier of data.tiers) {
						if (playerAmount < tier.amount) {
							nextAmount = tier.amount;
							break;
						}
					}
					return (
						<tr key={name}>
							<Cell>{data.name}</Cell>
							<Cell>{data.description.replace(/%s/g, `${playerAmount}/${nextAmount}`)}</Cell>
							<Cell>
							{data.tiers.map(({ amount, points }, index) => 
								<Span key={amount} color={playerAmount >= amount ? 'green' : 'red'}>{index !== 0 && '/'}{points}</Span>
							)}
							</Cell>
							<Cell>
							{data.tiers.map(({ amount }, index) => 
								<Span key={amount} color={playerAmount >= amount ? 'green' : 'red'}>{index !== 0 && '/'}{amount}</Span>
							)}
							</Cell>
						</tr>
					);
				})}
				</tbody>
			</Table>
		);

		return (
			<Accordion title={title} header={header} index={index}>
				<div className="my-3">
					{renderProgressBars(false)}

					<HorizontalLine className="my-3" />

					<div className="overflow-x">
						{challengeTable}
					</div>
					
					<HorizontalLine className="my-3" />

					<div className="overflow-x">
						{tieredTable}
					</div>

					{Boolean(overallAchmts.total_legacy_points) && 
						<React.Fragment>
							<HorizontalLine className="my-3" />
							{renderProgressBars(true)}
						</React.Fragment>
					}
				</div>
				<ReactTooltip/>
			</Accordion>
		);
	})
}

export const AchievementsAccordions = Object.fromEntries(
	Object.entries(HYPIXEL.ACHIEVEMENTS)
	.map((tuple) => ([tuple[0], generateAchievementsAccordions(tuple[0])]))
	.map(([k,v]) => ([HYPIXEL.ACHIEVEMENTS[k], v]))
);