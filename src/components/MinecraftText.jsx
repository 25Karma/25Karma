import React from 'react';
import { formatNum } from 'src/utils';

/**
 * §§§§§§§§§§§§§§§§§§§§§§§§§§§
 * Parses minecraft-formatted text and displays it in a minecraft font
 *
 * @param {string} props.size          Font size, default 'md'
 * @param {string} props.className     Classes to apply - intended for padding/margin use only
 * @param {boolean} props.formatNum    Whether we should format the text if it is a number
 * @param {string} props.children      Minecraft color-formatted text to display
 */
export function MinecraftText(props) {

	function parseMinecraftText(str) {
		// Binds each minecraft formatting character to a css color class
		const colorNames = {
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
			'g': 'brown',
			'R': 'rainbow',
			'K': 'rainbow font-bold'
		}

		const modifierNames = {
			'k': 'magic',
			'l': 'bold',
			'm': 'strikethrough',
			'n': 'underline',
			'o': 'italic',
			'r': 'reset',
		}

		let spans = [];
		let charStack = [];
		// By default the color of the text is white
		let styling = {
			color: 'white',
			modifiers: []
		}
		// For each character
		for (let i = 0; i < str.length; i++) {
			if (str[i] === '§') {
				// Save all previous characters under the previous style
				if (charStack.length) {
					spans.push({
						style: `c-${styling.color} ${styling.modifiers.map(m => 'c-'+m).join(' ')}`,
						text: charStack.join('')
					});
				}
				
				// Clear the saved characters
				charStack = [];
				// The character after the § indicates either the color or modifier of the style
				i++;

				// Evoking a color change resets modifiers
				if (colorNames[str[i]]) {
					styling.color = colorNames[str[i]];
					styling.modifiers = [];
				}
				// Evoking a modifier change simply adds the new modifier on top
				else if (modifierNames[str[i]]) {
					styling.modifiers.push(modifierNames[str[i]]);
				}
			}
			else {
				charStack.push(str[i]);
			}
		}

		// Finally, save the remaining characters
		if (charStack.length) {
			spans.push({
				style: `c-${styling.color} ${styling.modifiers.map(m => 'c-'+m).join(' ')}`,
				text: charStack.join('')
			});
		}

		// If the text to display was intended to be a numerical value
		spans.forEach(span => {
			if (props.formatNum && !isNaN(span.text)) span.text = formatNum(Number(span.text));
		})

		return (
			<span className={`font-${props.size || 'md'} ${props.className || ''}`}>
				{spans.map((span, i) => <span key={i} className={`font-minecraft ${span.style}`}>{span.text}</span>)}
			</span>
			);
	}

	return parseMinecraftText(props.children || '');
}