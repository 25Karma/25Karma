import React from 'react';
import './Button.css';

/**
 * Styled button
 *
 * @param {string} props.type         The theme of the button - supports types 'error', 'default' by default
 * @param {Function} props.onClick    Runs when the button is clicked
 * @param {Function} props.active     Whether the border should be highlighted or not
 * @param {string} props.children     The text in the button
 */
export function Button(props) {
	const classes = [
		'btn py-1 px-2',
		`btn-${props.active ? 'active' : 'inactive'}`,
		`btn-${props.type || 'default'}`,
	];
	return (
		<button 
			className={classes.join(' ')} 
			onClick={props.onClick}>
			{props.children}
		</button>
		);
}