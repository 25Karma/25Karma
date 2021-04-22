import React from 'react';
import './Table.css';

/*
* Table with site-specific CSS properties
*
* @param {string} props.display   Either 'compact' (default) or 'comfortable'     
*/
export function Table({ display = 'compact', children }) {
	return <table className={`stattable stattable-${display}`}>{children}</table>
}
