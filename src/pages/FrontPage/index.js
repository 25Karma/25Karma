import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Banner, Button, MinecraftText, Navbar, ReactIcon, Searchbar } from 'components';
import * as Utils from 'utils';
import properties from 'properties.js';

/*
* The frontpage of the site
*
* @param {JSX} props.config 	The frontpage will load banners and other components differently 
*								depending on the config. The config must contain a reason 
*								for the error. Other optional properties will be provided in the
*								config depending on the reason.
*/
export function FrontPage(props) {

	const config = props.config || {};

	// Stores how many recent searches to show
	const [showAllRecents, setShowAllRecents] = useState(false);

	// Set the banner according to the config
	let banner = null;
	switch (config.reason) {
		case ('MOJANG_CALL_FAILED'):
		case ('MOJANG_PLAYER_DNE'):
			banner = (
				<Banner type="error"
					title='Player not found. '
					description={`A player with the name "${config.player}" does not exist.`}/>
				);
			break;
		case ('HYPIXEL_PLAYER_DNE'):
			banner = (
				<Banner type="error"
					title='Player not found. '
					description={`The player "${config.player}" has never played on Hypixel.`}/>
				);
			break;
		case ('HYPIXEL_ACCESS_DENIED'):
			banner = (
				<Banner type="error"
					title='Access denied. '
					description={`The call to the Hypixel API was denied due to '${config.cause}'.`}/>
				);
			break;
		case ('HYPIXEL_API_DOWN'):
			banner = (
				<Banner type="error"
					title='Hypixel API Error. '
					description={`The Hypixel API is not responding. Is it down?`}/>
				);
			break;
		default: break;
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
					<div className="pt-2">
						<MinecraftText>First time? Try searching</MinecraftText>
					</div>
					<div className="pl-2 py-1">
						<Link to={`/player/${suggestedPlayer}`}>
							<Button>
									<span className="font-xs">{suggestedPlayer}</span>
							</Button>
						</Link>
					</div>
				</React.Fragment>
			);
		}
		return (
			<React.Fragment>
				<div className="pt-2 nowrap">
					<MinecraftText>Recent searches</MinecraftText>
				</div>
				<div className="h-flex flex-wrap">
					{array.slice(0, showAllRecents ? array.length : 5).map((a) => (
						<div key={a} className="pl-2 py-1">
							<Link to={`/player/${a}`}>
								<Button>
									<span className="font-xs">{a}</span>
								</Button>
							</Link>
						</div>
					))}
					{array.length > 5 && !showAllRecents &&
							<button className="pl-2" onClick={()=>{setShowAllRecents(true)}}>
								<ReactIcon icon="MdMoreHoriz" />
							</button>
					}
				</div>
			</React.Fragment>
			);
	}
	
	return (
		<div>
			<Navbar />
			<div className="container v-flex align-items-center my-4">
				<p className="pb-4 text-shadow">
					<MinecraftText font="xl">
						{"§d"+properties.appName}
					</MinecraftText>
					
				</p>
				<p className="w-100 py-1 pl-2">
					<MinecraftText font="md">
						Search for the stats of a Hypixel player
					</MinecraftText>
				</p>
				<div className="w-100 py-1">
					<Searchbar defaultValue={config.player || ''}/>
				</div>
				<div className="w-100 pb-2 pl-2 h-flex align-items-start">
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