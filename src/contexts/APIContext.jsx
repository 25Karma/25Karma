import React, { useState } from 'react';

export const APIContext = React.createContext({});
APIContext.displayName = 'APIContext';

/**
 * Provider for the Hypixel Context
 *
 * @param {JSX} props.children
 */
export function APIContextProvider(props) {
	const [APIData, setAPIData] = useState({});

	const value = { APIData, setAPIData }

	return <APIContext.Provider value={value}>{props.children}</APIContext.Provider>;
}