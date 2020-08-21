import React from 'react';
import { MinecraftText } from 'components';
import * as Utils from 'utils';

/*
* Hypixel guild tag in Minecraft font
*
* @param {string} props.guild 	Guild JSON from the Hypixel API
* @param {string} props.size 	Font size
*/
export function GuildTag(props) {
	const { guild, size } = props;
	const tag = [...guild.tag].map(char => char+'\uFE0E').join('');

	return (
		<MinecraftText size={size} className="pr-2">
			{`${Utils.toColorCode(guild.tagColor)}[${tag}]`}
		</MinecraftText>
		);
}