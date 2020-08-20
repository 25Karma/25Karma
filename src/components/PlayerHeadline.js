import React from 'react';
import { Crafatar, ExternalLink, PlayerName, Status } from 'components';
import { useHypixelContext } from 'hooks';

/*
* Displays face, username, and status of the player in the Hypixel Context
*/
export function PlayerHeadline(props) {
	const { mojang, player, status } = useHypixelContext();
	

	return (
		<div className="h-flex px-2">
		{mojang.uuid &&
			<ExternalLink href={`https://namemc.com/profile/${mojang.uuid}`}>
				<Crafatar uuid={mojang.uuid} shadow />
			</ExternalLink>
		}
			<div className="text-shadow">
				<PlayerName player={player} font="lg" />
			</div>
			<Status player={player} status={status} size="lg" />
		</div>
		);
}