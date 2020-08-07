import React from 'react';
import './MinecraftText.css';
import { formatNum } from 'utils';

/*
* §§§§§§§§§§§§§§§§§§§§§§§§§§§
* Parses minecraft-formatted text and displays it in a minecraft font
*
* @param {string} props.font Font size
* @param {string} props.className Classes to apply - intended for padding/margin use only
* @param {string} props.children Minecraft color-formatted text to display
*/
export function MinecraftText(props) {

	function parseMinecraftText(str) {
		// Binds each minecraft formatting character to a css color class
		const colorClasses = {
			'0': 'black',
			'1': 'darkblue',
			'2': 'darkgreen',
			'3': 'darkaqua',
			'4': 'darkred',
			'5': 'purple',
			'6': 'gold',
			'7': 'gray',
			'8': 'darkgray',
			'9': 'blue',
			'a': 'green',
			'b': 'aqua',
			'c': 'red',
			'd': 'pink',
			'e': 'yellow',
			'f': 'white',
			'R': 'rainbow',
			'K': 'rainbow font-bold'
		}

		let spans = [];
		let key = 0;
		// By default the color of the text is white
		for (const section of ('§f'+str).split('§')) {
			const colorCode = section[0];
			// Remove the color formatting character from the front of the string
			let text = section.substr(1);

			// Do nothing if text is empty - we don't want empty spans lying around
			if (!text) continue;

			const num = Number(text);
			// If the whole string can be converted to a number, format the number by adding commas
			// We use toLocaleString instead of parseInt (https://stackoverflow.com/a/9429565)
			if (!isNaN(num)) text = formatNum(num);

			const colorClass = colorClasses[colorCode];
			spans.push(<span key={key++} className={`font-minecraft c-${colorClass}`}>
				{text}</span>);
		}
		return (
			<span className={`font-${props.font} ${props.className}`}>
				{spans.map(span => span)}
			</span>
			);
	}

	return parseMinecraftText(props.children);
}