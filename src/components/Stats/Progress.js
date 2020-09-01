import React from 'react';

/*
* Component that fills a ProgressBar
*
* @param {string} props.proportion 	Proportion of the ProgressBar - value from 0 to 1
* @param {string} props.color 		Color of the component
* @param {string} props.children 	Text on the component
* @param {string} props.dataTip 	Text to show on hover (react-tooltip)
*/
export function Progress(props) {
	const lightBackgrounds = ['white', 'yellow', 'green', 'gray'];
	const textColor = lightBackgrounds.includes(props.color) ? 'black' : 'white';
	return (
		<span
			className={`h-100 font-xs overflow-hidden h-flex align-items-center justify-content-center c-${textColor} bg-${props.color}`}
			style={{width : `${100 * props.proportion}%`}}
			data-tip={props.dataTip}>
			{props.children}
		</span>
		);
}