import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { MdDragHandle } from 'react-icons/md';
import LazyLoad from 'react-lazyload';
import './Accordion.css';
import { Collapsible, HorizontalLine, MinecraftText, ReactIcon } from 'components';

/*
* Draggable container with a collapsable portion underneath
*
* @param {string} props.title   The title of the stats row
* @param {JSX} props.header     JSX objects to place beside the title
* @param {JSX} props.children   The contents of the collapsible area
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
						<div className="accordion-header"> 
							<div className="accordion-collapse-button" {...cProvided.collapseButtonProps}>
								<MinecraftText font="md" className="flex-1 py-2">
									{props.title}
								</MinecraftText>
								<div className="h-flex flex-2 px-2 overflow-hidden">
									{props.header}
								</div>
							</div>
							<button className="mx-2" {...dProvided.dragHandleProps}>
								<ReactIcon icon={MdDragHandle} clickable />
							</button>
						</div>
						<LazyLoad once>
							<div {...cProvided.collapsibleProps}>
								<div className="px-2">
									<HorizontalLine />
								</div>
								<div className="overflow-x">
									<div className="accordion-body px-2">
										{props.children ?
											<div className="py-3">{props.children}</div> 
											: 
											<div className="py-2">{`No stats to display for ${props.title}.`}</div>
										}
									</div>
								</div>
							</div>
						</LazyLoad>
					</div>
				</div>
				)}
			</Collapsible>
			)}
		</Draggable>
		);
}