import React from 'react';
import { Link } from 'react-router-dom';
import { Crafatar, ExternalLink, MinecraftText, PlayerName } from 'components';
import { APP } from 'constants/app';
import { useAPIContext } from 'hooks';

/*
* Displays face, username, and status of the player in the Hypixel Context
*/
export function FriendsHeadline(props) {
	const { mojang, player } = useAPIContext();

	return (
		<div className="h-flex px-2 align-items-center">
			<ExternalLink href={`${APP.nameMC}${mojang.uuid}`}>
				<Crafatar uuid={mojang.uuid} shadow />
			</ExternalLink>
			<div className="text-shadow pl-2">
				<Link to={`/player/${mojang.username}`}>
					<PlayerName username={mojang.username} player={player} size="xl" />
				</Link>
				<MinecraftText size="xl">§7's Friends</MinecraftText>
			</div>
		</div>
		);
}