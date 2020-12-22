import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';
import { Card, Crafatar, ExternalLink, GuildTag, 
	HorizontalLine, List, LoadingSpinner, MinecraftText,
	Navbar, PageLayout, PlayerName } from 'components';
import { Br, Pair, Progress, ProgressBar, Title } from 'components/Stats';
import { APP } from 'constants/app';
import { GUILD, HYPIXEL } from 'constants/hypixel';
import { FrontPage } from 'pages';
import { useAPIContext } from 'hooks';
import * as Utils from 'utils';
import { getGuildMemberRank, HypixelLeveling } from 'utils/hypixel';

/*
* Page that displays the stats of a guild
*/
export function GuildPage(props) {
	const { slug } = useParams();
	const context = useAPIContext(slug, 'guild');
	const { guild } = context;
	
	switch(context.success) {
		case true:
			document.title = `${guild.name} | ${APP.documentTitle}`;
			return (
			<PageLayout
				header={<Navbar searchbar />}
				top={
					<MinecraftText size="xl" className="px-2 text-shadow">
						{`${Utils.toColorCode(guild.tagColor || 'gray')}${guild.name}`}
					</MinecraftText>
				} 
				left={<GuildCard />}
				center={<GuildMemberList />} />
			);
		case false:
			document.title = APP.documentTitle;
			return <FrontPage config={context} />
		default:
			document.title = APP.documentTitle;
			return (
			<PageLayout
				header={<Navbar searchbar />}
				center={
					<div className="py-5">
						<LoadingSpinner text={`Loading stats for ${slug}'s guild`} />
					</div>
				} />
			);
	}
}

/*
* The card on the left side of the page that contains info about the guild
*/
function GuildCard(props) {
	const { guild } = useAPIContext();
	const hasTag = Boolean(guild.tag);
	const hasDesc = Boolean(guild.description);
	const preferredGames = guild.preferredGames || [];
	const achievements = guild.achievements || {};
	const gameXp = guild.guildExpByGameType || {};

	const leveling = new HypixelLeveling(xpToLevel, levelToXP, guild.exp);

	function xpToLevel(xp) {
		let xpRemaining = xp;
		let level = 0;
		let xpToLevelUp = GUILD.EXP[level];
		while (xpRemaining >= xpToLevelUp) {
			xpRemaining -= xpToLevelUp;
			level++;
			xpToLevelUp = GUILD.EXP[level > 14 ? 14 : level];
		}
		return level + xpRemaining/xpToLevelUp;
	}

	function levelToXP(lvl) {
		let xp = 0;
		for (let i = 0; i < lvl; i++) {
			xp += GUILD.EXP[i > 14 ? 14 : i];
		}
		return xp;
	}

	return (
		<Card className="p-2 pb-3">
			{hasTag && 
				<div className="w-100 text-center text-shadow mb-1">
					<GuildTag guild={guild} size="xl" />
				</div> 
			}
			{hasDesc && 
				<div className="w-100 mb-3">
					{reactStringReplace(
						guild.description, 
						// https://stackoverflow.com/a/48769624
						/(?:(?:https?|ftp):\/\/)?([\w/\-?=%.]+\.[\w/\-?=%.]+)/g,
						(match, i) => <ExternalLink href={match} key={i}>{match}</ExternalLink>
					)}
				</div> 
			}
			{(hasTag || hasDesc) && <HorizontalLine className="mb-3" />}
			<div className="mb-1 font-bold">Leveling Progress</div>
			<div className="w-100 h-flex">
				<span className="pr-1">
					{leveling.levelFloor}
				</span>
				<div className="flex-1">
					<ProgressBar 
						dataTip={`${leveling.xpAboveLevel}/${leveling.levelTotalXP} GEXP`}>
						<Progress 
							proportion={leveling.proportionAboveLevel}
							color={guild.tagColor || 'white'}
							dataTip={`${leveling.xpAboveLevel}/${leveling.levelTotalXP} GEXP`} />
					</ProgressBar>
				</div>
				<span className="pl-1">
					{leveling.levelCeiling}
				</span>
			</div>
			<Br />
			<Pair title="Level">{leveling.level}</Pair>
			<Pair title="Created">{Utils.dateFormat(guild.created)}</Pair>
			<Pair title="Legacy Rank">{guild.legacyRanking !== undefined ? guild.legacyRanking+1 : '-'}</Pair>
			<Br />
			<Pair title="Members">{guild.members.length}</Pair>
			<Pair title="Publicly Listed">{guild.publiclyListed ? 'Yes' : 'No'}</Pair>
			<Pair title="Publicly Joinable">{guild.joinable ? 'Yes' : 'No'}</Pair>
			<Br />
			<Pair title="Preferred Games">
				{
					preferredGames.length > 0 ?
						preferredGames
						.map(g => HYPIXEL.GAMES[g])
						.filter(n => n)
						.sort()
						.join(', ')
						:
						'-'
				}
			</Pair>

			<HorizontalLine className="mt-3" />

			<Title>Achievements</Title>
			<Pair title="Experience Kings">{achievements.EXPERIENCE_KINGS}</Pair>
			<Pair title="Winners">{achievements.WINNERS}</Pair>
			<Pair title="Online Players">{achievements.ONLINE_PLAYERS}</Pair>

			{!Utils.isEmpty(gameXp) &&
				<React.Fragment>
					<HorizontalLine className="mt-3" />

					<Title>Experience</Title>
					{
						Object.entries(gameXp)
							.map(([k,v]) => [HYPIXEL.GAMES[k],v])
							.sort(([ka],[kb]) => ka > kb ? 1 : -1)
							.map(([k,v]) =>
								Boolean(k) && v !== 0 &&
								<Pair title={k} key={k}>{v}</Pair>
								)
					}
				</React.Fragment>
			}
		</Card>
		);
}

/*
* The list of players displayed at the center of the page
*/
function GuildMemberList(props) {
	const { guild, members } = useAPIContext();
	const guildMembers = Utils.traverse(guild, 'members', {});
	const [sortType, setSortType] = useState('rank');

	const totalMembers = guild.members.length;
	const membersWithData = Object.keys(members).length;

	function sortMembers() {
		const filteredMembers = guildMembers.filter(m => members[m.uuid]);
		switch (sortType) {
			case 'alphabetical': 
				return filteredMembers.sort((a,b) => 
					members[a.uuid].username.toLowerCase() > members[b.uuid].username.toLowerCase() ? 1 : -1);
			case 'joined': 
				return filteredMembers.sort((a,b) => a.joined > b.joined ? 1 : -1);
			case 'rank': 
				return filteredMembers.sort((a,b) => 
					getGuildMemberRank(a, guild.ranks).priority < getGuildMemberRank(b, guild.ranks).priority ? 1 : -1);
			default: 
				return filteredMembers;
		}
	}

	return (
		<React.Fragment>
			<List>
				<thead>
					<tr>
						<th></th>
						<th className="cursor-pointer" onClick={()=>setSortType('alphabetical')}>Name</th>
						<th className="cursor-pointer" onClick={()=>setSortType('rank')}>Rank</th>
						<th className="cursor-pointer" onClick={()=>setSortType('joined')}>Joined Since</th>
					</tr>
				</thead>
				<tbody>	
				{sortMembers().map((member, index) => {
					const data = Utils.traverse(members, member.uuid, {});
					return !Utils.isEmpty(data) &&
					<tr key={index}>
						<td className="td-shrink">
							<ExternalLink href={`https://namemc.com/profile/${data.uuid}`}>
								<Crafatar uuid={data.uuid} size="lg" shadow />
							</ExternalLink>
						</td>
						<td className="text-shadow">
							<Link to={`/player/${data.username}`}>
								<PlayerName username={data.username} player={data} size="lg"></PlayerName>
							</Link>
						</td>
						<td>{getGuildMemberRank(member, guild.ranks).name}</td>
						<td>{Utils.dateFormat(member.joined)}</td>
					</tr>
				})}
				</tbody>
			</List>
			{membersWithData < totalMembers &&
				<div className="text-center">
					{
						`Displaying ${membersWithData} 
						out of ${totalMembers} players. 
						Refresh the page in a few minutes to load more.`
					}
				</div>
			}
		</React.Fragment>
		);
}