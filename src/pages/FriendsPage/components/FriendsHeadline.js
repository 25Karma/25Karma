import React from 'react';
import { Link } from 'react-router-dom';
import { GuildTag, MinecraftText, PlayerName } from 'components';
import { useAPIContext } from 'hooks';

/*
* Displays face, username, and status of the player in the Hypixel Context
*/
export function FriendsHeadline(props) {
	const { mojang, player, guild } = useAPIContext();

	return (
		<div className="h-flex px-2 align-items-center">
			<div className="text-shadow pl-2">
				<MinecraftText size="xl">Friends of </MinecraftText>
				<Link to={`/player/${mojang.username}`}>
					<PlayerName username={mojang.username} player={player} size="xl" />
				</Link>
				<Link to={`/guild/${mojang.username}`}>
					<GuildTag guild={guild} size="xl" />
				</Link>
			</div>
		</div>
		);
}