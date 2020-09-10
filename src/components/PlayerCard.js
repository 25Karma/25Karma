import React from 'react';
import './PlayerCard.css';
import dateFormat from 'dateformat';
import { Button, ExternalLink, HorizontalLine, SocialMedia } from 'components';
import { Box, Pair, Title } from 'components/Stats';
import { HYPIXEL as consts } from 'constants/hypixel';
import { useHypixelContext } from 'hooks';
import * as Utils from 'utils';
import { getPlayerRank } from 'utils/hypixel';

/*
* Displays general Hypixel stats about the player in the Hypixel Context
*/
export function PlayerCard(props) {
	
	const { friends, player, guild } = useHypixelContext();
	const json = player || {};
	const networkLevel = Utils.formatNum(calculateNetworkLevel(json.networkExp));
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
		return {name: `Level ${Math.floor(networkLevel)}`, value: `×${m}`};
	})();
	const socialMediaLinks = Utils.traverse(json, 'socialMedia.links');

	function calculateNetworkLevel(exp) {
		return ((Math.sqrt(exp + 15312.5) - 125/Math.sqrt(2))/(25*Math.sqrt(2)))
	}

	const loginDates = ( 
		<React.Fragment>
			{json.firstLogin &&
				<Pair title="First Login">
					{dateFormat(new Date(json.firstLogin), 'yyyy/mm/dd, h:MM TT Z')}
				</Pair>
			}
			{json.lastLogin &&
				<Pair title="Last Login">
					{dateFormat(new Date(json.lastLogin), 'yyyy/mm/dd, h:MM TT Z')}
				</Pair>
			}
			<br/>
		</React.Fragment>
		);
	
	const guildInfo = (guild &&
		<React.Fragment>
			<HorizontalLine className="mt-3"/>
			<Title>Guild</Title>
			<Pair title="Name" color={guild.tagColor}>{guild.name}</Pair>
			<Pair title="Members">{guild.members}</Pair>
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
		<div className="playercard px-2 pt-1 pb-3 my-1">
			<div className="h-flex w-100 justify-content-center">
				<Box title="Hypixel Level" color="white">
					{networkLevel}
				</Box>
				<Box title="Karma" color="pink">
					{json.karma}
				</Box>
			</div>
			<HorizontalLine className="mb-3"/>
			<Pair title="Coin Multiplier">{`${multiplier.value} (${multiplier.name})`}</Pair>
			<Pair title="Achievement Points">{json.achievementPoints}</Pair>
			<Pair title="Quests Completed">{json.questsCompleted}</Pair>
			<br />
			<Pair title="Friends">{friends}</Pair>
			<br />
			{loginDates}
			<ExternalLink href={`https://sky.lea.moe/stats/${json.uuid}`}>
				<Button>
					<span className="font-bold">SkyBlock Stats</span>
				</Button>
			</ExternalLink>
			{guildInfo}
			{socialMedia}
		</div>
		);
}