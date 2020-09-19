import React from 'react';
import { Link } from 'react-router-dom';
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
	if (!guild || !guild.tag) return null;

	const tag = [...guild.tag].map(char => char === '§' ? char : char+'\uFE0E').join('');

	return (
		<Link to={`/guild/${guild.members[0].uuid}`}>
			<MinecraftText size={size}>
				{`${Utils.toColorCode(guild.tagColor || 'gray')}[${tag}]`}
			</MinecraftText>
		</Link>
		);
}