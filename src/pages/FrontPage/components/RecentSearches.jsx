import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { MdMoreHoriz } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Button, MinecraftText, ReactIcon, Tippy } from 'src/components';
import { APP, COOKIES } from 'src/constants/app';

/**
 * Renders JSX containing recent searches if there are any
 * If there are none, renders a suggestion
 */
export function RecentSearches() {
	let cookie = Cookies.get(COOKIES.recentSearches);
	if (cookie === undefined) {
		cookie = '[]';
	}
	const array = JSON.parse(cookie);

	// Stores whether to show all recent searches or only the first line
	const [showAllRecents, setShowAllRecents] = useState(false);
	// Stores whether the list of recent searches overflow to the next line
	const [doRecentsOverflow, setRecentsOverflow] = useState(true);

	const refList = useRef(false);

	useEffect(() => {
		// Call renderer right away so state gets updated with initial window size
		renderRecentSearches();
		// Add window resize event listener
		window.addEventListener("resize", renderRecentSearches);
		// Remove event listener on cleanup
		return () => window.removeEventListener("resize", renderRecentSearches);
	}, [showAllRecents]);

	function renderRecentSearches() {
		const listElement = refList.current;
		if (!listElement) return;

		const itemElement = listElement.firstChild;
		setRecentsOverflow(listElement.scrollHeight !== itemElement.scrollHeight);
		listElement.classList.remove('h-0');
		listElement.style = showAllRecents ? '' : `height: ${itemElement.clientHeight}px`;
	}

	// If the cookie is empty or doesn't exist, render a suggestion
	if (array === undefined || array.length === 0) {
		return (
			<div className="h-flex flex-wrap pt-2 pl-1">
				<h1 className="pt-2 pl-2">
					<MinecraftText>First time? Try searching</MinecraftText>
				</h1>
				<div className="pl-2 py-1">
					<Link to={`/search/${APP.suggestedPlayers[0]}`}>
						<Button>
							<span className="font-xs">{APP.suggestedPlayers[0]}</span>
						</Button>
					</Link>
				</div>
			</div>
		);
	}
	return (
		<React.Fragment>
			<h1 className="mt-4 pl-2">
				<MinecraftText>Recent searches</MinecraftText>
			</h1>
			<div className="h-flex justify-content-between align-items-center">
				<div ref={refList} className="h-flex flex-wrap overflow-hidden h-0">
					{array.map((a) => (
						<div key={a} className="pr-2 py-1">
							<Link to={`/search/${a}`}>
								<Button>
									<span className="font-xs">{a}</span>
								</Button>
							</Link>
						</div>
					))}
				</div>
				{!showAllRecents && doRecentsOverflow &&
					<Tippy content="Show All">
						<button onClick={()=>{setShowAllRecents(true)}} className="ml-2">
							<ReactIcon icon={MdMoreHoriz} clickable />
						</button>
					</Tippy>
				}
			</div>
		</React.Fragment>
		);
}