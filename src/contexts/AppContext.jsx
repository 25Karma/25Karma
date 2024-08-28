import React, { useState } from 'react';

export const AppContext = React.createContext({});
AppContext.displayName = 'AppContext';

/**
 * Provider for the App context
 *
 * @param {JSX} props.children
 */
export function AppContextProvider(props) {
	const [banner, setBanner] = useState({});

	const value = {
		// banner is an Object { style, title, description, expire }
		banner, setBanner,
	}

	return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
}