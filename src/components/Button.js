import React from 'react';
import './Button.css';

export function Button(props) {
	return (
		<button 
			className={`btn25 py-1 px-2 btn25-${props.type || 'default'}`} 
			onClick={props.onClick}>
			{props.children}
		</button>
		);
}