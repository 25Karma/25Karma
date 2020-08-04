import React from 'react';
import { MinecraftText } from 'components';

/*
* Displays data in minecraft font with a small title
*
* @param {string} props.title Is shown in smaller font at the top of the box
* @param {string} props.children Main text to display, with minecraft color formatting
*/
export function Box(props) {
	return (
		<span className="v-flex align-items-center py-1 px-2">
			<small>{props.title}</small>
			<MinecraftText font="md">
				{`§7${props.children}` /* Text is gray by default */}
			</MinecraftText>
		</span>
		);
}