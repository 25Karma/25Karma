import React from 'react';
import { FaSortAlphaDown } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { AccordionList, LoadingSpinner, PageLayout, ReactIcon } from 'components';
import { QuestsAccordions, QuestsCard, QuestsHeadline } from './components';
import { APP, COOKIES } from 'constants/app';
import { useAPIContext } from 'hooks';
import { FrontPage } from 'pages';
import { pushToRecentSearches } from 'utils';

/*
* Page that displays the quests of an individual player
*/
export function QuestsPage(props) {
	const { slug } = useParams();
	const context = useAPIContext(slug, 'quests');

	switch (context.success) {
		case true:
			document.title = `${context.mojang.username}'s Quests - ${APP.documentTitle}`;
			// Log the player into recentSearches cookie
			pushToRecentSearches(context.mojang.username);
			return (
				<PageLayout 
				searchbar
				top={<QuestsHeadline />}
				left={
					<React.Fragment>
						<div className="py-1 hidden"><ReactIcon icon={FaSortAlphaDown} /></div>
						<QuestsCard />
					</React.Fragment>
				}
				center={<AccordionList cookie={COOKIES.questAccordions} accordionModule={QuestsAccordions} />}/>
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
						<LoadingSpinner text={`Loading ${slug}'s quests`} />
					</div>
				} />
			);
	}
}