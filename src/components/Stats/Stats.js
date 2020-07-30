import React from 'react';
import { IconContext } from 'react-icons';
import { MdDragHandle } from 'react-icons/md';
import './Stats.css';

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