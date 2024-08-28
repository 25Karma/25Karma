import React from 'react';
import { formatNum } from 'src/utils';

/**
 * Shows a statistic in a cell of a table
 *
 * @param {string} props.children       The value of the stat 
 * @param {string} props.color          The color of the stat - default white
 * @param {boolean} props.shrink        Whether the stat should only take up the minimum width
 * @param {boolean} props.percentage    Whether the stat should be displayed as a percentage
 */
export function Cell(props) {
	function renderChildren() {
		if (props.children === undefined) return 0;
		else if (isNaN(props.children)) return props.children;
		else {
			if (props.percentage) return `${formatNum(props.children * 100)}%`
			else return formatNum(props.children);
		}
	}

	const classNames = [
		props.color && `c-${props.color}`,
		props.shrink && 'td-shrink',
	].filter(n => n);

	return (
		<td className={classNames.length > 0 ? classNames.join(' ') : undefined}>{renderChildren()}</td>
		);
}