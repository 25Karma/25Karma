import properties from '../properties.js';
import Cookies from 'js-cookie';

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

export class RecentSearches {

	constructor() {
		let cookie = Cookies.get('recentSearches');
		if (cookie === undefined) {
			cookie = "[]";
		}
		this.array = JSON.parse(cookie);
		this.maxLength = 5;
	}

	toString() {
		return JSON.stringify(this.array);
	}

	toArray() {
		return this.array;
	}

	add(ele) {
		const str = String(ele)
		const array = this.array;

		let newArray = [str];
		for (const a of array) {
			if (!newArray.includes(a)) {
				newArray.push(a);
			}
		}
		this._set(newArray.slice(0,this.maxLength));
	}

	_set(array) {
		this.array = array;
		Cookies.set('recentSearches', this.toString(), {expires:365});
	}

	clear() {
		this._set([]);
		Cookies.remove('recentSearches');
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

export function traverse(json, path) {
	const paths = path.split('.');
	for (const p of paths) {
		json = json[p];
		if (json === undefined) return {};
	}
	return json;
}