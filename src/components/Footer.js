import React from 'react';
import './Footer.css';
import p from '../properties.js';
import { Link } from '../components';

/*
* Footer that appears at the bottom of the page
*	Retrieves data from properties.js
*/
export function Footer(props) {
	return (
		<div className="p-1 footer">
			<small>
				Powered by the&nbsp;
				<Link href={p.hypixelAPIURL}>{p.hypixelAPI}</Link>. 
				Hosted on&nbsp;
				<Link href={p.gitHubURL}>{p.gitHubName}</Link>.
			</small>
			<small className="text-right">
				Made with ❤️ by&nbsp;
				<Link href={p.authorURL}>{p.author}</Link>.
			</small>
		</div>
		);
}