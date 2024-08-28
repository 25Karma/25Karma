import React from 'react';
import ReactLoading from 'react-loading';

/**
 * Loading spinner with text underneath
 *
 * @param {string} props.text         The text to display underneath the spinner
 * @param {string} props.className    Classes to apply - intended for padding/margin use only
 */
export function LoadingSpinner(props) {
	return (
		<div className={`v-flex align-items-center ${props.className}`}>
			<div className="mb-2">
				<ReactLoading type="spin" height="5rem" width="5rem"/>
			</div>
			<p className="font-md">{props.text}...</p>
		</div>
		);
}