import React, { useRef } from 'react';
import { MdSearch } from 'react-icons/md';
import './Input.css';

export function Input(props) {

	const refInput = useRef("input")
	
	function handleKeyDown(event) {
		if(event.key === "Enter") {
			search();
		}
	}

	function search() {
		const player = encodeURIComponent(refInput.current.value);
		if (player === "") {
			return;
		}
		const origin = window.location.origin;
		window.location.href = `${origin}/?player=${player}`;
	}

	return (
		<div className="py-1 px-2 input">
			<input
			ref={refInput}
			type="text" 
			onKeyDown={handleKeyDown} 
			autoFocus
			/>
			<button className="font-md" onClick={search}>
				<MdSearch />
			</button>
		</div>
	);
}