import React, { useState, useEffect } from 'react';
import { Banner, Navbar, Searchbar, Stats, FrontPage, LoadingPage } from '../components';
import * as Utils from '../utils';

/*
* Page that displays the stats for an individual player
* The assumption being that it is only called by App.js if player is not null
*
* @param {Object} props.player Player data JSON object
*/
export function PlayerStatsPage(props) {

	const { match: { params } } = props;
	const [playerData, setPlayerData] = useState(null);
	const [callStatus, setCallStatus] = useState("requested");

	// Runs once the page loads
	useEffect(() => {
		/*
		* Retrieves and sets the player data received from the Hypixel API.
		* - Sets page state to 'requested' when waiting for response from API
		* - 'failed' if request to API failed
		* - 'received' if a response was received
		*/
		async function asyncSetPlayerData(player){
			let data = null;
			setCallStatus("requested");
			try {
				const hypixelAPI = new Utils.HypixelAPI(process.env.REACT_APP_HYPIXEL_API_KEY);
				data = await hypixelAPI.getDataOfPlayer(player);
			} catch(e) {
				setCallStatus("failed");
				return;
			}
			setPlayerData(data);
			setCallStatus("received");
		}
		
		asyncSetPlayerData(params.playername);
	}, [params]);

	/*
	* Loads different JSX depending on the page state
	*/
	switch(callStatus) {
		// Data has been requested from the API but not received
		case "failed":
			const banner = (
				<Banner type="error"
					title='API call failed. '
					description='The site failed to fetch from the Hypixel API.'/>
				);
			return <FrontPage banner={banner} />
		// The API responded with data
		case "received":
			// If the API call was successful but it returned null player data
			if (playerData === null) {
				const banner = <Banner type="error"
					title='Player not found. '
					description={`Could not find a player with the name "${params.playername}".`}/>
				return <FrontPage banner={banner} />
			}
			else {
				// Log the player into recentSearches cookie
				const recentSearches = new Utils.RecentSearches();
				recentSearches.add(playerData.displayname);
				return (
					<div>
						<Navbar><Searchbar /></Navbar>
						<div className="container v-flex align-items-center my-4">
							<Stats.Player player={playerData} />
							<Stats.Bedwars player={playerData} />
							<Stats.Duels player={playerData} />
							<Stats.Skywars player={playerData} />
						</div>
					</div>
					);
			}
		default:
			return <LoadingPage player={params.playername} />
	}
}