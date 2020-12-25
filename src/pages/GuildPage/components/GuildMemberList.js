import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Crafatar, ExternalLink, List, LoadingSpinner, PlayerName } from 'components';
import { APP } from 'constants/app';
import { useAPIContext } from 'hooks';
import * as Utils from 'utils';
import { getGuildMemberRank } from 'utils/hypixel';

/*
* The list of players displayed at the center of the page
*/
export function GuildMemberList(props) {
	const { guild } = useAPIContext();
	const guildMembers = Utils.traverse(guild, 'members', []);
	const totalMembers = guild.members.length;

	const [sortType, setSortType] = useState('rank');

	// List of names that will be progressively fetched from the API
	const [names, setNames] = useState({});
	const totalNames = Object.keys(names).length;

	useEffect(() => {
		// Used to clean up fetch
		const abortController = new AbortController();
		// Used to clean up timeout
		let fetchTimeoutID;

		async function fetchGuildMemberNameByIndex(index) {
			if (index < totalMembers) {
				const uuid = guildMembers[index].uuid;
				const response = await fetch(`${APP.API}name/${uuid}`, {
					signal: abortController.signal
				});
				const json = await response.json();
				if (json.success) {
					setNames(oldNames => ({ ...oldNames, [uuid]: json }));
					fetchTimeoutID = setTimeout(() => {
						fetchGuildMemberNameByIndex(index+1);
					}, 200);
				}
				else {
					fetchTimeoutID = setTimeout(() => {
						fetchGuildMemberNameByIndex(index);
					}, 20000);
				}
			}
		}

		fetchGuildMemberNameByIndex(0);

		// Cleanup
		return () => {
			abortController.abort();
			clearTimeout(fetchTimeoutID);
		}
	}, [guildMembers, totalMembers]);

	function sortMembers() {
		const filteredMembers = guildMembers.filter(m => names[m.uuid]);
		switch (sortType) {
			case 'alphabetical': 
				return filteredMembers.sort((a,b) => 
					names[a.uuid].username.toLowerCase() > names[b.uuid].username.toLowerCase() ? 1 : -1);
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
					const data = Utils.traverse(names, member.uuid, {});
					return !Utils.isEmpty(data) &&
					<tr key={index}>
						<td className="td-shrink">
							<ExternalLink href={`https://namemc.com/search?q=${data.uuid}`}>
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
			{totalNames < totalMembers &&
				<LoadingSpinner 
					className="pt-2"
					text={`Loaded ${totalNames} out of ${totalMembers} players.`} 
				/>
			}
		</React.Fragment>
		);
}