import React from 'react';
import { IconContext } from 'react-icons';
import { FaSortAlphaDown } from 'react-icons/fa';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Navbar, Searchbar, Player } from 'components';
import { FrontPage, LoadingPage } from 'pages';
import { useForceUpdate, useHypixelAPI, useMojangAPI } from 'hooks';
import * as Utils from 'utils';

/*
* Page that displays the stats for an individual player
* The assumption being that it is only called by App.js if player is not null
*
* @param {Object} props.player 	Player data JSON object
*/
export function PlayerPage(props) {

	const { match: { params } } = props;
	
	const mojangPlayerData = useMojangAPI('player', params.player);
	const player = useHypixelAPI('player', mojangPlayerData.uuid);
	const status = useHypixelAPI('status', mojangPlayerData.uuid);
	const forceUpdate = useForceUpdate();

	const playerRibbonList = new Utils.PlayerRibbonList(player.player);

	function onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
			return;
		}
		playerRibbonList.onDragEnd(result);
	}

	function alphabetizeRibbons() {
		playerRibbonList.alphabetizeArray();
		forceUpdate();
	}

	// JSX for when player data is successfully received
	const playerStatsSection = (
		<div className="container my-4">
			<Player player={player.player} status={status.session} />
			<div className="h-flex px-2 py-1">
				<IconContext.Provider value={{ className: 'react-icons' }}>
					<button className="ml-auto" onClick={alphabetizeRibbons}>
						<FaSortAlphaDown />
					</button>
				</IconContext.Provider>
			</div>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="playerStatsDroppable">
					{provided => (
						<div {...provided.droppableProps} ref={provided.innerRef}>
							{playerRibbonList.toJSX()}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
		);

	/*
	* Loads different JSX depending on the states
	*/
	if (mojangPlayerData.success === true && player.success === true) {
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
	else if (mojangPlayerData.success === false) {
		return <FrontPage config={mojangPlayerData} />
	}
	else if (player.success === false) {
		// The Hypixel API doesn't actually know the player's username (only his UUID)
		// so we have to get the username from the URI
		const config = {
			player: params.player,
			...player,
		}
		return <FrontPage config={config} />
	}
	else {
		return <LoadingPage player={params.player} />
	}
}
