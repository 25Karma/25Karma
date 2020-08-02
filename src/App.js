import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Banner, Footer, FrontPage, LoadingPage, PlayerStatsPage } from './components';
import * as Utils from './utils';

function App() {

	const params = new URL(window.location.href).searchParams;

	const [playerData, setPlayerData] = useState(null);
	const [pageState, setPageState] = useState("idle");
	
	// Runs once the page loads
	useEffect(() => {
		/*
		* Retrieves and sets the player data received from the Hypixel API.
		* - Sets page state to 'requested' when waiting for response from API
		* - 'failed' if request to API failed
		* - 'received' if a response was received
		*/
		async function asyncSetPlayerData(player){
			setPageState("requested");
			let data = null;
			try {
				const hypixelAPI = new Utils.HypixelAPI(process.env.REACT_APP_HYPIXEL_API_KEY);
				data = await hypixelAPI.getDataOfPlayer(player);
			} catch(e) {
				setPageState("failed");
				return;
			}
			setPlayerData(data);
			setPageState("received");
		}
		
		if (params.get('player')) {
			asyncSetPlayerData(params.get('player'));
		}
	},[]);
	
	/* 
	* Main function for rendering the JSX
	*/
	function render() {
		if (params.get('player')) {
			return renderPlayerStats();
		}
		if (params.get('redirect') === "false") {
			return <FrontPage />;
		}
		// Does nothing if passed a falsy argument
		Utils.searchForPlayer(Cookies.get('pinnedPlayer'));
		// Returns frontpage by default if there are no search params and no cookies
		return <FrontPage />;		
	}
	
	/*
	* Loads different JSX depending on the page state
	* Utility function for render() - only called if search params has player
	*/
	function renderPlayerStats() {
		// Data has been requested from the API but not received
		if (pageState === "requested") {
			return <LoadingPage player={params.get('player')} />;
		} 
		// The request to the API failed
		if (pageState === "failed") {
			const banner = (
				<Banner type="error"
					title='API call failed. '
					description='The site failed to fetch from the Hypixel API.'/>
				);
			return <FrontPage banner={banner} />
		}
		// The API responded with data
		if (pageState === "received") {
			// If the API call was successful but it returned null player data
			if (playerData === null) {
				const banner = <Banner type="error"
					title='Player not found. '
					description={`Could not find a player with the name "${params.get('player')}".`}/>
				return <FrontPage banner={banner} />
			}
			else {
				// Log the player into recentSearches cookie
				const recentSearches = new Utils.RecentSearches();
				recentSearches.add(playerData.displayname);
				return <PlayerStatsPage playerData={playerData} />;
			}	
		}
	}

	return (
		<div className="h-100 v-flex">
			<div className="flex-1">
				{render()}
			</div>
			<Footer />
		</div>
		);
}

export default App;
