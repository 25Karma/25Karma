import React from 'react';
import './Table.css';

/**
 * Table with site-specific CSS properties
 *
 * @param {string} props.display      Either 'compact' (default) or 'comfortable'
 * @param {string} props.className    CSS classes for tweaking padding and margins  
 */
export function Table({ display = 'compact', children, className = ''}) {
	return <table className={`stattable stattable-${display} ${className}`}>{children}</table>
}
