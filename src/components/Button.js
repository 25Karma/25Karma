import React from 'react';
import './Button.css';

/*
* Styled button
*
* @param {string} props.type The theme of the button
*	Currently supports type 'error', 'default' by default
* @param {function} props.onClick Runs when the button is clicked
* @param {string} props.children The text in the button
*/
export function Button(props) {
	return (
		<button 
			className={`btn25 py-1 px-2 btn25-${props.type || 'default'}`} 
			onClick={props.onClick}>
			{props.children}
		</button>
		);
}