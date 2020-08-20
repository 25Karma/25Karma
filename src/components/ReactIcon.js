import React, { useState, useEffect } from 'react';
import './ReactIcon.css';
import { IconContext } from 'react-icons';

/*
* Icons from the react-icons module
*
* @param {string} props.icon 		The name of the icon - ex. "MdSettings"
* @param {string} props.size 		Size of the icon - default md
* @param {string} props.color 		Color of the icon - default white
* @param {boolean} props.clickable 	If true, the icon will pop out on hover
*/
export function ReactIcon(props) {
	const { icon, size, color, clickable } = props;
	const className = `reacticon-${size || 'md'} ${clickable && 'reacticon-clickable'} c-${color || 'white'}`;
	const dir = icon.substring(0,2).toLowerCase();
	const [iconComponent, setIconComponent] = useState(null);

	useEffect(() => {
		let reactIcons = null;
		switch(dir) {
			case 'fa': reactIcons = import('react-icons/fa'); break;
			case 'go': reactIcons = import('react-icons/go'); break;
			case 'md': reactIcons = import('react-icons/md'); break;
			case 'ri': reactIcons = import('react-icons/ri'); break;
			default: break;
		}
		reactIcons
			.then((response) => {setIconComponent(response[icon])});
	},[dir, icon]);

	return (
		<IconContext.Provider value={{ className: className }}>
			{iconComponent}
		</IconContext.Provider>
		);
}