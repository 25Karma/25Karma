import React, { useState } from 'react';
import { IconContext } from 'react-icons';
import { MdSettings } from 'react-icons/md';
import p from '../properties.js';
import { Settings } from '../components';

export function Navbar(props) {

	function toFrontPage() {
		const origin = window.location.origin;
		return `${origin}/?redirect=false`;
	}
	const [settingsShown, setSettingsShown] = useState(false);
	function toggleSettings() {
		setSettingsShown(!settingsShown)
	}

	return (
		<React.Fragment>
			<div className="h-flex">
					<div className="flex-1 p-1 h-flex">
						<a className="font-md p-1 font-minecraft c-pink text-shadow" href={toFrontPage()}>
							{p.appNickname}
						</a>
					</div>
					<div className="flex-1 py-1 flex-grow-3">
						{props.children}
					</div>
					<div className="flex-1 p-1 text-right">
						<IconContext.Provider value={{ className: 'react-icons' }}>
							<p className="p-1">
								<button className="font-md settings-button" onClick={toggleSettings}>
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