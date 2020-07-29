export class HypixelAPI {

	constructor(key) {
		this.url = "https://api.hypixel.net/";
		this.key = key;
	}

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