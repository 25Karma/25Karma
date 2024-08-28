import React from 'react';
import { formatNum } from 'src/utils';

/**
 * Shows a title/value pair for stats
 *
 * @param {string} props.title          The title of the stat (will be in bold)
 * @param {string} props.children       The value of the stat 
 * @param {string} props.color          The color of the stat (title will always be white)
 * @param {boolean} props.percentage    Whether the stat should be displayed as a percentage
 */
export function Pair(props) {
	const { title, children, color = '', percentage } = props;

	function renderChildren() {
		if (children === undefined) return 0;
		else if (isNaN(children)) return children;
		else {
			if (percentage) return `${formatNum(children * 100)}%`
			else return formatNum(children);
		}
	}

	return (
		<p>
			<span className="font-bold">{title}{': '}</span>
			<span className={`c-${color || 'gray'}`}>
				{renderChildren()}
			</span>
		</p>
		);
}