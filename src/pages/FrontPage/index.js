import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Banner, Button, MinecraftText, Navbar, 
	PageLayout, Tips, ReactIcon, Searchbar } from 'components';
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
					<MinecraftText size="sm">Recent searches</MinecraftText>
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
								<ReactIcon icon="MdMoreHoriz" clickable />
							</button>
					}
				</div>
			</React.Fragment>
			);
	}
	
	return (
		<PageLayout
			header={<Navbar />}
			top={
				<span className="text-shadow">
					<MinecraftText size="xl">
						{"§d"+properties.appName}
					</MinecraftText>
				</span>
			}
			center={
				<React.Fragment>
					<p className="py-1 pl-2">
						<MinecraftText size="md">
							Search for the stats of a Hypixel player
						</MinecraftText>
					</p>
					<div className="py-1">
						<Searchbar defaultValue={config.player || ''}/>
					</div>
					<div className="pl-2 h-flex align-items-start">
						{renderRecentSearches()}
					</div>
					<div className="mx-auto">
						{banner}
					</div>
					<div className="pt-5 pb-2">
						<Tips />
					</div>
				</React.Fragment>
			}/>
		);
}