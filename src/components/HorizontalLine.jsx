import React from 'react';

/**
 * A horizontal line that spans the full width of its container
 *
 * @param {string} props.className    CSS classes for tweaking padding and margins
 */
export function HorizontalLine(props) {
	const { className } = props;
	return <div className={`w-100 ${className}`} style={{ borderBottom : '1px solid var(--theme-border)'}}></div>
}