import React, { memo } from 'react';
import { useAPIContext } from 'src/hooks';
import { HYPIXEL } from 'src/constants/hypixel';
import { Accordion } from 'src/components';
import { Box, Progress, ProgressBar } from 'src/components/Stats';
import * as Utils from 'src/utils';
import { questCompletionsSince } from 'src/utils/hypixel';

/**
 * An Accordion that displays questing data about a player for a specific game mode
 * Returns a memoized component function (different from JSX) to be consumed by AccordionList
 */
function generateQuestsAccordion(gameMode) {
	return memo(({ index }) => {
		const { player, resources: { quests: allQuests } } = useAPIContext();
		const playerQuests = Utils.traverse(player, 'quests', {});

		// Daily and Weekly quests specific to the gameMode
		const gameQuests = allQuests[gameMode] || [];

		// Separate all of the gameMode's quests into daily and weekly 
		const dailyQuests = gameQuests.filter(q => q.name.includes('Daily'));
		const weeklyQuests = gameQuests.filter(q => q.name.includes('Weekly'));

		const totalCompletions = Utils.add(...gameQuests.map(q => 
			Utils.traverse(playerQuests, `${q.id}.completions`, []).length));

		const completedDailyQuests = dailyQuests
			.map(q => q.id)
			.filter(id => questCompletionsSince('daily', Utils.traverse(playerQuests, `${id}.completions`, [])));

		const completedWeeklyQuests = weeklyQuests
			.map(q => q.id)
			.filter(id => questCompletionsSince('weekly', Utils.traverse(playerQuests, `${id}.completions`, [])));
		
		// Returns a color depending on a player's progress on their quests
		// If a quest is active, it is guaranteed to be gold at the very least
		// Quests are only dark gray if they are inactive and incomplete
		function progressColor(current, total, isActive = false) {
			if      (current === 0)     return isActive ? 'gold' : 'darkgray';
			else if (current < total)   return 'gold';
			else if (current >= total)  return 'green';
		}

		// Renders the progress bar for a given objective in a given quest
		function renderProgressBar(id, objective) {
			let progress = null; let goal = null; let color = null;

			const isComplete = completedDailyQuests.includes(id) || completedWeeklyQuests.includes(id);
			const isActive = Boolean(Utils.traverse(playerQuests, `${id}.active`));

			if (isComplete) {
				if (objective.type === 'IntegerObjective') {
					progress = objective.integer;
					goal = objective.integer;
				}
				else if (objective.type === 'BooleanObjective') {
					progress = 1;
					goal = 1;
				}
			}
			else {
				if (objective.type === 'IntegerObjective') {
					progress = Utils.traverse(playerQuests, `${id}.active.objectives.${objective.id}`, 0);
					goal = objective.integer;
				}
				else if (objective.type === 'BooleanObjective') {
					progress = 0;
					goal = 1;
				}
			}
			
			color = progressColor(progress, goal, isActive);

			return (
				<React.Fragment>
					<td className={`td-shrink c-${color}`}>0</td>
					<td>
						<ProgressBar>
							<Progress proportion={Utils.ratio(progress, goal)} color={color}>
								{progress}
							</Progress>
						</ProgressBar>
					</td>
					<td className={`td-shrink c-${color}`}>{goal}</td>
				</React.Fragment>
			);
		}

		const header = (
			<React.Fragment>
				<div className="flex-1">
					<Box title="Total" color={totalCompletions ? 'white' : 'darkgray'}>
						{totalCompletions}
					</Box>
				</div>
				<div className="flex-1">
					<Box title="Daily" color={progressColor(completedDailyQuests.length, dailyQuests.length)}>
						{`${completedDailyQuests.length}/${dailyQuests.length}`}
					</Box>
				</div>
				<div className="flex-1 pr-4">
					<Box title="Weekly" color={progressColor(completedWeeklyQuests.length, weeklyQuests.length)}>
						{`${completedWeeklyQuests.length}/${weeklyQuests.length}`}
					</Box>
				</div>
			</React.Fragment>
		);

		return gameQuests.length === 0 ? 
			<Accordion title={HYPIXEL.QUESTS[gameMode]} index={index} />
			:
			<Accordion title={HYPIXEL.QUESTS[gameMode]} header={header} index={index}>
				<table className="w-100">
					<tbody>
					{gameQuests.map(({id, name, objectives, description}, index) =>
						<React.Fragment key={id}>
							<tr>
								<td className={`font-bold pb-1 ${index && 'pt-3'}`} colSpan="4">{name}</td>
							</tr>
							{description.split('\n').map((desc, index) =>
								<tr key={index}>
									<td className="td-shrink pr-2">{desc}</td>
									{objectives[index] && renderProgressBar(id, objectives[index])}
								</tr>
							)}
						</React.Fragment>
					)}
					</tbody>
				</table>
			</Accordion>
	});
}

export const QuestsAccordions = Object.fromEntries(
	Object.entries(HYPIXEL.QUESTS)
	.map((tuple) => ([tuple[0], generateQuestsAccordion(tuple[0])]))
	.map(([k,v]) => ([HYPIXEL.QUESTS[k], v]))
);