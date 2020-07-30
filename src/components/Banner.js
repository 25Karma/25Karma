import React, { useState, useEffect, useRef } from 'react';
import { IconContext } from 'react-icons';
import { MdReport, MdInfoOutline } from 'react-icons/md';
import './Banner.css';

export function Banner(props) {
	
	const bannerRef = useRef('banner');
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

	function getSymbol() {
		if (props.type === "error") {
			return <MdReport />;
		}
		else if (props.type === "info") {
			return <MdInfoOutline />;
		}
	}

	useEffect(() => {
		styleShown.maxHeight = bannerRef.current.scrollHeight+'px';
		setStyle(styleShown)
		if (props.expire) {
			setTimeout(function () {
				setStyle(styleHidden)
			}, 5000);
			setTimeout(function () {
				props.onExpiry();
			}, 6000);
		}
	},[]);

	return (
		<div 
			ref={bannerRef} 
			className={`banner banner-${props.type}`}
			style={style}>
			<div className="py-1 px-3">
				<IconContext.Provider value={{ className: 'react-icons' }}>
					<span className="font-md pr-1">
						{getSymbol()}
					</span>
				</IconContext.Provider>
				<span className="font-bold">{props.title}</span>
				<span>{props.description}</span>
			</div>
		</div>
		)
}