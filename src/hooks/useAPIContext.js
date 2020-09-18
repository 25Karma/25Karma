import { useContext, useEffect, useState } from 'react';
import { AppContext } from 'contexts';
import { APP } from 'constants/app';

/*
* Makes an API call to Mojang to get data on a player
*
* @param {string} slug 	The username or UUID of the player
* @param {string} type 	Name of endpoint
* @return {JSON} 		JS object containing data fetched from the Hypixel API
*/
export function useAPIContext(slug, type) {
	const { APIContext, setAPIContext } = useContext(AppContext);
	// Monitors the state of the API fetch, if a slug is provided
	const [fetchStatus, setFetchStatus] = useState(false);
	useEffect(() => {
		async function fetchFromAPI() {
			const href = window.location.href;
			const url = `${APP.API}${type}/${slug}`;
			return fetch(url)
				.then((response) => response.json())
				.then((json) => {
					if(window.location.href === href){
						setAPIContext(json);
						setFetchStatus(true);
					}
				});
		}
		if (slug) {
			setAPIContext({});
			fetchFromAPI();
		}
	}, [slug, type, setAPIContext])
	
	// If we are fetching new data from the API, we don't want to return the old data from the context
	// We return an empty JS object until the new data has been fetched
	if (slug) {
		return fetchStatus ? APIContext : {};
	}
	else {
		return APIContext;
	}
}