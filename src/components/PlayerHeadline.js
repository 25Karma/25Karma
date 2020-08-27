import React from 'react';
import { Crafatar, ExternalLink, GuildTag, PlayerName, Status } from 'components';
import { useHypixelContext } from 'hooks';

/*
* Displays face, username, and status of the player in the Hypixel Context
*/
export function PlayerHeadline(props) {
	const { mojang, player, guild, status } = useHypixelContext();
	

	return (
		<div className="h-flex px-2 align-items-center">
			{mojang.uuid &&
				<ExternalLink href={`https://namemc.com/profile/${mojang.uuid}`}>
					<Crafatar uuid={mojang.uuid} shadow />
				</ExternalLink>
			}
			<div className="text-shadow pl-2">
				<PlayerName username={mojang.username} player={player} size="lg" />
				<GuildTag guild={guild} size="lg" />
			</div>
			<Status player={player} status={status} size="lg" />
		</div>
		);
}