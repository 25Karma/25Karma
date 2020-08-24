import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { FaSortAlphaDown } from 'react-icons/fa';
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
	if (context.success === false) {
		const config = {
			...context,
			player: context.slug,
		}
		return <FrontPage config={config} />
	}

	else {
		return (
			<PageLayout
				header={<Navbar searchbar />}
				top={context.success && <PlayerHeadline />}
				left={context.success && 
					<React.Fragment>
						<div className="py-1 hidden"><ReactIcon icon={FaSortAlphaDown} /></div>
						<PlayerCard />
					</React.Fragment>
				}
				center={
					context.success ? 
					<DragDropContext onDragEnd={onDragEnd}>
						<div className="h-flex px-2 py-1 justify-content-end">
							<button onClick={alphabetizeAccordions}>
								<ReactIcon icon={FaSortAlphaDown} clickable />
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
					<div className="py-5">
						<LoadingSpinner text={`Loading stats for ${context.slug}`} />
					</div>
				}/>
			);
	}
}
