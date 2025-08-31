import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import './Footer.css';
import { ExternalLink, ReactIcon } from 'src/components';
import { APP } from 'src/constants/app';

/**
 * Footer that appears at the bottom of the page
 * Retrieves data from properties.js
 */
export function Footer() {
	return (
		<footer className="p-1 footer font-xs border">
			<span className="flex-1 h-flex align-items-center">
				Powered by the&nbsp;
				<ExternalLink href="https://api.hypixel.net/">Hypixel API</ExternalLink>. 
			</span>
			<span className="flex-1 h-flex align-items-center justify-content-center">
				Made with&nbsp;<ReactIcon icon={FaHeart} size="sm" />&nbsp;by&nbsp;
				<Link to={`/search/${APP.ownerUsername}`} className="link">{APP.ownerUsername}</Link>.
			</span>
			<span className="flex-1 h-flex align-items-center justify-content-end">
			</span>
		</footer>
		);
}