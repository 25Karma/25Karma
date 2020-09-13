import { useState, useEffect } from 'react';
import p from 'constants/site';

/*
* Makes an API call to Mojang to get data on a player
*
* @param {string} slug 	The username or UUID of the player
* @param {string} type 	Name of endpoint - default 'stats'
* @return {JSON} 		JSON object containing data fetched from the Hypixel API
*/
export function useAPI(slug, type) {
	const [data, setData] = useState({});
	const href = window.location.href;
	
	useEffect(() => {
		async function getData(slug) {
			const url = `${p.API}${type || 'player'}/${slug}`;
			return fetch(url)
				.then((response) => response.json())
				.then((json) => {
					if(window.location.href === href){
						setData(json);
					}
				});
		}
		
		setData({});
		if (slug) {
			getData(slug);
		}
	}, [type, href, slug]);

	return data;
}