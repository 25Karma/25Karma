import React from 'react';
import { MinecraftText } from '../components';

export function Box(props) {
	return (
		<div className="v-flex align-items-center py-1 px-2">
			<small>{props.title}</small>
			<MinecraftText font="md">
				{`§7${props.children}`}
			</MinecraftText>
		</div>
		);
}