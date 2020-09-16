import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { ExternalLink } from 'components';

/*
* Footer that appears at the bottom of the page
* Retrieves data from properties.js
*/
export function Footer(props) {
	return (
		<footer className="p-1 footer font-xs border">
			<span>
				Powered by the&nbsp;
				<ExternalLink href="https://api.hypixel.net/">Hypixel API</ExternalLink>. 
				Hosted on&nbsp;
				<ExternalLink href="https://pages.github.com/">GitHub Pages</ExternalLink>.
			</span>
			<span className="text-right">
				{`Made with ❤️ by `}
				<Link to="/player/a6df397efeab496d9f2a6d6eeab10470" className="link">Amos Yu</Link>.
			</span>
		</footer>
		);
}