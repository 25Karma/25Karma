import React from 'react';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { useAPI } from 'hooks';
import properties from 'constants/site';

export const HypixelContext = React.createContext({});

/*
* Provider for the Hypixel Context
*
* @param {JSX} props.children 	
*/
export function HypixelContextProvider(props) {
	const { slug } = useParams();
	let response = useAPI(slug, 'player');

	if (response.success) {
		document.title = `${response.mojang.username} | ${properties.documentTitle}`;
		// Log the player into recentSearches cookie
		pushToRecentSearches(response.mojang.username);
	} 
	else {
		document.title = properties.documentTitle;
	}

	const value = {
		...response,
		slug,
	}

	return <HypixelContext.Provider value={value}>{props.children}</HypixelContext.Provider>;
}

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