import { useState, useEffect } from 'react';
import p from 'properties.js';

/*
* Makes an API call to Mojang to get data on a player
*
* @param {string} type 	Name of endpoint - default 'player'
* @param {string} uuid 	The UUID of the player
* @return {JSON} 		JSON object containing data fetched from the Hypixel API
*/
export function useHypixelAPI(uuid, type) {
	const [data, setData] = useState({});
	
	useEffect(() => {
		async function getData(uuid) {
			const url = `${p.API}hypixel/${type || 'player'}/${uuid}`;
			return fetch(url)
				.then((response) => response.json())
				.then((json) => {
					setData(json);
				});
		}
		
		setData({});
		if (uuid) {
			getData(uuid);
		}
	}, [type, uuid]);

	return data;
}