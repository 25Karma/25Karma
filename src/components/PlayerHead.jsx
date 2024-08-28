import React from 'react';

/**
 * Minecraft face API from 
 * 2020-08-03 Initially used https://crafatar.com/
 * 2022-08-24 Switched to https://visage.surgeplay.com/
 *
 * @param {string} props.uuid       The UUID of the player
 * @param {string} props.size       Height of the face, default 'xl'
 * @param {string} props.type       The type of render (either 'face' or 'head') - default 'face'
 * @param {boolean} props.shadow    Add a drop shadow to the 'face' type
 */
export function PlayerHead(props) {
	const heights = {
		lg: '1.75rem',
		xl: '2.5rem',
	}
	if (props.type === 'head') {
		return <img 
			src={`https://visage.surgeplay.com/head/128/${props.uuid}`} 
			alt="Player head"
			style={{height: heights[props.size || 'xl']}}/>
	}
	return <img 
		className={props.shadow && 'box-shadow'}
		src={`https://visage.surgeplay.com/face/128/${props.uuid}`} 
		alt="Player face"
		style={{ height: heights[props.size || 'xl']}}/>
}