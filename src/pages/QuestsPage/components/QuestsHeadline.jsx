import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, MinecraftText, PlayerHead, PlayerName } from 'src/components';
import { APP } from 'src/constants/app';
import { useAPIContext } from 'src/hooks';

/**
 * Displays face and username of the player in the Hypixel Context
 */
export function QuestsHeadline() {
	const { mojang, player } = useAPIContext();

	return (
		<div className="h-flex px-2 align-items-center">
			<ExternalLink href={`${APP.namemcUrl}${mojang.uuid}`}>
				<PlayerHead uuid={mojang.uuid} shadow />
			</ExternalLink>
			<h1 className="text-shadow pl-2">
				<Link to={`/player/${mojang.username}`}>
					<PlayerName username={mojang.username} player={player} size="xl" />
				</Link>
				<MinecraftText size="xl">§7's Quests</MinecraftText>
			</h1>
		</div>
		);
}