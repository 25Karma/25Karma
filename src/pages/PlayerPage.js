import Cookies from 'js-cookie';
import React from 'react';
import { FaSortAlphaDown } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

import { AccordionList, LoadingSpinner, Navbar, PageLayout, 
	PlayerCard, PlayerHeadline, ReactIcon } from 'components';
import properties from 'constants/site';
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
			document.title = `${context.mojang.username} | ${properties.documentTitle}`;
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
			document.title = properties.documentTitle;
			return <FrontPage config={context} />
		default:
			document.title = properties.documentTitle;
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