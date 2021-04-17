import { useContext } from 'react';
import { AppContext } from 'contexts';

export function useAppContext() {
	return useContext(AppContext);
}