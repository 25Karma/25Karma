import React, { useState, useEffect, memo } from 'react';
import Cookies from 'js-cookie';
import ReactTooltip from 'react-tooltip';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaSortAlphaDown } from 'react-icons/fa';
import { RiCheckboxIndeterminateFill, RiCheckboxIndeterminateLine } from 'react-icons/ri';
import { ReactIcon, HorizontalLine as HLine } from 'components';
import * as Accordions from './Accordions';

export function AccordionList(props) {

	const cookieName = 'accordionList';
	const cookie = getCookie();
	const [accordionList, setAccordionList] = useState(cookie.list);
	const [showLine, setShowLine] = useState(cookie.showLine);

	function getCookie() {
		let cookie = Cookies.get(cookieName);
		// If no cookie found, it will be undefined
		if (cookie === undefined) {
			return {
				list: alphabetizeList(),
				showLine: false,
			}
		}
		else {
			const {list, showLine} = JSON.parse(cookie);
			let accordionNames = Object.entries(Accordions).map(([name]) => name);
			accordionNames.push('HorizontalLine');
			// Add any Accordions that were not found in the cookie data
			for (const name of accordionNames) {
				if (!list.includes(name)) {
					list.push(name);
				}
			}
			// If any invalid accordion names are found, reset the entire cookie
			for (const name of list) {
				if (!accordionNames.includes(name)) {
					Cookies.remove(cookieName);
					return getCookie();
				}
			}
			return {list, showLine};
		}
	}

	function onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
			return;
		}
		const startIndex = result.source.index;
		const endIndex = result.destination.index;
		const [removed] = accordionList.splice(startIndex, 1);
		const newList = [...accordionList];
		newList.splice(endIndex, 0, removed)
		setAccordionList(newList);
	}

	function alphabetizeList() {
		let array = ['HorizontalLine'];
		for (const [name] of Object.entries(Accordions)) {
			array.push(name);
		}
		return array;
	}

	function toJSX() {
		let accordions = [];
		// For react-beautiful-dnd, Draggable components require an integer index prop
		let index = 0;
		for (const str of accordionList) {
			const props = {key: index, index: index};
			index++;
			if (str === 'HorizontalLine') {
				accordions.push(<HorizontalLine {...props} hidden={!showLine} />)
			}
			else {
				const Component = getAccordionFromString(str);
				accordions.push(<Component {...props} />);
			}
		}
		return accordions;
	}

	function getAccordionFromString(str) {
		// Finds the matching component from within the Accordion module
		for (const [name, component] of Object.entries(Accordions)) {
			if (name === str) {
				return component;
			}
		}
		return null;
	}
	
	useEffect(() => {
		const cookie = {
			list: accordionList,
			showLine: showLine,
		}
		Cookies.set(cookieName, JSON.stringify(cookie), {expires:365});
	}, [accordionList, showLine]);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="h-flex px-2 py-1 justify-content-end">
				<button 
					className="mr-2" 
					onClick={()=>{setShowLine(!showLine)}}
					data-place="left"
					data-tip={(showLine ? 'Hide' : 'Show') + ' line spacer'}>
					<ReactIcon 
						icon={showLine ? RiCheckboxIndeterminateFill : RiCheckboxIndeterminateLine} 
						clickable />
				</button>
				<button onClick={() => {setAccordionList(alphabetizeList)}}>
					<ReactIcon icon={FaSortAlphaDown} clickable />
				</button>
				<ReactTooltip />
			</div>
			<Droppable droppableId="playerStatsDroppable">
				{provided => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{toJSX()}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
		);
}

/*
* Optional separator to show in the player stats list
*
* @param {boolean} props.hidden Whether to hide the entire component
* @param {number} props.index 	The order in which to display the component (used by react-beautiful-dnd)
*/
const HorizontalLine = memo((props) => {
	return (
		<Draggable key="HorizontalLine" draggableId="HorizontalLine" index={props.index}>
		{provided => (
			<div 
				className={props.hidden ? "hidden" : "my-1 py-1"} 
				ref={provided.innerRef} 
				{...provided.draggableProps} 
				{...provided.dragHandleProps}>
				<HLine />
			</div>
		)}
		</Draggable>
		);
});