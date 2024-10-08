import React, { useEffect, useRef } from 'react';
import { MdSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import './Searchbar.css';
import { ReactIcon } from 'src/components';
import { useAppContext } from 'src/hooks';

/**
 * Styled input with search button
 *
 * @param {string} props.defaultValue    The default value of the searchbar
 * @param {string} props.tag             Tag to include at the end of the search query (ex. 'guild')
 */
export function Searchbar(props) {

	const refInput = useRef("input");
	const navigate = useNavigate();
	const { setBanner } = useAppContext();

	/* 
	*  If the user tries to type outside of the searchbar, recommend that they press "/" to jump to the searchbar.
	*/
	useEffect(() => {
		function keyDownListener(event) {
			// Do nothing if the user is already focused on a text input
			if (document.activeElement.nodeName === 'INPUT') return;

			// Do nothing if the key is pressed with Ctrl
			if (event.ctrlKey) return;

			const x = event.key.length === 1 && event.key.charCodeAt(0);

			// If the key pressed is "/", jump to the searchbar
			if (x === 47) {
				// Timeout is necessary otherwise the "/" will be typed into the searchbar
				setTimeout(() =>{ refInput.current.focus() }, 10);
			}
			// Otherwise, display a banner (alphanumeric characters only)
			else if ((x >= 48 && x <= 57) || (x >= 65 && x <= 90) || (x >= 97 && x <= 122)) {
				setBanner({
					style: 'info',
					title: <span>Press <kbd>/</kbd> to jump to the searchbar</span>,
					expire: true
				});
			}
		}
		
		document.addEventListener('keydown', keyDownListener);
		return () => {
			document.removeEventListener('keydown', keyDownListener);
		}
	}, [setBanner]);
	
	/*
	* Checks if the key that was pressed was the Enter key
	*
	 * @param {KeyboardEvent} event Generated by onKeyDown listener
	*/
	function handleKeyDown(event) {
		if(event.key === "Enter") {
			search();
		}
	}
	
	/*
	* Searches for a player based on the text currently in the input
	*/
	function search() {
		const slug = refInput.current.value.trim();
		if (slug !== '') {
			// Clear the input
			refInput.current.value = '';
			// Redirect page
			let query;
			if (props.tag) {
				query = encodeURIComponent(`${slug} ${props.tag}`);
			}
			else {
				query = encodeURIComponent(slug);
			}
			navigate(`/search/${query}`);
		}
	}

	return (
		<div className="py-1 px-2 input">
			<input
			ref={refInput}
			type="text" 
			onKeyDown={handleKeyDown} 
			defaultValue={props.defaultValue}
			autoFocus
			spellCheck={false}
			/>
			<button onClick={search}>
				<ReactIcon icon={MdSearch} clickable />
			</button>
		</div>
	);
}