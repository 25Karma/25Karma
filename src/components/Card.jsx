import React from 'react';
import './Card.css';

/**
 * A card component to display on the left sidebar
 *
 * @param {string} props.className    Classes to apply - intended for padding/margin use only
 * @param {string} props.children     Components to display inside the card
 */
export function Card(props) {
	return (
		<div className={`card ${props.className || ''}`}>{props.children}</div>
		)
}