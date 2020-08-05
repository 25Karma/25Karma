import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Banner, Navbar, Searchbar, Ribbon } from 'components';
import { FrontPage, LoadingPage } from 'pages';
import * as Utils from 'utils';

/*
* Page that displays the stats for an individual player
* The assumption being that it is only called by App.js if player is not null
*
* @param {Object} props.player Player data JSON object
*/
export function PlayerPage(props) {

	const { match: { params } } = props;
	const [player, setPlayer] = useState(null);
	const [status, setStatus] = useState(null);
	const [callStatus, setCallStatus] = useState("requested");

	// Runs once the page loads
	useEffect(() => {
		/*
		* Retrieves and sets the player data received from the Hypixel API.
		* Sets page state to 'requested' when waiting for response from API
		* 'failed' if request to API failed
		* 'received' if a response was received
		*/
		async function asyncCallAPIs(username){
			setCallStatus(Utils.CALL_STATUS_REQUESTED);
			let uuid = null;
			try {
				const mojangAPI = new Utils.MojangAPI();
				uuid = await mojangAPI.getUUIDofPlayer(username);
			} catch (e) {
				setCallStatus(Utils.CALL_STATUS_FAILED_MOJANG);
				return;
			}
			let playerdata = null;
			let statusdata = null;
			try {
				const hypixelAPI = new Utils.HypixelAPI(process.env.REACT_APP_HYPIXEL_API_KEY);
				playerdata = await hypixelAPI.getPlayerByUUID(uuid);
				statusdata = await hypixelAPI.getStatusByUUID(uuid);
			} catch (e) {
				setCallStatus(Utils.CALL_STATUS_FAILED_HYPIXEL);
				return;
			}
			setPlayer(playerdata);
			setStatus(statusdata);
			setCallStatus(Utils.CALL_STATUS_RECEIVED);
		}
		
		asyncCallAPIs(params.username);
	}, [params]);

	function onDragEnd(source) {
		console.log(Object.entries(Ribbon))
	}
	// JSX for when player data is successfully received
	const playerStatsSection = (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="container my-4">
				<Ribbon.Player player={player} status={status} />
				<Droppable droppableId="playerStatsDroppable">
				{provided => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						<Ribbon.Bedwars player={player} index={0}/>
						<Ribbon.Duels player={player} index={1}/>
						<Ribbon.Skywars player={player} index={2}/>
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
		case Utils.CALL_STATUS_FAILED_HYPIXEL:
			const banner = (
				<Banner type="error"
					title='API call failed. '
					description='The site failed to fetch from the Hypixel API.'/>
				);
			return <FrontPage banner={banner} />
		// The API responded with data
		case Utils.CALL_STATUS_RECEIVED:
			// If the API call was successful but it returned null player data
			if (player === null) {
				const banner = <Banner type="error"
					title='Player not found. '
					description={`Could not find a player with the name "${params.username}".`}/>
				return <FrontPage banner={banner} />
			}
			else {
				// Log the player into recentSearches cookie
				const recentSearchesList = new Utils.RecentSearchesList();
				recentSearchesList.add(player.displayname);
				return (
					<div>
						<Navbar><Searchbar /></Navbar>
						{playerStatsSection}
					</div>
					);
			}
		default:
			return <LoadingPage player={params.username} />
	}
}