import React from 'react';
import { MinecraftText } from 'components';
import { formatNum, toColorCode } from 'utils';

/*
* Displays data in minecraft font with a small title
*
* @param {string} props.title 		Is shown in smaller font at the top of the box
* @param {string} props.children 	Main text to display, with minecraft color formatting
* @param {string} props.color 		The color of the main text - default gray (title will always be white)
*/
export function Box(props) {
	function renderChildren() {
		if (props.children === undefined) return 0;
		else if (isNaN(props.children)) return props.children;
		else return formatNum(props.children);
	}
	function renderColor() {
		if (props.color) return toColorCode(props.color);
		return toColorCode('gray');
	}

	return (
		<span className="v-flex align-items-center py-1 px-2">
			<small>{props.title}</small>
			<MinecraftText className="nowrap" font="md">
				{`§${renderColor()}${renderChildren()}` /* Text is gray by default */}
			</MinecraftText>
		</span>
		);
}