import React, { useState, useEffect } from 'react';
import './ReactIcon.css';
import { IconContext } from 'react-icons';

/*
* Icons from the react-icons module
*
* @param {string} props.icon 	The name of the icon - ex. "MdSettings"
* @param {string} props.size 	Size of the icon - default md
*								When size is md, the icon scales up when hovered
*/
export function ReactIcon(props) {
	const dir = props.icon.substring(0,2).toLowerCase();
	const [icon, setIcon] = useState(null);

	useEffect(() => {
		let reactIcons = null;
		switch(dir) {
			case 'fa': reactIcons = import('react-icons/fa'); break;
			case 'go': reactIcons = import('react-icons/go'); break;
			case 'md': reactIcons = import('react-icons/md'); break;
			default: break;
		}
		reactIcons
			.then((response) => {setIcon(response[props.icon])});
	},[dir, props.icon]);

	return (
		<IconContext.Provider value={{ className: `react-icons-${props.size || 'md'}` }}>
			{icon}
		</IconContext.Provider>
		);
}