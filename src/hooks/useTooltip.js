import { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

// Bind ReactTooltip to the new dynamic content
export function useTooltip(dependencyArray = []) {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useEffect(() => ReactTooltip.rebuild(), dependencyArray);
}