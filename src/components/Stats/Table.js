import React from 'react';
import './Table.css';

export function Table(props) {
	return <table className="stattable">{props.children}</table>
}
