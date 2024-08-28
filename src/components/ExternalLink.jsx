import React from 'react';

/**
 * Styled anchor link that opens URI in new tab
 *
 * @param {string} props.href        The URI to open on click
 * @param {string} props.children    Text of the link
 */
export function ExternalLink(props) {
	let { href } = props;
	if (!href.startsWith('http')) {
		href = 'https://' + href;
	}
	return <a className="link" target="_blank" rel="noopener noreferrer" href={href}>
			{props.children}
		</a>;
}