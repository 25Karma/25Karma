import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { IconContext } from 'react-icons';
import { MdDragHandle } from 'react-icons/md';
import './Ribbon.css';
import { Collapsible, MinecraftText } from 'components';

/*
* Base container for all player stats components
*
* @param {string} props.title The title of the stats row
* @param {JSX} props.header JSX objects to place beside the title
* @param {JSX} props.children The contents of the collapsible area
*/
export function Ribbon(props) {
	return (
		<Draggable key={props.title} draggableId={props.title} index={props.index}>
		{dProvided => (
			<Collapsible>
			{cProvided => (
				<div 
					className="my-2 rounded overflow-hidden"
					ref={dProvided.innerRef}
					{...dProvided.draggableProps}>
					<div className="stats-header px-2"> 
						<div 
							className="h-flex align-items-center flex-1 cursor-pointer overflow-hidden" 
							{...cProvided.collapseButtonProps}>
							<MinecraftText font="md">{props.title}</MinecraftText>
							<div className="h-flex mx-auto px-3">
								{props.header}
							</div>
						</div>
						<button className="ml-2" {...dProvided.dragHandleProps}>
							<IconContext.Provider value={{ className: 'react-icons' }}>
									<MdDragHandle />
							</IconContext.Provider>
						</button>
					</div>
					<div {...cProvided.collapsibleProps}>
						<div className="stats-body">
							<div className="stats-separator mb-3"></div>
							{props.children}
						</div>
					</div>
				</div>
				)}
			</Collapsible>
			)}
		</Draggable>
		);
}