import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { LoadingSpinner, Navbar, Player, ReactIcon } from 'components';
import { FrontPage } from 'pages';
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

	const playerAccordionList = new Utils.PlayerAccordionList(player.player);

	function onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
			return;
		}
		playerAccordionList.onDragEnd(result);
	}

	function alphabetizeAccordions() {
		playerAccordionList.alphabetizeArray();
		forceUpdate();
	}

	// JSX for when player data is successfully received
	function renderPlayerStatsSection() {
		// Log the player into recentSearches cookie
		const recentSearchesList = new Utils.RecentSearchesList();
		recentSearchesList.add(mojangPlayerData.username);

		return (
		<div className="container my-4">
			<Player player={player.player} status={status.session} />
			<div className="h-flex px-2 py-1">
				<button className="ml-auto" onClick={alphabetizeAccordions}>
					<ReactIcon icon="FaSortAlphaDown" />
				</button>
			</div>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="playerStatsDroppable">
					{provided => (
						<div {...provided.droppableProps} ref={provided.innerRef}>
							{playerAccordionList.toJSX()}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
		);
	}

	/*
	* Loads different JSX depending on the states
	*/
	if (mojangPlayerData.success === false) {
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
		return (
			<div>
				<Navbar searchbar />
				<div className="container v-flex my-4">
				{
					mojangPlayerData.success === true && player.success === true ? 
					renderPlayerStatsSection() :
					<div className="mx-auto">
						<LoadingSpinner text={`Loading stats for ${params.player}`} />
					</div>
				}
				</div>
			</div>
			);
	}
}
