import React from 'react';
import ReactLoading from 'react-loading';

/*
* Loading spinner with text underneath
*
* @param {string} props.text 	The text to display underneath the spinner
*/
export function LoadingSpinner(props) {
	return (
		<div className="v-flex align-items-center">
			<div className="mb-2">
				<ReactLoading type="spin" height="5rem" width="5rem"/>
			</div>
			<p className="font-md">{props.text}...</p>
		</div>
		);
}