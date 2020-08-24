import React from 'react';
import { useParams } from 'react-router-dom';
import { HypixelContext, useAPI } from 'hooks';
import * as Utils from 'utils';
import properties from 'properties.js';

/*
* Provider for the Hypixel Context
*
* @param {JSX} props.children 	
*/
export function HypixelContextProvider(props) {
	const { slug } = useParams();
	let response = useAPI(slug, 'stats');

	if (response.success) {
		document.title = `${response.mojang.username} | ${properties.documentTitle}`;
		// Log the player into recentSearches cookie
		const recentSearchesList = new Utils.RecentSearchesList();
		recentSearchesList.add(response.mojang.username);
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