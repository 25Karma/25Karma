import React from 'react';

/*
* Minecraft face API from https://crafatar.com/
*
* @param {string} props.uuid The UUID of the player
* @param {string} props.type The type of render (either 'face' or 'head') - default 'face'
* @param {bool} props.shadow Add a drop shadow to the 'face' type
*/
export function Crafatar(props) {
	if (props.type === 'head') {
		return <img 
			src={`https://crafatar.com/renders/head/${props.uuid}?overlay`} 
			alt="Player head"
			style={{height:'2.5rem'}}/>
	}
	return <img 
		src={`https://crafatar.com/avatars/${props.uuid}?overlay`} 
		alt="Player face"
		style={{
			height:'2.5rem',
			boxShadow: props.shadow ? '0 0.25rem 0.25rem black' : 'none'
		}}/>
}