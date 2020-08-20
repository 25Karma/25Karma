import React from 'react';
import './StatRow.css';

/*
* Contains a row of StatCells in a table
*
* @param {boolean} props.isHighlighted 	Whether to display the row in the highlighted color
* @param {string} props.id 				Used to identify whether the row is the 'Overall' row
* @param {string} props.children 	
*/
export function StatRow(props) {
	const highlightColor = 'c-pink';
	const className = `${props.isHighlighted && highlightColor} ${props.id === '' && 'statrow-bold'}`;
	return (
		<tr className={className}>
			{props.children}
		</tr>
		);
}