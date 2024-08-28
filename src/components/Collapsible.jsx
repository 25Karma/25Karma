import { useRef, useState, useEffect } from 'react';

/**
 * Wrapper for components that open and collapse
 * Spread {...provided.collapsibleProps} into the component that should collapse/open
 * Spread {...provided.collapseButtonProps} into the component/button that should toggle the collapse
 *
 * @param {Function} props.children    The JSX to render
 */
export function Collapsible(props) {
	const [isCollapsed, setCollapsed] = useState(true);
	const [collapsibleHeight, setCollapsibleHeight] = useState(0);
	const [duration, setDuration] = useState(0);
	const collapsibleRef = useRef('collapsible');

	const provided = {
		collapsibleProps : {
			ref : collapsibleRef,
			style: { 
				maxHeight: collapsibleHeight,
				overflow: 'hidden',
				transition: `max-height ${duration}ms`,
				display: 'none',
			}
		},
		collapseButtonProps : {
			onClick : toggleCollapsed,
		},
		isCollapsed: isCollapsed,
	}

	function toggleCollapsed() {
		const minimumDuration = 200; // milliseconds
		const speed = 4; // pixels per millisecond
		// You can't transition smoothly from max-height:0; to max-height:none;
		// To solve this, we employ an intermediate value (the height of the div)
		collapsibleRef.current.style.display = 'block';
		setCollapsibleHeight(collapsibleRef.current.scrollHeight+'px');
		setDuration(collapsibleRef.current.scrollHeight/speed + minimumDuration);
	}
	
	// Runs when collapsedHeight is set to its intermediate value by toggleCollapsed()
	useEffect(() => {
		if (collapsibleHeight !== 0 && collapsibleHeight !== 'none') {
			// Opening the collapsible
			if (isCollapsed) {
				setTimeout(() => {
					setCollapsibleHeight('none');
				}, duration);
			}
			// Closing the collapsible
			else {
				setTimeout(() => {
					collapsibleRef.current.style.display = 'none';
				}, duration);
				setCollapsibleHeight(0);
			}
			setCollapsed(!isCollapsed);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[collapsibleHeight]);

	return props.children(provided);
}