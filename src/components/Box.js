import React from 'react';

export function Box(props) {
	return (
		<div className="v-flex align-items-center py-1 px-2">
			<small>{props.title}</small>
			<p className={`font-md font-minecraft c-${props.color || 'gray'}`}>
				{props.children}
			</p>
		</div>
		);
}