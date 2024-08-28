import React from 'react';
import './Row.css';

/**
 * Contains a row of Cells in a table
 *
 * @param {boolean} props.isHighlighted    Whether to display the row in the highlighted color
 * @param {string} props.id                Used to identify whether the row is the 'Overall' row
 * @param {string} props.children          Contains Cell components
 */
export function Row(props) {
	const highlightColor = 'c-pink';
	const classNames = [
		props.isHighlighted && highlightColor,
		props.id === '' && 'statrow-bold',
	].filter(n => n);
	
	return (
		<tr className={classNames.length > 0 ? classNames.join(' ') : undefined}>
			{props.children}
		</tr>
		);
}