import React from 'react';
import { Navbar, Searchbar } from '../components';
import properties from '../properties.js';

export function FrontPage(props) {
	
	return (
		<div>
			<Navbar></Navbar>
			<div className="container v-flex align-items-center my-4">
				<p className="pb-4 font-xl font-minecraft c-pink text-shadow">
					{properties.appName}
				</p>
				<p className="w-100 font-md font-minecraft pb-2 pl-2">
					Search for the stats of a Hypixel player
				</p>
				<div className="w-100 pb-3">
					<div className="pb-2">
						<Searchbar />
					</div>
					{props.banner ? props.banner : null}
				</div>
				<p className="w-50 pb-2 text-center">
					Pro tip: Customize this site by clicking on the settings button 
					in the top-right corner. 
				</p>
			</div>
		</div>
		);
}