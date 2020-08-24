import { useState, useEffect } from 'react';
import p from 'properties.js';

/*
* Makes an API call to Mojang to get data on a player
*
* @param {string} slug 	The username or UUID of the player
* @param {string} type 	Name of endpoint - default 'stats'
* @return {JSON} 		JSON object containing data fetched from the Hypixel API
*/
export function useAPI(slug, type) {
	const [data, setData] = useState({});
	
	useEffect(() => {
		async function getData(slug) {
			const url = `${p.API}player/${type || 'stats'}/${slug}`;
			return fetch(url)
				.then((response) => response.json())
				.then((json) => {
					setData(json);
				});
		}
		
		setData({});
		if (slug) {
			getData(slug);
		}
	}, [type, slug]);

	return data;
}