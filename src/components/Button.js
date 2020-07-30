import React from 'react';
import './Button.css';

export function Button(props) {
	return (
		<button className="btn25 py-1 px-2" onClick={props.onClick}>{props.children}</button>
		);
}