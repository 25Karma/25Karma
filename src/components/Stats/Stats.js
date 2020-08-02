import React from 'react';
import { IconContext } from 'react-icons';
import { MdDragHandle } from 'react-icons/md';
import './Stats.css';

/*
* Base container for all player stats components
*
* @param {string} props.title The title of the stats row
* @param {JSX} props.header JSX objects to place beside the title
*/
export function Stats(props) {
	return (
		<div className="stats-box my-1 px-2">
			<p className="font-md font-minecraft pr-3">{props.title}</p>
			{props.header}
			<IconContext.Provider value={{ className: 'react-icons' }}>
				<button className="font-md cursor-grab ml-auto">
					<MdDragHandle />
				</button>
			</IconContext.Provider>
		</div>
		);
}