import React from 'react';
import './PlayerCard.css';
import dateFormat from 'dateformat';
import { Box, Button, ExternalLink, HorizontalLine, 
	ReactIcon, SocialMedia, StatPair } from 'components';
import { useHypixelContext } from 'hooks';
import * as Utils from 'utils';

/*
* Displays general Hypixel stats about the player in the Hypixel Context
*/
export function PlayerCard(props) {
	const consts = {
		MULTIPLIER: [
			{level: 0, value: 1},
			{level: 5, value: 1.5},
			{level: 10, value: 2},
			{level: 15, value: 2.5},
			{level: 20, value: 3},
			{level: 25, value: 3.5},
			{level: 30, value: 4},
			{level: 40, value: 4.5},
			{level: 50, value: 5},
			{level: 100, value: 5.5},
			{level: 125, value: 6},
			{level: 150, value: 6.5},
			{level: 200, value: 7},
			{level: 250, value: 8},
		],
	}
	const { friends, player, guild } = useHypixelContext();
	const json = player.player || {};
	const networkLevel = Utils.formatNum(calculateNetworkLevel(json.networkExp));
	const multiplier = (() => {
		let m = null;
		for (const {level, value} of consts.MULTIPLIER.slice().reverse()) {
			if (networkLevel >= level) {
				m = value;
				break;
			}
		}
		if (json.rank === 'YOUTUBER') {
			m = Math.max(m, 7);
			if (m === 7) return {name: 'YouTuber', value: '×7'};
		}
		return {name: `Level ${Math.floor(networkLevel)}`, value: `×${m}`};
	})();
	const questsCompleted = (() => {
		if (!json.quests) return 0;
		let sum = 0;
		for (const [,v] of Object.entries(json.quests)) {
			if (v.completions) {
				sum += v.completions.length;
			}
		}
		return sum;
	})();
	const socialMediaLinks = Utils.traverse(json, 'socialMedia.links');

	function calculateNetworkLevel(exp) {
		return ((Math.sqrt(exp + 15312.5) - 125/Math.sqrt(2))/(25*Math.sqrt(2)))
	}

	const loginDates = (json.firstLogin &&
		<React.Fragment>
			<StatPair title="First Login">
				{dateFormat(new Date(json.firstLogin), 'yyyy/mm/dd, h:MM TT Z')}
			</StatPair>
			<StatPair title="Last Login">
				{dateFormat(new Date(json.lastLogin), 'yyyy/mm/dd, h:MM TT Z')}
			</StatPair>
			<br/>
		</React.Fragment>
		);
	
	const guildInfo = (guild.guild &&
		<React.Fragment>
			<div className="my-3">
				<HorizontalLine />
			</div>
			<div className="font-bold font-md mb-2">Guild</div>
			<StatPair title="Name" color={guild.guild.tagColor}>{guild.guild.name}</StatPair>
			<StatPair title="Members">{guild.guild.members.length}</StatPair>
		</React.Fragment>
		);

	const socialMedia = (socialMediaLinks &&
		<React.Fragment>
			<div className="my-3">
				<HorizontalLine />
			</div>
			<div className="font-bold font-md mb-2">Social Media</div>
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
			<div className="mb-3">
				<HorizontalLine />
			</div>
			<StatPair title="Coin Multiplier">{`${multiplier.value} (${multiplier.name})`}</StatPair>
			<StatPair title="Achievement Points">{json.achievementPoints}</StatPair>
			<StatPair title="Quests Completed">{questsCompleted}</StatPair>
			<br />
			<StatPair title="Friends">{friends.records.length}</StatPair>
			<br />
			{loginDates}
			<ExternalLink href={`https://sky.lea.moe/stats/${json.uuid}`}>
				<Button>
					<span className="font-bold">SkyBlock Stats&nbsp;&nbsp;</span>
					<ReactIcon icon="FaExternalLinkAlt" size="sm"/>
				</Button>
			</ExternalLink>
			{guildInfo}
			{socialMedia}
		</div>
		);
}