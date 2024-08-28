import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, HorizontalLine } from 'src/components';
import { Box, Br, Pair } from 'src/components/Stats';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { calculateNetworkLevel, questCompletionsSince } from 'src/utils/hypixel';

/**
 * Displays general questing stats about the player in the Hypixel Context
 */
export function QuestsCard() {
	const { player, mojang, resources } = useAPIContext();
	const gameQuests = Utils.traverse(resources, 'quests', {});
	const networkLevel = calculateNetworkLevel(player.networkExp);

	const overall = {
		completions: {
			daily: 0,
			weekly: 0,
			monthly: 0,
			yearly: 0,
			total: 0,
		},
		active: 0,
		dailyRewards: {
			MultipliedExperienceReward: 0,
			MultipliedCoinReward: 0,
			GameLootChestReward: 0,
		},
	};

	// For each quest in the Hypixel API 'resources' endpoint
	// Note: this will exclude seasonal quests during the off-season
	Object.values(gameQuests).forEach(questArray => questArray.forEach(({id, name, rewards}) => {
		const completions = Utils.traverse(player, `quests.${id}.completions`, []);

		// If the quest was completed today, add up the rewards earned today
		if (questCompletionsSince('daily', completions)) {
			rewards.forEach(({type, amount}) => {
				if (overall.dailyRewards[type] !== undefined) {
					overall.dailyRewards[type] += amount;
				}
			})
		}
	}))

	// For each quest in the player's data
	// This includes all quests relevant to the player, including seasonal ones	
	Object.values(Utils.traverse(player, 'quests', {})).forEach(({completions, active}) => {
		// Add up how many times the quest has been completed since the start of the day, week, month, and year
		for (const period of Object.keys(overall.completions)) {
			overall.completions[period] += questCompletionsSince(period, completions);
		}
		if (active !== undefined) {
			overall.active += 1;
		}
	});

	return (
		<Card className="px-2 pt-1 pb-3 my-1">
			<div className="h-flex w-100 justify-content-center">
				<Box title="Hypixel Level" color="white">
					{Utils.formatNum(networkLevel)}
				</Box>
				<Box title="Karma" color="pink">
					{player.karma}
				</Box>
			</div>

			<HorizontalLine className="mb-3"/>

			<Pair title="Total Completions">{overall.completions.total}</Pair>
			<Pair title="Active Quests">{overall.active}</Pair>
			<Br />
			<Pair title="Daily Completions">{overall.completions.daily}</Pair>
			<Pair title="Weekly Completions">{overall.completions.weekly}</Pair>
			<Pair title="Monthly Completions">{overall.completions.monthly}</Pair>
			<Pair title="Yearly Completions">{overall.completions.yearly}</Pair>
			<Br />
			<Pair title="EXP Earned Today" color="aqua">{overall.dailyRewards.MultipliedExperienceReward}</Pair>
			<Pair title="Coins Earned Today" color="gold">{overall.dailyRewards.MultipliedCoinReward}</Pair>
			<Pair title="Loot Chests Earned Today" color="yellow">{overall.dailyRewards.GameLootChestReward}</Pair>
			<Br />	
			<Link to={`/player/${mojang.username}`}>
				<Button>
					<span className="font-bold">View Player Stats</span>
				</Button>
			</Link>
		</Card>
	);
}