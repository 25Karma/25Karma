import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Banner, Navbar, Searchbar, Stats } from 'components';
import { FrontPage, LoadingPage } from 'pages';
import * as Utils from 'utils';

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
		* Sets page state to 'requested' when waiting for response from API
		* 'failed' if request to API failed
		* 'received' if a response was received
		*/
		async function asyncSetPlayerData(player){
			let data = null;
			setCallStatus(Utils.CALL_STATUS_REQUESTED);
			try {
				const hypixelAPI = new Utils.HypixelAPI(process.env.REACT_APP_HYPIXEL_API_KEY);
				data = await hypixelAPI.getDataOfPlayer(player);
			} catch(e) {
				setCallStatus(Utils.CALL_STATUS_FAILED);
				return;
			}
			setPlayerData(data);
			setCallStatus(Utils.CALL_STATUS_RECEIVED);
		}
		
		asyncSetPlayerData(params.playername);
	}, [params]);

	function onDragEnd(source) {
		console.log(Object.entries(Stats))
	}
	// JSX for when player data is successfully received
	const playerStatsSection = (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="container my-4">
				<Stats.Player player={playerData} />
				<Droppable droppableId="playerStatsDroppable">
				{provided => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						<Stats.Bedwars player={playerData} index={0}/>
						<Stats.Duels player={playerData} index={1}/>
						<Stats.Skywars player={playerData} index={2}/>
						{provided.placeholder}
					</div>
				)}
				</Droppable>
			</div>
		</DragDropContext>
		);

	/*
	* Loads different JSX depending on the page state
	*/
	switch(callStatus) {
		// Data has been requested from the API but not received
		case Utils.CALL_STATUS_FAILED:
			const banner = (
				<Banner type="error"
					title='API call failed. '
					description='The site failed to fetch from the Hypixel API.'/>
				);
			return <FrontPage banner={banner} />
		// The API responded with data
		case Utils.CALL_STATUS_RECEIVED:
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
						{playerStatsSection}
					</div>
					);
			}
		default:
			return <LoadingPage player={params.playername} />
	}
}