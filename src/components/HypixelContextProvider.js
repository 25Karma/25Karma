import React from 'react';
import { hypixelContext } from 'hooks';

/*
* Provider for the Hypixel Context
*
* @param {JSX} props.children 	
*/
export function HypixelContextProvider(props) {

	return <hypixelContext.Provider value={props.value}>{props.children}</hypixelContext.Provider>;
}