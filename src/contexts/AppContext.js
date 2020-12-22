import React, { useState } from 'react';

export const AppContext = React.createContext({});
AppContext.displayName = 'AppContext';

/*
* Provider for the App context
*
* @param {JSX} props.children 	
*/
export function AppContextProvider(props) {
	const [banner, setBanner] = useState({});

	const value = {
		banner, setBanner,
	}

	return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
}