import React from 'react';
import { formatNum } from 'utils';

/*
* Shows a title/value pair for stats
*
* @param {string} props.title 		The title of the stat (will be in bold)
* @param {string} props.children 	The value of the stat 
* @param {string} props.color 		The color of the stat (title will always be white)
* @param {boolean} props.percentage Whether the stat should be displayed as a percentage
*/
export function Stat(props) {
	function renderChildren() {
		if (props.children === undefined) return 0;
		else if (isNaN(props.children)) return props.children;
		else {
			if (props.percentage) return `${formatNum(props.children * 100)}%`
			else return formatNum(props.children);
		}
	}

	return (
		<div style={{paddingBottom: '0.25rem'}}>
			<span className="font-bold">{`${props.title}: `}</span>
			<span className={`c-${props.color || 'gray'}`}>
				{renderChildren()}
			</span>
		</div>
		);
}