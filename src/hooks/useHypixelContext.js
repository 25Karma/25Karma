import React, { useContext } from 'react';

export const HypixelContext = React.createContext({});

export function useHypixelContext() {
	return useContext(HypixelContext);
}