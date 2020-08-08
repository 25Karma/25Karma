import React from 'react';
import Cookies from 'js-cookie';
import { Ribbon } from 'components';

/*
* @class Deals with getting/setting the cookies that track
* 	the user's preference for ribbon order
*	Used in conjunction with the react-beautiful-dnd library
*/
export class PlayerRibbonList {
	
	/*
	* @constructor
	* @param {Object} playerdata JSON data of the player (from Hypixel API)
	*/
	constructor(playerdata) {
		this.cookieName = 'playerRibbons';
		this.playerdata = playerdata;
		let cookie = Cookies.get(this.cookieName);
		// If no cookie found, it will be undefined
		if (cookie === undefined) {
			// Get the default (alphabetical) order of the ribbons
			let ribbonArray = [];
			for (const [name] of Object.entries(Ribbon)) {
				if (name !== 'Player' && name !== 'Ribbon') {
					ribbonArray.push(name);
				}
			}
			this.array = ribbonArray;
			this._set();
		}
		else {
			this.array = JSON.parse(cookie);
			// Add any Ribbons that were not found in the cookie data
			for (const [name] of Object.entries(Ribbon)) {
				if (name !== 'Player' && name !== 'Ribbon' && !this.array.includes(name)) {
					this.array.push(name);
				}
			}
		}
	}

	/*
	* Moves the dragged component to its new index in the array
	*
	* @param {Object} result The event object returned by react-beautiful-dnd
	*/
	onDragEnd(result) {
		const startIndex = result.source.index;
		const endIndex = result.destination.index;
		const [removed] = this.array.splice(startIndex, 1);
		this.array.splice(endIndex, 0, removed);
		this._set();
	}
	
	/*
	* Converts this.array into an array of JSX components
	*
	* @override
	* @return {array<JSX>} An array of Ribbon components
	*/
	toJSX() {
		if (!this.playerdata) {
			return null;
		}
		let ribbons = [];
		// For react-beautiful-dnd, Draggable components require an integer index prop
		let index = 0;
		for (const ribbon of this.array) {
			const component = this._getRibbonFromString(ribbon);
			const props = {
				key: ribbon, 
				player: this.playerdata,
				index: index++,
			};
			ribbons.push(React.createElement(component, props, null));
		}
		return ribbons;
	}

	/*
	* Finds the Ribbon component that corresponds to a string
	*
	* @param {string} str The name of the component
	* @return {Object} The component object itself
	*/
	_getRibbonFromString(str) {
		// Finds the matching component from within the Ribbon module
		for (const [name, component] of Object.entries(Ribbon)) {
			if (name === str) {
				return component;
			}
		}
		return null;
	}

	/*
	* Converts this.array into a string
	*
	* @override
	* @return {string} Stringified array
	*/
	_toString() {
		return JSON.stringify(this.array);
	}
	
	/*
	* Sets the playerRibbons cookie
	*/
	_set() {
		Cookies.set(this.cookieName, this._toString(), {expires:365});
	}

	/*
	* Clears the playerRibbons cookie
	*/
	clear() {
		Cookies.remove(this.cookieName);
	}
}