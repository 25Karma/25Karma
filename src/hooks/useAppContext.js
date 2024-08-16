import { useContext } from 'react';
import { AppContext } from 'src/contexts';

export function useAppContext() {
	return useContext(AppContext);
}