import Cookies from 'js-cookie';

/*
* @class 	Deals with getting/setting the cookies for recent searches
*/
export class RecentSearchesList {
	
	/*
	* @constructor
	*/
	constructor() {
		this.cookieName = 'recentSearches';
		let cookie = Cookies.get(this.cookieName);
		// If no cookie found, it will be undefined
		if (cookie === undefined) {
			// Change the cookie to "[]" so that it does not parse "undefined"
			cookie = "[]";
		}
		this.array = JSON.parse(cookie);
		// Maximum amount of recent searches to store
		this.maxLength = 25;
	}
	
	/*
	* Converts the array into a string
	*
	* @override
	* @return {string} 	Stringified array
	*/
	toString() {
		return JSON.stringify(this.array);
	}
	
	toArray() {
		return this.array;
	}

	/*
	* Adds an element to the front of the queue
	*
	* @param {string} ele 	The player name to add
	*/
	add(ele) {
		const str = String(ele)
		const array = this.array;
		
		// The new player name is put at the front of the queue
		let newArray = [str];
		// Subsequent player names are added after
		for (const a of array) {
			// To avoid repetitions in the queue
			if (!newArray.includes(a)) {
				newArray.push(a);
			}
		}
		this._set(newArray.slice(0,this.maxLength));
	}

	/*
	* Sets the recentSearches cookie
	*
	* @param {array} 
	*/
	_set(array) {
		this.array = array;
		Cookies.set(this.cookieName, this.toString(), {expires:365});
	}

	/*
	* Clears the recentSearches cookie
	*/
	clear() {
		this._set([]);
		Cookies.remove(this.cookieName);
	}
}