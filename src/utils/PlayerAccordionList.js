import React from 'react';
import Cookies from 'js-cookie';
import * as Accordion from 'pages/PlayerPage/components';

/*
* @class 	Deals with getting/setting the cookies that track
* 			the user's preference for accordion order
*			Used in conjunction with the react-beautiful-dnd library
*/
export class PlayerAccordionList {
	
	/*
	* @constructor
	*/
	constructor() {
		this.cookieName = 'playerAccordions';
		let cookie = Cookies.get(this.cookieName);
		// If no cookie found, it will be undefined
		if (cookie === undefined) {
			this.array = null;
			this.alphabetizeArray();
		}
		else {
			this.array = JSON.parse(cookie);
			// Add any Accordions that were not found in the cookie data
			for (const [name] of Object.entries(Accordion)) {
				if (!this.array.includes(name)) {
					this.array.push(name);
				}
			}
		}
	}

	/*
	* Moves the dragged component to its new index in the array
	*
	* @param {Object} result 	The event object returned by react-beautiful-dnd
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
	* @return {array<JSX>} 	An array of Accordion components
	*/
	toJSX() {
		let Accordions = [];
		// For react-beautiful-dnd, Draggable components require an integer index prop
		let index = 0;
		for (const Accordion of this.array) {
			const component = this._getAccordionFromString(Accordion);
			const props = {
				key: Accordion, 
				index: index++,
			};
			Accordions.push(React.createElement(component, props, null));
		}
		return Accordions;
	}
	
	/*
	* Sets the Accordions in the array in alphabetical order
	*/
	alphabetizeArray() {
		// Get the default (alphabetical) order of the Accordions
		let AccordionArray = [];
		for (const [name] of Object.entries(Accordion)) {
			AccordionArray.push(name);
		}
		this.array = AccordionArray;
		this._set();
	}

	/*
	* Finds the Accordion component that corresponds to a string
	*
	* @param {string} str 	The name of the component
	* @return {Object} 		The component object itself
	*/
	_getAccordionFromString(str) {
		// Finds the matching component from within the Accordion module
		for (const [name, component] of Object.entries(Accordion)) {
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
	* @return {string} 	Stringified array
	*/
	_toString() {
		return JSON.stringify(this.array);
	}
	
	/*
	* Sets the playerAccordions cookie
	*/
	_set() {
		Cookies.set(this.cookieName, this._toString(), {expires:365});
	}

	/*
	* Clears the playerAccordions cookie
	*/
	clear() {
		Cookies.remove(this.cookieName);
	}
}