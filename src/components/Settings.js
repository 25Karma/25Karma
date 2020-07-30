import React, { useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import Cookies from 'js-cookie';
import './Settings.css';
import { Banner, Button } from '../components';

export function Settings(props) {

	const pinnedPlayerInput = useRef('pinnedPlayer');

	function setSettings() {
		Cookies.set('pinnedPlayer', pinnedPlayerInput.current.value);
		props.toggle();
	}

	return (
		<div className="settings p-2">
			<div className="container v-flex">
				<div className="h-flex align-items-center pb-2">
					<div 
						data-tip="The player you would like to load by default when you visit this page." 
						className="font-bold cursor-help pr-2">
						Pinned Player
					</div>
					<input 
						ref={pinnedPlayerInput}
						type="text" 
						placeholder="ex. Technoblade" 
						defaultValue={Cookies.get('pinnedPlayer')}/>
				</div>
				<div className="h-flex justify-content-center">
					<Button onClick={setSettings}><p className="text-shadow">Save Settings</p></Button>
				</div>
			</div>
			<ReactTooltip />
		</div>
		);
}