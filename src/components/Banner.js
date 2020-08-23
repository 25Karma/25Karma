import React, { useState, useEffect, useRef } from 'react';
import './Banner.css';
import { MdReport, MdInfoOutline } from 'react-icons/md';
import { ReactIcon } from 'components';

/*
* A popup banner to display a message
*
* @param {string} props.type 		The theme of the banner to display
* @param {string} props.title 		Text to show in bold in the banner
* @param {string} props.description Text to show after the title 
* @param {boolean} props.expire 	Have the banner fade out after 5 seconds
* @param {function} props.onExpiry 	Parent's function that runs once the banner has fully faded out
*/
export function Banner(props) {
	
	const bannerRef = useRef('banner');
	const onExpiry = props.onExpiry;
	const expire = props.expire;
	const styleHidden = {
		opacity: '0',
		maxHeight: '0px',
		transition: 'opacity 0.5s, max-height 0.5s 0.5s'
	}
	var styleShown = {
		opacity: '1',
		maxHeight: null,
		transition: 'opacity 0.5s 0.5s, max-height 0.5s'
	}
	const [style, setStyle] = useState(styleHidden);
	
	/*
	* Returns a symbol based on the banner type
	* Currently supports types 'error' and 'info' only
	*/
	function getSymbol() {
		if (props.type === "error") {
			return <ReactIcon icon={MdReport} />;
		}
		else if (props.type === "info") {
			return <ReactIcon icon={MdInfoOutline} />;
		}
	}

	useEffect(() => {
		// Must dynamically calculate the full banner height and add it to the style
		// since we cannot transition from height:0; to height:auto;
		styleShown.maxHeight = bannerRef.current.scrollHeight+'px';
		setStyle(styleShown)
		if (expire) {
			setTimeout(function () {
				setStyle(styleHidden)
			}, 5000);
			setTimeout(function () {
				if (onExpiry) {
					onExpiry();
				}
			}, 6000);
		}
	}, []);

	return (
		<div ref={bannerRef} style={style}>
			<div className="pt-2"></div>
			<div  
				className={`banner banner-${props.type}`}>
				<div className="py-1 px-3">
					<span className="font-md pr-1">
						{getSymbol()}
					</span>
					<span className="font-bold">{props.title}</span>
					<span>{props.description}</span>
				</div>
			</div>
		</div>
		)
}