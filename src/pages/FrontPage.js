import React from 'react';
import { Link } from 'react-router-dom';
import { Banner, Button, MinecraftText, Navbar, Searchbar } from 'components';
import * as Utils from 'utils';
import properties from 'properties.js';

/*
* The frontpage of the site
*
* @param {JSX} props.config The frontpage will load banners and other components differently 
*	depending on the config. The config must contain a key callStatus. If callStatus is
*	Utils.CALL_STATUS_RECEIVED_NULL, the config must be accompanied with a key username,
*	which is the username of the player that does not exist.
*/
export function FrontPage(props) {

	const config = props.config || {};

	// Set the banner according to the config
	let banner = null;
	if (config.callStatus === Utils.CALL_STATUS_FAILED_HYPIXEL) {
		banner = (
			<Banner type="error"
				title='API call failed. '
				description='The site failed to fetch from the Hypixel API.'/>
			);
	}
	else if (config.callStatus === Utils.CALL_STATUS_RECEIVED_NULL) {
		banner = (
			<Banner type="error"
				title='Player not found. '
				description={`Could not find a player with the name "${config.username}".`}/>
			);
	}

	/*
	* Renders JSX containing recent searches if there are any
	* If there are none, renders a suggestion
	*
	* @return {JSX} A div containing buttons to search for recent players
	*/
	function renderRecentSearches() {
		const recentSearchesList = new Utils.RecentSearchesList();
		const array = recentSearchesList.toArray();
		// If the cookie is empty or doesn't exist, render a suggestion
		if (array === undefined || array.length === 0) {
			const suggestedPlayer = "gamerboy80"
			return (
				<React.Fragment>
					<MinecraftText>First time? Try searching</MinecraftText>
					<div className="pl-1">
						<Link to={`/player/${suggestedPlayer}`}>
							<Button>
									<small className="c-gray">{suggestedPlayer}</small>
							</Button>
						</Link>
					</div>
				</React.Fragment>
			);
		}
		return (
			<React.Fragment>
				<MinecraftText>
					Recent searches
				</MinecraftText>
				{array.map((a) => (
					<div key={a} className="pl-2">
						<Link to={`/player/${a}`}>
							<Button>
									<small className="c-gray">{a}</small>
							</Button>
						</Link>
					</div>
				))}
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
					<Searchbar defaultValue={config.username || ''}/>
				</div>
				<div className="w-100 pb-2 pl-2 h-flex align-items-center">
					{renderRecentSearches()}
				</div>
				{banner}
				<p className="w-50 pt-4 pb-2 text-center">
					Pro tip: Customize this site by clicking on the gear button 
					in the top-right corner. 
				</p>
			</div>
		</div>
		);
}