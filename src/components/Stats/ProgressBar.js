import React from 'react';
import './ProgressBar.css';
import ReactTooltip from 'react-tooltip';

/*
* A progress bar, accurate to 0.1%
*
* @param {string} props.height     Height of the progress bar - default 1rem
* @param {JSX} props.children      List of Progress components
* @param {string} props.dataTip    Text to show on hover (react-tooltip)
*/
export function ProgressBar(props) {

	return (
		<div className="progressbar" style={{ height : props.height || '1rem'}}>
			{props.children}
			<span className="progressbar-remaining" data-tip={props.dataTip}></span>
			<ReactTooltip />
		</div>
		);
}