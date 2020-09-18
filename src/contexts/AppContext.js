import React, { useState } from 'react';

export const AppContext = React.createContext({});

/*
* Provider for the Hypixel Context
*
* @param {JSX} props.children 	
*/
export function AppContextProvider(props) {
	const [APIContext, setAPIContext] = useState({});

	const value = {
		APIContext, setAPIContext,
	}

	return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
}

