import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Navbar, Searchbar, Ribbon } from 'components';
import { FrontPage, LoadingPage } from 'pages';
import * as Utils from 'utils';

/*
* Page that displays the stats for an individual player
* The assumption being that it is only called by App.js if player is not null
*
* @param {Object} props.player 	Player data JSON object
*/
export function PlayerPage(props) {

	const { match: { params } } = props;

	const [player, setPlayer] = useState(null);
	const [status, setStatus] = useState(null);
	const [callStatus, setCallStatus] = useState("requested");

	const playerRibbonList = new Utils.PlayerRibbonList(player);

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
			// try {
			// 	const mojangAPI = new Utils.MojangAPI();
			// 	uuid = await mojangAPI.getUUIDofPlayer(username);
			// } catch (e) {
			// 	setCallStatus(Utils.CALL_STATUS_FAILED_MOJANG);
			// 	return;
			// }
			let playerdata = null;
			let statusdata = null;
			try {
				const hypixelAPI = new Utils.HypixelAPI(process.env.REACT_APP_HYPIXEL_API_KEY);
				// First, check if the username passed was a uuid
				// Regex of a UUID
				const regex = RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
				if (regex.test(username)) {
					playerdata = await hypixelAPI.getPlayerByUUID(username);
				} else {
					playerdata = await hypixelAPI.getPlayerByName(username);
				}
				if (!playerdata) {
					setCallStatus(Utils.CALL_STATUS_RECEIVED_NULL);
					return;
				}
				uuid = playerdata.uuid;
				statusdata = await hypixelAPI.getStatusByUUID(uuid);
			} catch (e) {
				setCallStatus(Utils.CALL_STATUS_FAILED_HYPIXEL);
				return;
			}
			setPlayer(playerdata);
			setStatus(statusdata);
			setCallStatus(Utils.CALL_STATUS_RECEIVED_SUCCESS);
		}
		
		asyncCallAPIs(params.username);
	}, [params]);

	function onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
			return;
		}
		playerRibbonList.onDragEnd(result);
	}

	// JSX for when player data is successfully received
	const playerStatsSection = (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="container my-4">
				<Ribbon.Player player={player} status={status} />
				<Droppable droppableId="playerStatsDroppable">
				{provided => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{playerRibbonList.toJSX()}
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
	let config = null;
	switch(callStatus) {
		// Data has been requested from the Hypixel API but not received
		case Utils.CALL_STATUS_FAILED_HYPIXEL:
			config =  {
				callStatus: Utils.CALL_STATUS_FAILED_HYPIXEL,
				username: params.username,
			};
			return <FrontPage config={config} />

		// If the API call was successful but it returned null player data
		case Utils.CALL_STATUS_RECEIVED_NULL:
			config =  {
				callStatus: Utils.CALL_STATUS_RECEIVED_NULL,
				username: params.username,
			};
			return <FrontPage config={config} />
		
		case Utils.CALL_STATUS_RECEIVED_SUCCESS:
			// Log the player into recentSearches cookie
			const recentSearchesList = new Utils.RecentSearchesList();
			recentSearchesList.add(player.displayname);
			return (
				<div>
					<Navbar><Searchbar /></Navbar>
					{playerStatsSection}
				</div>
				);

		default:
			return <LoadingPage player={params.username} />
	}
}
