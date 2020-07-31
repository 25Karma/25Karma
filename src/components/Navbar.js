import React, { useState } from 'react';
import { IconContext } from 'react-icons';
import { MdSettings } from 'react-icons/md';
import { GoPin } from 'react-icons/go';
import Cookies from 'js-cookie';
import p from '../properties.js';
import { MinecraftText, Settings } from '../components';
import * as Utils from '../utils';

export function Navbar(props) {

	function getFrontPageURL() {
		const origin = window.location.origin;
		return `${origin}/?redirect=false`;
	}

	const [settingsShown, setSettingsShown] = useState(false);
	function toggleSettings() {
		setSettingsShown(!settingsShown)
	}

	function renderPinnedPlayerButton() {
		const p = Cookies.get('pinnedPlayer');
		if (p) {
			return (
				<button className="font-md" onClick={() => {Utils.searchForPlayer(p)}}>
					<GoPin />
				</button>
				);
		}
		return null;
	}

	return (
		<React.Fragment>
			<div className="h-flex">
					<div className="flex-1 p-1 h-flex">
						<a className="p-1 text-shadow" href={getFrontPageURL()}>
							<MinecraftText font="md">
								{"§d"+p.appNickname}
							</MinecraftText>
						</a>
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
			<div className={settingsShown ? 'settings-shown' : 'settings-hidden'}>
				<Settings toggle={toggleSettings}/>
			</div>
		</React.Fragment>
		);
}