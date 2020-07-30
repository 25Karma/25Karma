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

export function searchForPlayer(playerName) {
	if (!playerName) {
		return;
	}
	const player = encodeURIComponent(playerName);
	const origin = window.location.origin;
	window.location.href = `${origin}/?player=${player}`;
}

export function set1If0(number) {
	if (number === 0) {
		return 1;
	}
	return number;
}

export function default0(val) {
	if (!val || val === undefined || isNaN(val)) return 0;
	return val;
}

export function inheritClassName(props) {
	const className = props.className;
	if (className === undefined) return ''
	return className
}