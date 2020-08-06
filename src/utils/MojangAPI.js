/*
* @class Handles all communication with the Mojang API
*/
export class MojangAPI {

	/*
	* @constructor
	*/
	constructor() {
		// https://stackoverflow.com/a/43881141
		this.proxyurl = 'http://allow-any-origin.appspot.com/'
		this.url = 'https://api.mojang.com/';
	}

	/*
	* Gets UUID of player
	*
	* @param {string} username Username of the player
	* @return {Promise} Should be deconstructed inside an async/await function
	*/
	getUUIDofPlayer(username) {
		const getuuid = this.proxyurl + this.url + 'users/profiles/minecraft/' + username;
		return fetch(getuuid, {'mode': 'cors', 'Access-Control-Allow-Origin': "*"})
			.then((response) => response.json())
			.then((json) => {
				return json['id'];
			});
	}
}