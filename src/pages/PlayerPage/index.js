import Cookies from 'js-cookie';
import React from 'react';
import { FaSortAlphaDown } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { Crafatar, ExternalLink, GuildTag, LoadingSpinner, 
	Navbar, PageLayout, PlayerCard, PlayerName,
	ReactIcon, Status } from 'components';
import { AccordionList } from './components';
import { APP } from 'constants/app';
import { FrontPage } from 'pages';
import { useAPIContext } from 'hooks';

/*
* Page that displays the stats for an individual player
* The assumption being that it is only called by App.js if the APIContext is not null
*/
export function PlayerPage(props) {
	const { slug } = useParams();
	const context = useAPIContext(slug, 'player');

	function pushToRecentSearches(ele) {
		const str = String(ele);
		let cookie = Cookies.get('recentSearches');
		if (cookie === undefined) {
			cookie = '[]';
		}
		const array = JSON.parse(cookie);
		const maxLength = 30;
		
		// The new player name is put at the front of the queue
		let newArray = [str];
		// Subsequent player names are added after
		for (const a of array) {
			// To avoid repetitions in the queue
			if (!newArray.includes(a)) {
				newArray.push(a);
			}
		}
		Cookies.set('recentSearches', JSON.stringify(newArray.slice(0,maxLength)), {expires:365});
	}
	
	switch(context.success) {
		case true:
			document.title = `${context.mojang.username} | ${APP.documentTitle}`;
			// Log the player into recentSearches cookie
			pushToRecentSearches(context.mojang.username);
			return (
			<PageLayout
				header={<Navbar searchbar />}
				top={<PlayerHeadline />}
				left={
					<React.Fragment>
						<div className="py-1 hidden"><ReactIcon icon={FaSortAlphaDown} /></div>
						<PlayerCard />
					</React.Fragment>
				}
				center={<AccordionList />}/>
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
						<LoadingSpinner text={`Loading stats for ${slug}`} />
					</div>
				}/>
			);
	}
}

/*
* Displays face, username, and status of the player in the Hypixel Context
*/
function PlayerHeadline(props) {
	const { mojang, player, guild, status } = useAPIContext();

	return (
		<div className="h-flex px-2 align-items-center">
			{mojang.uuid &&
				<ExternalLink href={`https://namemc.com/profile/${mojang.uuid}`}>
					<Crafatar uuid={mojang.uuid} shadow />
				</ExternalLink>
			}
			<div className="text-shadow pl-2">
				<PlayerName username={mojang.username} player={player} size="xl" />
				<Link to={`/guild/${mojang.username}`}>
					<GuildTag guild={guild} size="xl" />
				</Link>
			</div>
			<Status player={player} status={status} size="xl" />
		</div>
		);
}