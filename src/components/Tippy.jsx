import React from 'react';
import ReactTippy from '@tippyjs/react';
import { followCursor } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import './Tippy.css';

/**
 * Displays a tooltip when hovering over the wrapped component.
 *
 * @param {string} props.content          The text to display in the tooltip.
 * @param {boolean} props.followCursor    The direction in which the tooltip should follow the tooltip. Default false.
 * @param {string} props.placement        The preferred placement of the tooltip. Default top.
 * @param {JSX} props.children            The component to apply to tooltip on.
 */
export function Tippy(props) {
	if (props.content === undefined) {
		return props.children;
	} else {
		return (
			<ReactTippy 
			className="tippy"
			content={props.content} 
			placement={props.placement || 'top'} 
			followCursor={props.followCursor || false}
			plugins={[followCursor]}
			duration={200}>
				{props.children}
			</ReactTippy>
			);
	}
}