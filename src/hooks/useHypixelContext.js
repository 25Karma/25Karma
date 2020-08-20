import React, { useContext } from 'react';

export const hypixelContext = React.createContext({});

export function useHypixelContext() {
	return useContext(hypixelContext);
}