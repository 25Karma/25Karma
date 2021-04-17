import React from 'react';
import { FaSortAlphaDown } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { LoadingSpinner, PageLayout, ReactIcon } from 'components';
import { AccordionList, PlayerCard, PlayerHeadline } from './components';
import { APP } from 'constants/app';
import { FrontPage } from 'pages';
import { useAPIContext } from 'hooks';
import { pushToRecentSearches } from 'utils';

/*
* Page that displays the stats for an individual player
* The assumption being that it is only called by App.js if the APIContext is not null
*/
export function PlayerPage(props) {
	const { slug } = useParams();
	const context = useAPIContext(slug, 'player');
	
	switch(context.success) {
		case true:
			document.title = `${context.mojang.username}'s Stats - ${APP.documentTitle}`;
			// Log the player into recentSearches cookie
			pushToRecentSearches(context.mojang.username);
			return (
				<PageLayout
				searchbar
				top={<PlayerHeadline />}
				left={
					<React.Fragment>
						<div className="py-1 hidden"><ReactIcon icon={FaSortAlphaDown} /></div>
						<PlayerCard page="player" />
					</React.Fragment>
				}
				center={<AccordionList />}/>
			);
		case false:
			return <FrontPage config={context} />
		default:
			document.title = `Loading... - ${APP.documentTitle}`;
			return (
				<PageLayout
				searchbar
				center={
					<div className="py-5">
						<LoadingSpinner text={`Loading stats for ${slug}`} />
					</div>
				}/>
			);
	}
}