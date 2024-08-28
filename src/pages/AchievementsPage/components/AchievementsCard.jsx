import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, HorizontalLine } from 'src/components';
import { Br, Box, Pair, Span, Title } from 'src/components/Stats';
import { HYPIXEL } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { calculateNetworkLevel, gamemodeAchievements } from 'src/utils/hypixel';

/**
 * Displays overall achievement stats about the player
 */
export function AchievementsCard() {
	
	const { player, mojang, resources: { achievements: allAchmts } } = useAPIContext();
	const json = player || {};
	const networkLevel = calculateNetworkLevel(json.networkExp);
	const oneTimeAchmts = json.achievementsOneTime || [];

	const allGamemodeAchievements = Object.keys(allAchmts).map(gameId => gamemodeAchievements(gameId, allAchmts, json));
	const overall = {};
	allGamemodeAchievements.forEach(data => Object.entries(data).forEach(([k,v]) => {
		if (isNaN(overall[k])) {
			overall[k] = v;
		}
		else {
			overall[k] += v;
		}
	}));

	const recentChallenges = (
		<React.Fragment>
			<HorizontalLine className="mt-3"/>
			
			<Title>Recent Challenges</Title>
			<table>
				<thead>
					<tr className="text-left">
						<th>Game</th>
						<th>Challenge</th>
					</tr>
				</thead>
				<tbody>
				{oneTimeAchmts.slice(-15).map(a => {
					const [gameId, ...aId] = a.split('_');
					const achmtData = allAchmts[gameId].one_time[aId.join('_').toUpperCase()];
					if (achmtData) {
						return (
							<tr key={a} className="c-gray">
								<td>{HYPIXEL.ACHIEVEMENTS[gameId]}</td>
								<td>{achmtData.name}</td>
							</tr>
						);
					}
					return null;
				}).reverse()}
				</tbody>
			</table>
		</React.Fragment>
	)

	return (
		<Card className="px-2 pt-1 pb-3 my-1">
			<div className="h-flex w-100 justify-content-center">
				<Box title="Hypixel Level" color="white">
					{Utils.formatNum(networkLevel)}
				</Box>
				<Box title="Karma" color="pink">
					{json.karma}
				</Box>
			</div>

			<HorizontalLine className="mb-3"/>
			<Pair title="Achievements" color="aqua">
				{overall.unlocked}
				<Span color="gray">{`/${overall.total}`}</Span>
			</Pair>
			<Pair title="Achievement Points" color="yellow">
				{overall.points}
				<Span color="gray">{`/${overall.total_points}`}</Span>
			</Pair>
			<Br />
			<Pair title="Legacy Achievements" color="aqua">
				{overall.legacy_unlocked}
				<Span color="gray">{`/${overall.legacy_total}`}</Span>
			</Pair>
			<Pair title="Legacy Points" color="yellow">
				{overall.legacy_points}
				<Span color="gray">{`/${overall.total_legacy_points}`}</Span>
			</Pair>

			{Boolean(oneTimeAchmts.length) && recentChallenges}

			<HorizontalLine className="my-3"/>

			<Link to={`/player/${mojang.username}`}>
				<Button>
					<span className="font-bold">View Player Stats</span>
				</Button>
			</Link>
		</Card>
		);
}