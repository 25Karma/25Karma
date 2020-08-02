import React from 'react';
import ReactLoading from 'react-loading';
import { Navbar } from '../components';

/*
* Page that displays when waiting for API response
*
* @param {string} props.player The username of the player being searched
*/
export function LoadingPage(props) {
	return (
		<div>
			<Navbar></Navbar>
			<div className="container v-flex align-items-center my-4">
				<div className="mb-2">
					<ReactLoading type="spin" height="5rem" width="5rem"/>
				</div>
				<p className="font-md">Loading stats for {props.player}...</p>
			</div>
		</div>
		);
}