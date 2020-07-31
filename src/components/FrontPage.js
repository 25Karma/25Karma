import React from 'react';
import { Button, MinecraftText, Navbar, Searchbar } from '../components';
import * as Utils from '../utils';
import properties from '../properties.js';

export function FrontPage(props) {

	function renderRecentSearches() {
		const recentSearches = new Utils.RecentSearches();
		const array = recentSearches.toArray();
		if (array === undefined || array.length === 0) {
			return;
		}
		return (
			<React.Fragment>
				<p className="w-100 pb-2 pl-2 h-flex align-items-center">
					<MinecraftText>
						Recent searches
					</MinecraftText>
					{array.map((a) => (
						<div className="pl-2">
							<Button key={a} onClick={()=>{Utils.searchForPlayer(a)}}>
								<small className="c-gray">{a}</small>
							</Button>
						</div>
					))}
				</p>
			</React.Fragment>
			);
	}
	
	return (
		<div>
			<Navbar></Navbar>
			<div className="container v-flex align-items-center my-4">
				<p className="pb-4 text-shadow">
					<MinecraftText font="xl">
						{"§d"+properties.appName}
					</MinecraftText>
					
				</p>
				<p className="w-100 pb-2 pl-2">
					<MinecraftText font="md">
						Search for the stats of a Hypixel player
					</MinecraftText>
				</p>
				<div className="w-100 pb-2">
					<Searchbar />
				</div>
				{renderRecentSearches()}
				{props.banner ? props.banner : null}
				<p className="w-50 pt-4 pb-2 text-center">
					Pro tip: Customize this site by clicking on the gear button 
					in the top-right corner. 
				</p>
			</div>
		</div>
		);
}