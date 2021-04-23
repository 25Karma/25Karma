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
			</span>
			<span className="text-right">
				{`Made with ❤️ by `}
				<Link to="/search/a6df397efeab496d9f2a6d6eeab10470" className="link">Amos</Link>.
			</span>
		</footer>
		);
}