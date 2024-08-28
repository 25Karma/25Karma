import React from 'react';
import './ProgressBar.css';
import { Tippy } from 'src/components';

/**
 * A progress bar, accurate to 0.1%
 *
 * @param {string} props.height     Height of the progress bar - default 1rem
 * @param {JSX} props.children      List of Progress components
 * @param {string} props.dataTip    Text to show on hover
 */
export function ProgressBar(props) {

	return (
		<div className="progressbar" style={{ height : props.height || '1rem'}}>
			{props.children}
			<Tippy content={props.dataTip} followCursor="horizontal">
				<span className="progressbar-remaining"></span>
			</Tippy>
		</div>
		);
}