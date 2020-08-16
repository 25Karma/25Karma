import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './Accordion.css';
import { Collapsible, MinecraftText, ReactIcon } from 'components';

/*
* Draggable container with a collapsable portion underneath
*
* @param {string} props.title 	The title of the stats row
* @param {JSX} props.header 	JSX objects to place beside the title
* @param {JSX} props.children 	The contents of the collapsible area
*/
export function Accordion(props) {
	return (
		<Draggable key={props.title} draggableId={props.title} index={props.index}>
		{dProvided => (
			<Collapsible>
			{cProvided => (
				<div 
					className="py-1"
					ref={dProvided.innerRef}
					{...dProvided.draggableProps}>
					<div className="accordion">
						<div className="accordion-header px-2"> 
							<div 
								className="h-flex align-items-center flex-1 cursor-pointer overflow-hidden" 
								{...cProvided.collapseButtonProps}>
								<MinecraftText font="md">{props.title}</MinecraftText>
								<div className="h-flex mx-auto px-3">
									{props.header}
								</div>
							</div>
							<button className="ml-2" {...dProvided.dragHandleProps}>
								<ReactIcon icon="MdDragHandle" />
							</button>
						</div>
						<div {...cProvided.collapsibleProps}>
							<div className="accordion-body">
								<div className="accordion-separator mb-3"></div>
								{props.children}
							</div>
						</div>
					</div>
				</div>
				)}
			</Collapsible>
			)}
		</Draggable>
		);
}