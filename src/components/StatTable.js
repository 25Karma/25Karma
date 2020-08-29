import React from 'react';
import './StatTable.css';

export function StatTable(props) {
	return <table className="stattable">{props.children}</table>
}
