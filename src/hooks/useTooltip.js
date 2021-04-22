import { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

// Bind ReactTooltip to the new dynamic content
export function useTooltip() {
	return useEffect(ReactTooltip.rebuild, []);
}