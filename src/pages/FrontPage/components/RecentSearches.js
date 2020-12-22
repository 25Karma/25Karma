import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { MdMoreHoriz } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Button, MinecraftText, ReactIcon } from 'components';

/*
*  Renders JSX containing recent searches if there are any
*  If there are none, renders a suggestion
*/
export function RecentSearches(props) {
	let cookie = Cookies.get('recentSearches');
	if (cookie === undefined) {
		cookie = '[]';
	}
	const array = JSON.parse(cookie);

	// Stores how many recent searches to show
	const [showAllRecents, setShowAllRecents] = useState(false);

	// If the cookie is empty or doesn't exist, render a suggestion
	if (array === undefined || array.length === 0) {
		const suggestedPlayer = "Technoblade";
		return (
			<React.Fragment>
				<div className="pt-2">
					<MinecraftText>First time? Try searching</MinecraftText>
				</div>
				<div className="pl-2 py-1">
					<Link to={`/player/${suggestedPlayer}`}>
						<Button>
							<span className="font-xs">{suggestedPlayer}</span>
						</Button>
					</Link>
				</div>
			</React.Fragment>
		);
	}
	return (
		<React.Fragment>
			<div className="pt-2 nowrap">
				<MinecraftText size="sm">Recent searches</MinecraftText>
			</div>
			<div className="h-flex flex-wrap">
				{array.slice(0, showAllRecents ? array.length : 5).map((a) => (
					<div key={a} className="pl-2 py-1">
						<Link to={`/player/${a}`}>
							<Button>
								<span className="font-xs">{a}</span>
							</Button>
						</Link>
					</div>
				))}
				{array.length > 5 && !showAllRecents &&
						<button className="pl-2" onClick={()=>{setShowAllRecents(true)}}>
							<ReactIcon icon={MdMoreHoriz} clickable />
						</button>
				}
			</div>
		</React.Fragment>
		);
}