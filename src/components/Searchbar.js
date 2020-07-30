import React, { useRef } from 'react';
import { IconContext } from 'react-icons';
import { MdSearch } from 'react-icons/md';
import './Searchbar.css';
import * as Utils from '../utils';

export function Searchbar(props) {

	const refInput = useRef("input")
	
	function handleKeyDown(event) {
		if(event.key === "Enter") {
			search();
		}
	}

	function search() {
		const player = refInput.current.value;
		Utils.searchForPlayer(player);
	}

	return (
		<div className="py-1 px-2 input">
			<input
			ref={refInput}
			type="text" 
			onKeyDown={handleKeyDown} 
			autoFocus
			/>
			<IconContext.Provider value={{ className: 'react-icons' }}>
				<button className="font-md" onClick={search}>
					<MdSearch />
				</button>
			</IconContext.Provider>
		</div>
	);
}