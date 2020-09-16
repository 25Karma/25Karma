import React, { useState } from 'react';

export const SiteContext = React.createContext({});

/*
* Provider for the Hypixel Context
*
* @param {JSX} props.children 	
*/
export function SiteContextProvider(props) {
	const [APIContext, setAPIContext] = useState({});

	const value = {
		APIContext, setAPIContext,
	}

	return <SiteContext.Provider value={value}>{props.children}</SiteContext.Provider>;
}

