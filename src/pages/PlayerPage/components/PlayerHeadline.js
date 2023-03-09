import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, GuildTag, MinecraftText, PlayerHead, PlayerName, Status } from 'components';
import { APP } from 'constants/app';
import { useAPIContext } from 'hooks';

/*
* Displays face, username, and status of the player in the Hypixel Context
*/
export function PlayerHeadline(props) {
	const { mojang, player, guild, status } = useAPIContext();

	return (
		<div className="h-flex px-2 align-items-center">
			<ExternalLink href={`${APP.nameMC}${mojang.uuid}`}>
				<PlayerHead uuid={mojang.uuid} shadow />
			</ExternalLink>
			<h1 className="text-shadow pl-2">
				<PlayerName username={mojang.username} player={player} size="xl" />
				<MinecraftText size="xl"> </MinecraftText>
				<Link to={`/guild/${mojang.username}`}>
					<GuildTag guild={guild} size="xl" />
				</Link>
			</h1>
			<Status player={player} status={status} size="xl" />
		</div>
		);
}