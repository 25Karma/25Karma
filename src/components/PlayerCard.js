import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, ExternalLink, HorizontalLine, SocialMedia } from 'components';
import { Br, Box, Pair, Title } from 'components/Stats';
import { APP } from 'constants/app';
import { HYPIXEL as consts } from 'constants/hypixel';
import { useAPIContext } from 'hooks';
import * as Utils from 'utils';
import { getPlayerRank, getGuildMemberRank, getGuildMemberDailyGEXP, getGuildMemberWeeklyGEXP } from 'utils/hypixel';

/*
* Displays general Hypixel stats about the player in the Hypixel Context
*
* @param {string} props.page   The page that the PlayerCard is displayed on (ex. "player") -
*                              this will change what info to display
*/
export function PlayerCard(props) {
	
	const { friends, player, guild, mojang } = useAPIContext();
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

	function calculateNetworkLevel(exp = 0) {
		return ((Math.sqrt(exp + 15312.5) - 125/Math.sqrt(2))/(25*Math.sqrt(2)))
	}

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

	function playerStatsButton() {
		if (props.page !== "player") {
			return (
				<React.Fragment>
					<Link to={`/player/${mojang.username}`}>
						<Button>
							<span className="font-bold">View Player Stats</span>
						</Button>
					</Link>
					<Br />
				</React.Fragment>
				);
		}
	}

	const overallStats = (
		<React.Fragment>
			<Pair title="Coin Multiplier">{`${multiplier.value} (${multiplier.name})`}</Pair>
			<Pair title="Achievement Points">{json.achievementPoints}</Pair>
			<Pair title="Quests Completed">{json.questsCompleted}</Pair>
			<Br />
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
			<Pair title="Rewards Claimed">{json.totalRewards}</Pair>
			<Pair title="Reward Streak">{json.rewardScore}</Pair>
			<Pair title="Top Reward Streak">{json.rewardHighScore}</Pair>
			<Br />
		</React.Fragment>
		);

	function friendsInfo() {
		// Only render friends button if we are not already on the friends page
		if (props.page !== "friends") {
			return (
				<React.Fragment>
					<Pair title="Friends">{friends}</Pair>
					<Br />
					<Link to={`/friends/${mojang.username}`}>
						<Button>
							<span className="font-bold">View Friends</span>
						</Button>
					</Link>
					<Br />
				</React.Fragment>
				);
		}
		else {
			return (
				<React.Fragment>
					<Pair title="Friends">{friends.length}</Pair>
					<Br />
				</React.Fragment>
				);
		}
	}
	
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
					<Title>Guild</Title>
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
					<Br />
					<Link to={`/guild/${mojang.username}`}>
						<Button>
							<span className="font-bold">View Guild</span>
						</Button>
					</Link>
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
			{playerStatsButton()}
			{overallStats}
			{friendsInfo()}
			{loginDates}
			<ExternalLink href={`${APP.skyblock}${json.uuid}`}>
				<Button>
					<span className="font-bold">SkyBlock Stats</span>
				</Button>
			</ExternalLink>
			{guildInfo()}
			{socialMedia()}
		</Card>
		);
}