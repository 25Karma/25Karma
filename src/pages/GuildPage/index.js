import React from 'react';
import { useParams } from 'react-router-dom';
import { LoadingSpinner, MinecraftText, Navbar, PageLayout } from 'components';
import { GuildCard, GuildMemberList } from './components';
import { APP } from 'constants/app';
import { FrontPage } from 'pages';
import { useAPIContext } from 'hooks';
import * as Utils from 'utils';

/*
* Page that displays the stats of a guild
*/
export function GuildPage(props) {
	const { slug } = useParams();
	const context = useAPIContext(slug, 'guild');
	const { guild } = context;
	
	switch(context.success) {
		case true:
			Utils.pushToRecentSearches(context.mojang.username);
			document.title = `${context.mojang.username}'s Guild - ${APP.documentTitle}`;
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
			return <FrontPage config={context} />
		default:
			document.title = `Loading... - ${APP.documentTitle}`;
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