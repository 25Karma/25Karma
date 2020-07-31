import React from 'react';
import './MinecraftText.css';
import * as Utils from '../utils';

export function MinecraftText(props) {

	function parseMinecraftText(str) {
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
		for (const section of ('§f'+str).split('§')) {
			const colorCode = section[0];
			let text = section.substr(1);
			if (!text) continue;
			const num = Number(text);
			if (!isNaN(num)) text = Utils.formatNum(num);
			const colorClass = colorClasses[colorCode];
			spans.push(<span key={key++} className={`font-minecraft c-${colorClass}`}>
				{text}</span>);
		}
		return (
			<span className={`h-flex nowrap font-${props.font}`}>
				{spans.map(span => span)}
			</span>
			);
	}

	return parseMinecraftText(props.children);
}