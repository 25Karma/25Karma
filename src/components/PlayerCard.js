import React from 'react';
import './PlayerCard.css';
import dateFormat from 'dateformat';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Box, Button, ExternalLink, HorizontalLine, 
	ReactIcon, SocialMedia, StatPair, StatTitle } from 'components';
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
				<StatPair title="First Login">
					{dateFormat(new Date(json.firstLogin), 'yyyy/mm/dd, h:MM TT Z')}
				</StatPair>
			}
			{json.lastLogin &&
				<StatPair title="Last Login">
					{dateFormat(new Date(json.lastLogin), 'yyyy/mm/dd, h:MM TT Z')}
				</StatPair>
			}
			<br/>
		</React.Fragment>
		);
	
	const guildInfo = (guild &&
		<React.Fragment>
			<HorizontalLine className="mt-3"/>
			<StatTitle>Guild</StatTitle>
			<StatPair title="Name" color={guild.tagColor}>{guild.name}</StatPair>
			<StatPair title="Members">{guild.members}</StatPair>
		</React.Fragment>
		);

	const socialMedia = (socialMediaLinks && !Utils.isEmpty(socialMediaLinks) &&
		<React.Fragment>
			<HorizontalLine className="mt-3"/>
			<StatTitle>Social Media</StatTitle>
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
			<StatPair title="Coin Multiplier">{`${multiplier.value} (${multiplier.name})`}</StatPair>
			<StatPair title="Achievement Points">{json.achievementPoints}</StatPair>
			<StatPair title="Quests Completed">{json.questsCompleted}</StatPair>
			<br />
			<StatPair title="Friends">{friends}</StatPair>
			<br />
			{loginDates}
			<ExternalLink href={`https://sky.lea.moe/stats/${json.uuid}`}>
				<Button>
					<span className="font-bold pr-1">SkyBlock Stats</span>
					<ReactIcon icon={FaExternalLinkAlt} size="sm" />
				</Button>
			</ExternalLink>
			{guildInfo}
			{socialMedia}
		</div>
		);
}