import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { LoadingSpinner, Navbar, PageLayout, 
	PlayerCard, PlayerHeadline, ReactIcon } from 'components';
import { FrontPage } from 'pages';
import { useForceUpdate, useHypixelContext } from 'hooks';
import * as Utils from 'utils';

/*
* Page that displays the stats for an individual player
* The assumption being that it is only called by App.js if player is not null
*/
export function PlayerPage(props) {
	const context = useHypixelContext();
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

	/*
	* Loads different JSX depending on the states
	*/
	if (context.mojang.success === false) {
		return <FrontPage config={context.mojang} />
	}
	else if (context.player.success === false) {
		// The Hypixel API doesn't actually know the player's username (only his UUID)
		// so we have to get the username from the URI
		const config = {
			player: context.mojang.username,
			...context.player,
		}
		return <FrontPage config={config} />
	}
	else {
		return (
			<PageLayout
				header={<Navbar searchbar />}
				top={context.isFinished && <PlayerHeadline />}
				left={context.isFinished && 
					<React.Fragment>
						<div className="py-1 hidden"><ReactIcon icon="FaSortAlphaDown" /></div>
						<PlayerCard />
					</React.Fragment>
				}
				center={
					context.isFinished ? 
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
					:
					<LoadingSpinner text={`Loading stats for ${context.slug}`} />
				}/>
			);
	}
}
