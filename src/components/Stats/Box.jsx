import React from 'react';
import { MinecraftText } from 'src/components';
import { toColorCode } from 'src/utils';

/**
 * Displays data in minecraft font with a small title
 *
 * @param {string} props.title       Is shown in smaller font at the top of the box
 * @param {string} props.children    Main text to display, with minecraft color formatting
 * @param {string} props.color       The color of the main text - default gray (title will always be white)
 */
export function Box(props) {
	function renderChildren() {
		if (props.children === undefined) return 0;
		else return props.children;
	}
	function renderColor() {
		if (props.color) return toColorCode(props.color);
		return toColorCode('gray');
	}

	return (
		<h2 className="v-flex align-items-center py-1 px-2">
			<small className="nowrap">{props.title}</small>
			<MinecraftText className="nowrap" font="md" formatNum>
				{`${renderColor()}${renderChildren()}` /* Text is gray by default */}
			</MinecraftText>
		</h2>
		);
}