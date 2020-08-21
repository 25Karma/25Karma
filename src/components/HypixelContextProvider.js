import React from 'react';
import { useParams } from 'react-router-dom';
import { hypixelContext, useHypixelAPI, useMojangAPI } from 'hooks';
import * as Utils from 'utils';

/*
* Provider for the Hypixel Context
*
* @param {JSX} props.children 	
*/
export function HypixelContextProvider(props) {
	const { slug } = useParams();
	const mojang = useMojangAPI(slug);
	const friends = useHypixelAPI(mojang.uuid, 'friends');
	const guild = useHypixelAPI(mojang.uuid, 'guild');
	const player = useHypixelAPI(mojang.uuid);
	const status = useHypixelAPI(mojang.uuid, 'status');

	// A variable to store if all the API calls are finished
	const isFinished = [mojang, friends, guild, player, status].every(
		response => !Utils.isEmpty(response));

	if (isFinished) {
		document.title = `${mojang.username} | Hypixel Player Stats`;
	} 
	else {
		document.title = `Hypixel Player Stats`;
	}

	if (mojang.success && player.success) {
		// Log the player into recentSearches cookie
		const recentSearchesList = new Utils.RecentSearchesList();
		recentSearchesList.add(mojang.username);
	}

	const value = {
		friends, // Player's friends
		guild, // Player's guild
		isFinished,
		mojang, // Player's username and uuid from the Mojang API
		player, // General player statistics
		slug,
		status, // Player's online status
	}

	return <hypixelContext.Provider value={value}>{props.children}</hypixelContext.Provider>;
}