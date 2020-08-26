import { useContext } from 'react';
import { HypixelContext } from 'contexts';

export function useHypixelContext() {
	return useContext(HypixelContext);
}