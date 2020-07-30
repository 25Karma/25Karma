import React, { useState, useEffect } from 'react';
import { IconContext } from 'react-icons';
import { MdError, MdThumbUp } from 'react-icons/md';
import './Banner.css';

export function Banner(props) {

	const [visibility, setVisibility] = useState(false);
	const [classType, symbolType] = getType();

	function getType() {
		if (props.type === "error") {
			return ["banner-error", <MdError />];
		}
		else if (props.type === "success") {
			return ["banner-success", <MdThumbUp />];
		}
	}

	function getVisibility() {
		return visibility ? 'banner-vis' : 'banner-invis';
	}

	useEffect(() => {
		setVisibility(true);
	},[]);

	return (
		<div className={`py-1 px-3 rounded ${getVisibility()} ${classType}`}>
			<IconContext.Provider value={{ className: 'react-icons' }}>
				<span className="font-md pr-1">
					{symbolType}
				</span>
			</IconContext.Provider>
			<span className="font-bold">{props.title}</span>
			<span>{props.description}</span>
		</div>
		)
}