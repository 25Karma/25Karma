import React from 'react';
import './Footer.css';
import p from 'properties.js';
import { ExternalLink } from 'components';

/*
* Footer that appears at the bottom of the page
*	Retrieves data from properties.js
*/
export function Footer(props) {
	return (
		<div className="p-1 footer font-xs">
			<span>
				Powered by the&nbsp;
				<ExternalLink href={p.hypixelAPIURL}>{p.hypixelAPI}</ExternalLink>. 
				Hosted on&nbsp;
				<ExternalLink href={p.gitHubURL}>{p.gitHubName}</ExternalLink>.
			</span>
			<span className="text-right">
				{`Made with ❤️ by `}
				<ExternalLink href={p.authorURL}>{p.author}</ExternalLink>.
			</span>
		</div>
		);
}