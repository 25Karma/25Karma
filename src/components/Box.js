import React from 'react';
import { MinecraftText } from 'components';
import { formatNum } from 'utils';

/*
* Displays data in minecraft font with a small title
*
* @param {string} props.title 		Is shown in smaller font at the top of the box
* @param {string} props.children 	Main text to display, with minecraft color formatting
*/
export function Box(props) {
	function renderChildren() {
		if (props.children === undefined) return 0;
		else if (isNaN(props.children)) return props.children;
		else return formatNum(props.children);
	}

	return (
		<span className="v-flex align-items-center py-1 px-2">
			<small>{props.title}</small>
			<MinecraftText className="nowrap" font="md">
				{`§7${renderChildren()}` /* Text is gray by default */}
			</MinecraftText>
		</span>
		);
}