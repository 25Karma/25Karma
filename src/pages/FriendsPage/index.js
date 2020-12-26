import React from 'react';
import { useParams } from 'react-router-dom';
import { LoadingSpinner, Navbar, PageLayout, PlayerCard } from 'components';
import { FriendsHeadline, FriendsList } from './components';
import { APP } from 'constants/app';
import { FrontPage } from 'pages';
import { useAPIContext } from 'hooks';
import { pushToRecentSearches } from 'utils';

/*
* Page that displays the friends of an individual player
*/
export function FriendsPage(props) {
	const { slug } = useParams();
	const context = useAPIContext(slug, 'friends');
	
	switch(context.success) {
		case true:
			document.title = `${context.mojang.username}'s Friends - ${APP.documentTitle}`;
			// Log the player into recentSearches cookie
			pushToRecentSearches(context.mojang.username);
			return (
			<PageLayout
				header={<Navbar searchbar />}
				top={<FriendsHeadline />}
				left={<PlayerCard page="friends" />}
				center={<FriendsList />}/>
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
						<LoadingSpinner text={`Loading friends of ${slug}`} />
					</div>
				}/>
			);
	}
}