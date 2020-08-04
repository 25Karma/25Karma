import p from 'properties.js';

/*
* @class Handles all communication with the Hypixel API
*/
export class HypixelAPI {
	/*
	* @constructor
	* @param {string} key API key
	*/
	constructor(key) {
		this.url = p.hypixelAPIURL;
		this.key = key;
	}
	
	/*
	* Requests data from the API
	*
	* @param {string} name Username of the player (UUID not supported)
	* @return {Promise} Should be deconstructed inside an async/await function
	*/
	getDataOfPlayer(name) {
		const params = {
			key : this.key,
			name : name
		}
		return fetch(this._playerDataURL(params), {'mode': 'cors', 'Access-Control-Allow-Origin': "*"})
			.then((response) => response.json())
			.then((json) => {
				if (json['success']) {
					return json['player'];
				}
				return null;
			});
	}
	
	/*
	* Generates URI for the Hypixel API call
	*
	* @param {Object} JSON containing key and player name data
	* @return {string} The URI for calling the API for a specific player
	*/
	_playerDataURL(params) {
		let url = this.url + "player?";

		let first = true;
		for (const [key, val] of Object.entries(params)) {
			if (!first) {
				url += "&";
			}
			url += `${key}=${encodeURIComponent(val)}`;
			first = false;
		}

		return url;
	}
}