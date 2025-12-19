import React from 'react';
import { Tippy } from 'src/components';

/**
 * Component that fills a ProgressBar
 *
 * @param {string} props.proportion    Proportion of the ProgressBar - value from 0 to 1
 * @param {string} props.color         Color of the component (used if no gradient)
 * @param {Array}  props.gradient      Array of CSS color names for gradient (optional)
 * @param {string} props.children      Text on the component
 * @param {string} props.dataTip       Text to show on hover
 */
export function Progress(props) {
	const lightBackgrounds = [
		'white', 'yellow', 'green', 'gray', 'aqua', 'gold',
		'WHITE', 'YELLOW', 'GREEN', 'GRAY', 'AQUA', 'GOLD'
	];
	const textColor = lightBackgrounds.includes(props.color) ? 'black' : 'white';
	const style = { width: `${100 * props.proportion}%` };

	// if gradient is provided, use it instead of bg- class
	let className = `h-100 font-xs overflow-hidden h-flex align-items-center justify-content-center c-${textColor}`;
	if (props.gradient && props.gradient.length > 1) {
		const colorMap = {
			'darkred': '#a00', 'red': '#f55', 'gold': '#fa0', 'yellow': '#ff5',
			'darkgreen': '#0a0', 'green': '#5f5', 'aqua': '#5ff', 'darkaqua': '#0aa',
			'darkblue': '#00a', 'blue': '#55f', 'pink': '#f5f', 'purple': '#a0a',
			'white': '#fff', 'gray': '#aaa', 'darkgray': '#555', 'black': '#000',
		};
		const colors = props.gradient.map(c => colorMap[c] || c);
		style.background = `linear-gradient(to right, ${colors.join(', ')})`;
	} else {
		className += ` bg-${props.color}`;
	}

	return (
		<Tippy content={props.dataTip} followCursor="horizontal">
			<span className={className} style={style}>
					{props.children}
				</span>
		</Tippy>
		);
}