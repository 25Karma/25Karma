import React from 'react';
import { MdPushPin, MdSettings } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { APP, COOKIES } from 'src/constants/app';
import { Collapsible, MinecraftText, ReactIcon, Searchbar, Settings, Tippy } from 'src/components';

/**
 * Navbar that appears at the top of the page
 *
 * @param {boolean} props.searchbar    Whether or not to display the Searchbar component
 */
export function Navbar(props) {
	
	/**
	 * Returns a clickable pin icon if the 'pinnedPlayer' cookie exists
	 *
	 * @returns {JSX} A clickable pin icon that redirects to the pinned player's stats on click
	 */
	function renderPinnedPlayerButton() {
		const p = Cookies.get(COOKIES.pinnedPlayer);
		if (p) {
			return (
				<Link className="font-md" to={`/search/${p}`}>
					<ReactIcon icon={MdPushPin} clickable />
				</Link>
				);
		}
		return null;
	}

	return (
		<Collapsible>
		{(provided) => (
			<React.Fragment>
				<div className="h-flex">
						<div className="flex-1 h-flex align-items-center">
							<Link className="text-shadow nowrap p-2" to="/frontpage">
								<MinecraftText font="md">
									{"§d"+APP.appNickname}
								</MinecraftText>
							</Link>
						</div>
						<div className={`flex-1 py-1 flex-3 ${props.searchbar || 'hidden'}`}>
							<Searchbar />
						</div>
						<div className="flex-1 h-flex justify-content-end align-items-center">
								<p className="p-2">
									{renderPinnedPlayerButton()}
									<button className="ml-2" {...provided.collapseButtonProps}>
										<ReactIcon icon={MdSettings} clickable />
									</button>
								</p>
						</div>
				</div>
				<div {...provided.collapsibleProps}>
					<Settings toggle={provided.collapseButtonProps.onClick}/>
				</div>
			</React.Fragment>
		)}
		</Collapsible>
		);
}