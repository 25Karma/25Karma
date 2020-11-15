import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, ExternalLink, HorizontalLine, SocialMedia } from 'components';
import { Br, Box, Pair, Title } from 'components/Stats';
import { HYPIXEL as consts } from 'constants/hypixel';
import { useAPIContext } from 'hooks';
import * as Utils from 'utils';
import { getPlayerRank } from 'utils/hypixel';

/*
* Displays general Hypixel stats about the player in the Hypixel Context
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

	function calculateNetworkLevel(exp) {
		return ((Math.sqrt(exp + 15312.5) - 125/Math.sqrt(2))/(25*Math.sqrt(2)))
	}

	const loginDates = ( 
		<React.Fragment>
			{json.firstLogin &&
				<Pair title="First Login">
					{Utils.dateFormat(json.firstLogin)}
				</Pair>
			}
			{json.lastLogin &&
				<Pair title="Last Login">
					{Utils.dateFormat(json.lastLogin)}
				</Pair>
			}
			<Br/>
		</React.Fragment>
		);
	
	const guildInfo = (guild &&
		<React.Fragment>
			<HorizontalLine className="mt-3"/>
			<Title>Guild</Title>
			<Pair title="Name" color={guild.tagColor}>{guild.name}</Pair>
			<Pair title="Members">{guild.members.length}</Pair>
			<Br />
			<Link to={`/guild/${mojang.username}`}>
				<Button>
					<span className="font-bold">View Guild</span>
				</Button>
			</Link>
		</React.Fragment>
		);

	const socialMedia = (socialMediaLinks && !Utils.isEmpty(socialMediaLinks) &&
		<React.Fragment>
			<HorizontalLine className="mt-3"/>
			<Title>Social Media</Title>
			<SocialMedia links={socialMediaLinks} />
		</React.Fragment>
		);

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
			<Pair title="Coin Multiplier">{`${multiplier.value} (${multiplier.name})`}</Pair>
			<Pair title="Achievement Points">{json.achievementPoints}</Pair>
			<Pair title="Quests Completed">{json.questsCompleted}</Pair>
			<Br />
			<Pair title="Friends">{friends}</Pair>
			<Br />
			{loginDates}
			<ExternalLink href={`https://sky.shiiyu.moe/stats/${json.uuid}`}>
				<Button>
					<span className="font-bold">SkyBlock Stats</span>
				</Button>
			</ExternalLink>
			{guildInfo}
			{socialMedia}
		</Card>
		);
}