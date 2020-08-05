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
	* Requests player data from the API
	*
	* @param {string} name Username of the player (UUID not supported)
	* @return {Promise} Should be deconstructed inside an async/await function
	*/
	getPlayerByUUID(uuid) {
		const url = `${this.url}player?key=${this.key}&uuid=${uuid}`
		return fetch(url, {'mode': 'cors', 'Access-Control-Allow-Origin': "*"})
			.then((response) => response.json())
			.then((json) => {
				if (json['success']) {
					return json['player'];
				}
				return null;
			});
	}

	/*
	* Requests data about player status from the API
	*
	* @param {string} name Username of the player (UUID not supported)
	* @return {Promise} Should be deconstructed inside an async/await function
	*/
	getStatusByUUID(uuid) {
		const url = `${this.url}status?key=${this.key}&uuid=${uuid}`
		return fetch(url, {'mode': 'cors', 'Access-Control-Allow-Origin': "*"})
			.then((response) => response.json())
			.then((json) => {
				if (json['success']) {
					return json['session'];
				}
				return null;
			});
	}
}