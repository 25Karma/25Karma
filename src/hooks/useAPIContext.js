import { useContext, useEffect, useState } from 'react';
import { APIContext } from 'contexts';
import { APP } from 'constants/app';

/*
* Makes an API call to Mojang to get data on a player, or returns the current context
*
* @param {string} slug    The username or UUID of the player
* @param {string} type    Name of endpoint
* @return {JSON}          JS object containing data fetched from the Hypixel API
*/
export function useAPIContext(slug, type) {
	const { APIData, setAPIData } = useContext(APIContext);
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
						setAPIData(json);
						setFetchStatus(true);
					}
				});
		}
		if (slug) {
			setAPIData({});
			fetchFromAPI();
		}
	}, [slug, type, setAPIData])
	
	// If we are fetching new data from the API, we don't want to return the old data from the context
	// We return an empty JS object until the new data has been fetched
	if (slug) {
		return fetchStatus ? APIData : {};
	}
	else {
		return APIData;
	}
}