import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { HypixelContextProvider, LoadingSpinner, Navbar, PageLayout, 
	PlayerCard, PlayerHeadline, ReactIcon } from 'components';
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
	const mojang = useMojangAPI(params.player);
	const player = useHypixelAPI(mojang.uuid);
	const status = useHypixelAPI(mojang.uuid, 'status');
	const forceUpdate = useForceUpdate();

	const playerAccordionList = new Utils.PlayerAccordionList();

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
		recentSearchesList.add(mojang.username);

		return (
				<DragDropContext onDragEnd={onDragEnd}>
					<div className="h-flex px-2 py-1 justify-content-end">
						<button onClick={alphabetizeAccordions}>
							<ReactIcon icon="FaSortAlphaDown" clickable />
						</button>
					</div>
					<Droppable droppableId="playerStatsDroppable">
						{provided => (
							<div {...provided.droppableProps} ref={provided.innerRef}>
								{playerAccordionList.toJSX()}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
		);
	}

	/*
	* Loads different JSX depending on the states
	*/
	if (mojang.success === false) {
		return <FrontPage config={mojang} />
	}
	else if (player.success === false) {
		// The Hypixel API doesn't actually know the player's username (only his UUID)
		// so we have to get the username from the URI
		const config = {
			player: mojang.username,
			...player,
		}
		return <FrontPage config={config} />
	}
	else {
		return (
			<HypixelContextProvider value={{mojang, player, status}}>
				<PageLayout
					header={<Navbar searchbar />}
					top={player.success && <PlayerHeadline />}
					left={player.success && <PlayerCard />}
					center={
						player.success ? 
						renderPlayerStatsSection() :
						<LoadingSpinner text={`Loading stats for ${params.player}`} />
					}/>
			</HypixelContextProvider>
			);
	}
}
