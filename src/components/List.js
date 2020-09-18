import React, { memo } from 'react';
import './List.css';

/*
* A table formatted to look like a vertical list
*
* @param {string} props.children 
*/
export const List = memo((props) => {
	return (
		<div className="overflow-x v-flex">
			<table className="list">
				{props.children}
			</table>
		</div>
		);
});