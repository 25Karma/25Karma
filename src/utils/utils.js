import properties from '../properties.js';

export class HypixelAPI {

	constructor(key) {
		this.url = properties.hypixelAPIURL;
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

export function getURLParams() {
	// Get params from URL
	var params = {};
	var vars = window.location.search.substr(1).split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
}

export function searchForPlayer(playerName) {
	const player = encodeURIComponent(playerName);
	if (player === "") {
		return;
	}
	const origin = window.location.origin;
	window.location.href = `${origin}/?player=${player}`;
}

export function set1If0(number) {
	if (number === 0) {
		return 1;
	}
	return number;
}

export function inheritClassName(props) {
	const className = props.className;
	if (className === undefined) return ''
	return className
}