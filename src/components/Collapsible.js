import { useRef, useState, useEffect } from 'react';

/*
* Wrapper for components that open and collapse
* Spread {...provided.collapsibleProps} into the component that should collapse/open
* Spread {...provided.collapseButtonProps} into the component/button that should toggle the collapse
*
* @param {function} props.children 	The JSX to render
*/
export function Collapsible(props) {
	const [isCollapsed, setCollapsed] = useState(!props.collapse);
	const [collapsibleHeight, setCollapsibleHeight] = useState(props.collapse?"none":0);
	const collapsibleRef = useRef('collapsible');
	const duration = 500;
	const provided = {
		collapsibleProps : {
			ref : collapsibleRef,
			style: { 
				maxHeight: collapsibleHeight,
				overflow: 'hidden',
				transition: `max-height ${duration}ms`,
				display: props.collapse?'block':'none',
			}
		},
		collapseButtonProps : {
			onClick : toggleCollapsed,
		}
	}
	function toggleCollapsed() {

		// You can't transition smoothly from max-height:0; to max-height:none;
		// To solve this, we employ an intermediate value (the height of the div)
		collapsibleRef.current.style.display = 'block';
		setCollapsibleHeight(collapsibleRef.current.scrollHeight+'px');
	}
	
	// Runs when collapsedHeight is set to its intermediate value by toggleCollapsed()
	useEffect(() => {
		if (collapsibleHeight !== 0 && collapsibleHeight !== 'none') {
			if (isCollapsed) {
				setTimeout(() => {
					setCollapsibleHeight('none');
				}, duration);
			}
			else {
				setTimeout(() => {
					collapsibleRef.current.style.display = 'none';
				}, duration);
				setCollapsibleHeight(0);
			}
			setCollapsed(!isCollapsed);
		}
	},[collapsibleHeight]);

	return props.children(provided);
}