import React from 'react';
import { IconContext } from 'react-icons';
import { MdSettings } from 'react-icons/md';
import { Input } from '../components';
import p from '../properties.js';

export function Navbar(props) {
	return (
		<div className="h-flex">
			<IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
				<div className="flex-1 p-2 h-flex">
					<a className="font-md p-1 font-minecraft c-pink text-shadow" href={p.appURL}>
						{p.appName}
					</a>
				</div>
				<div className="flex-1 py-2 flex-grow-3">
					<Input />
				</div>
				<div className="flex-1 p-2 text-right">
					<p className="font-md p-1 cursor-pointer"><MdSettings /></p>
				</div>
			</IconContext.Provider>
		</div>
		);
}