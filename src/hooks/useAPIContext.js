import { useContext, useEffect, useState } from 'react';
import { APIContext } from 'src/contexts';
import { APP } from 'src/constants/app';
import { getClientHeaders, httpGet } from 'src/utils';

/**
 * Makes an API call to Mojang to get data on a player, or returns the current context
 *
 * @param {string} slug    The username or UUID of the player
 * @param {string} type    Name of endpoint
 * @returns {Object}       JS object containing data fetched from the Hypixel API
 */
export function useAPIContext(slug, type) {
	const { APIData, setAPIData } = useContext(APIContext);
	const requestKey = slug ? `${type}/${slug}` : null;
	const [loadedRequestKey, setLoadedRequestKey] = useState(null);

	useEffect(() => {
		if (!slug) return;

		let ignore = false;

		async function fetchFromAPI() {
			const url = `${APP.apiUrl}/${type}/${slug}`;

			setAPIData({});
			setLoadedRequestKey(null);

			try {
				const response = await httpGet(url, { headers: await getClientHeaders() });
				const json = await response.json();
				if (!ignore) {
					setAPIData(json);
					setLoadedRequestKey(requestKey);
				}
			} catch {
				if (!ignore) {
					setAPIData({ success: false, reason: 'UNKNOWN', slug });
					setLoadedRequestKey(requestKey);
				}
			}
		}

		fetchFromAPI();

		return () => {
			ignore = true;
		};
	}, [slug, type, requestKey, setAPIData])
	
	// If we are fetching new data from the API, we don't want to return the old data from the context
	// We return an empty JS object until the new data has been fetched
	if (slug) {
		return loadedRequestKey === requestKey ? APIData : {};
	}
	else {
		return APIData;
	}
}
