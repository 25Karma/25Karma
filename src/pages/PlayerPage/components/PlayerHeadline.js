import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Crafatar, ExternalLink, GuildTag, MinecraftText, PlayerName, ReactIcon, Status } from 'components';
import { APP, PAGES } from 'constants/app';
import { useAPIContext } from 'hooks';
import { Br } from '../../../components/Stats';

/*
* Displays face, username, and status of the player in the Hypixel Context
*/
export function PlayerHeadline(props) {
	const { mojang, player, guild, status } = useAPIContext();

	return (
		<div className="v-flex">
			<div className="h-flex px-2 align-items-center mr-auto ml-auto">
				<ExternalLink href={`${APP.nameMC}${mojang.uuid}`}>
					<Crafatar uuid={mojang.uuid} shadow />
				</ExternalLink>
				<div className="text-shadow pl-2">
					<PlayerName username={mojang.username} player={player} size="xl" />
					<MinecraftText size="xl"> </MinecraftText>
					<Link to={`/guild/${mojang.username}`}>
						<GuildTag guild={guild} size="xl" />
					</Link>
				</div>
				<Status player={player} status={status} size="xl" />
			</div>
			<Br/>
			<div className="py-1 h-flex overflow-x">
				{PAGES.filter((type) => type.path !== 'player').map((type, index) =>
					<div key={type.path}
							 className={index ? (index+1 === PAGES.length - 1 ? "pl-1 mr-auto" : "px-1") : "ml-auto pr-1"}>
						<Link to={`/${type.path}/${mojang.username}`}>
							<Button>
								<div className="overflow-hidden p-1" style={{width: "7.5rem"}}>
									<ReactIcon icon={type.icon} size="lg" />
									<div className="pt-1">{type.name}</div>
								</div>
							</Button>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}