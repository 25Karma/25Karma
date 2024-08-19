import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, ExternalLink, HorizontalLine, SocialMedia } from 'src/components';
import { Br, Box, Pair, Title } from 'src/components/Stats';
import { APP } from 'src/constants/app';
import { HYPIXEL as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { calculateNetworkLevel, getPlayerRank, getGuildMemberRank, getGuildMemberDailyGEXP, 
	getGuildMemberWeeklyGEXP } from 'src/utils/hypixel';

/*
* Displays general Hypixel stats about the player in the Hypixel Context
*/
export function PlayerCard(props) {
	
	const { player, guild, mojang } = useAPIContext();
	const json = player || {};
	const networkLevel = calculateNetworkLevel(json.networkExp);
	const multiplier = (() => {
		let m = null;
		for (const {level, value} of consts.MULTIPLIER.slice().reverse()) {
			if (networkLevel >= level) {
				m = value;
				break;
			}
		}
		const playerRank = getPlayerRank(json)
		if (json.eulaCoins || playerRank === 'YOUTUBER') {
			const { value, name } = consts.RANKMULTIPLIER[playerRank] || {};
			if (Math.max(m, value) === value) {
				return {name: name, value: `×${value}`};
			}
		}
		const name = m === 1 ? 'Default' : `Level ${Math.floor(networkLevel)}`;
		return {name: name, value: `×${m}`};
	})();
	const socialMediaLinks = Utils.traverse(json, 'socialMedia.links');
	const dailyTwoKExp = Utils.traverse(json, 'eugene.dailyTwoKExp', 0);
	const rewardClaimed = (new Date(dailyTwoKExp)).toDateString() === (new Date()).toDateString();
	const giftingJson = Utils.traverse(json, 'giftingMeta', {});
	
	const overallStats = (
		<React.Fragment>
			<Pair title="Coin Multiplier">{`${multiplier.value} (${multiplier.name})`}</Pair>
			<Pair title="Total Coins" color="gold">
				{Utils.add(...consts.TOTALCOINS.map(n => Utils.traverse(json, n)))}
			</Pair>
			<Pair title="Total Kills">
				{Utils.add(...consts.TOTALKILLS.map(n => Utils.traverse(json, n)))}
			</Pair>
			<Pair title="Total Wins">
				{Utils.add(...consts.TOTALWINS.map(n => Utils.traverse(json, n)))}
			</Pair>
			<Br />
			<Pair title={<Link to={`/achievements/${mojang.username}`} className="link">Achievement Points</Link>}>
				{json.achievementPoints}
			</Pair>
			<Br />
			<Pair title={<Link to={`/quests/${mojang.username}`} className="link">Quests Completed</Link>}>
				{json.questsCompleted}
			</Pair>
			<Br />
			<Pair title="Today's Reward" color={rewardClaimed ? 'green' : 'gray'}>{rewardClaimed ? 'Claimed!' : 'Unclaimed'}</Pair>
			<Pair title="Rewards Claimed">{json.totalRewards}</Pair>
			<Pair title="Reward Streak">{json.rewardScore}</Pair>
			<Pair title="Top Reward Streak">{json.rewardHighScore}</Pair>
			<Br />
		</React.Fragment>
	);

	const giftingStats = (
		<React.Fragment>
			{giftingJson.giftsGiven !== undefined &&
				<Pair title="Gifts Gifted">{giftingJson.giftsGiven}</Pair>
			}
			{giftingJson.ranksGiven !== undefined &&
				<Pair title="Ranks Gifted">{giftingJson.ranksGiven}</Pair>
			}
			{(giftingJson.giftsGiven !== undefined || giftingJson.ranksGiven !== undefined) &&
				<Br />
			}
		</React.Fragment>
	);
	
	const loginDates = ( 
		<React.Fragment>
			{json.firstLogin !== undefined &&
				<Pair title="First Login">
					{Utils.dateFormat(json.firstLogin)}
				</Pair>
			}
			{json.lastLogin !== undefined &&
				<Pair title="Last Login">
					{Utils.dateFormat(json.lastLogin)}
				</Pair>
			}
			<Br/>
		</React.Fragment>
	);
	
	const skyblockButton = (
		<ExternalLink href={`${APP.skyblockUrl}/${mojang.uuid}`}>
			<Button>
				<span className="font-bold">View SkyBlock Stats</span>
			</Button>
		</ExternalLink>
	);
	
	function guildInfo() {
		if (guild) {
			const member = guild.members.find(m => m.uuid === mojang.uuid.replace(/-/g, ''));
			const rank = getGuildMemberRank(member, guild.ranks);

			let dailyGEXP = 0;
			let weeklyGEXP = 0;
			if (member.expHistory) {
				dailyGEXP = getGuildMemberDailyGEXP(member);
				weeklyGEXP = getGuildMemberWeeklyGEXP(member);
			}
			return (
				<React.Fragment>
					<HorizontalLine className="mt-3"/>
					<Link to={`/guild/${mojang.username}`} className="link">
						<Title>Guild</Title>
					</Link>
					<Pair title="Name" color={guild.tagColor}>{guild.name}</Pair>
					<Pair title="Members">{guild.members.length}</Pair>
					<Br />
					<Pair title="Rank">
						<span>{rank.name}</span>
						{rank.tag && <span className={`c-${guild.tagColor}`}>{` [${rank.tag}]`}</span>}
					</Pair>
					<Pair title="Daily GEXP">{dailyGEXP}</Pair>
					<Pair title="Weekly GEXP">{weeklyGEXP}</Pair>
					<Pair title="Joined">{Utils.dateFormat(member.joined)}</Pair>
				</React.Fragment>
				);
		}
	}

	function socialMedia() {
		if (socialMediaLinks && !Utils.isEmpty(socialMediaLinks)) {
			return (
				<React.Fragment>
					<HorizontalLine className="mt-3"/>
					<Title>Social Media</Title>
					<SocialMedia links={socialMediaLinks} />
				</React.Fragment>
				);
		}
	}

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
			{overallStats}
			{giftingStats}
			{loginDates}
			{skyblockButton}
			{guildInfo()}
			{socialMedia()}
		</Card>
		);
}