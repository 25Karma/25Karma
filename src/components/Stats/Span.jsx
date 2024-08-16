import React from 'react';

export function Span(props) {
	const {color, children} = props;

	return <span className={color && `c-${color}`}>{children}</span>
}