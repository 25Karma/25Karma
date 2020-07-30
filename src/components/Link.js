import React from 'react';

export function Link(props) {
	return <a className="link" target="_blank" rel="noopener noreferrer" href={props.href}>
			{props.children}
		</a>;
}