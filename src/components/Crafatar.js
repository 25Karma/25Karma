import React from 'react';

/*
* Minecraft face API from https://crafatar.com/
*
* @param {string} props.uuid    The UUID of the player
* @param {string} props.size    Height of the face, default 'xl'
* @param {string} props.type    The type of render (either 'face' or 'head') - default 'face'
* @param {bool} props.shadow    Add a drop shadow to the 'face' type
*/
export function Crafatar(props) {
	const heights = {
		lg: '1.75rem',
		xl: '2.5rem',
	}
	if (props.type === 'head') {
		return <img 
			src={`https://crafatar.com/renders/head/${props.uuid}?overlay`} 
			alt="Player head"
			style={{height: heights[props.size || 'xl']}}/>
	}
	return <img 
		className={props.shadow && 'box-shadow'}
		src={`https://crafatar.com/avatars/${props.uuid}?overlay`} 
		alt="Player face"
		style={{ height: heights[props.size || 'xl']}}/>
}