import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { MdSettings } from 'react-icons/md';
import { GoPin } from 'react-icons/go';
import Cookies from 'js-cookie';
import p from '../properties.js';
import { MinecraftText, Settings } from '../components';

/*
* Navbar that appears at the top of the page
*
* @param {JSX} props.children JSX Object to display in the center of the navbar
*/
export function Navbar(props) {

	const [settingsShown, setSettingsShown] = useState(false);
	function toggleSettings() {
		setSettingsShown(!settingsShown)
	}
	
	/*
	* Returns a clickable pin icon if the 'pinnedPlayer' cookie exists
	*
	* @return {JSX} A clickable pin icon that redirects to the pinned player's stats on click
	*/
	function renderPinnedPlayerButton() {
		const p = Cookies.get('pinnedPlayer');
		if (p) {
			return (
				<Link className="font-md" to={`/player/${p}`}>
					<GoPin />
				</Link>
				);
		}
		return null;
	}

	return (
		<React.Fragment>
			<div className="h-flex">
					<div className="flex-1 p-1 h-flex">
						<Link className="p-1 text-shadow" to="/frontpage">
							<MinecraftText font="md">
								{"§d"+p.appNickname}
							</MinecraftText>
						</Link>
					</div>
					<div className="flex-1 py-1 flex-grow-3">
						{props.children}
					</div>
					<div className="flex-1 p-1 text-right">
						<IconContext.Provider value={{ className: 'react-icons' }}>
							<p className="p-1">
								{renderPinnedPlayerButton()}
								<button className="font-md pl-2" onClick={toggleSettings}>
									<MdSettings />
								</button>
							</p>
						</IconContext.Provider>
					</div>
			</div>
			{/* 
				Settings JSX is placed under the Navbar
				Its height is handled by the Navbar
			 */}
			<div className={settingsShown ? 'settings-shown' : 'settings-hidden'}>
				<Settings toggle={toggleSettings}/>
			</div>
		</React.Fragment>
		);
}