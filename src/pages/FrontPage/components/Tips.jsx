import React, { useState } from 'react';
import { ExternalLink, ReactIcon, Tippy } from 'src/components';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { APP } from 'src/constants/app';

/**
 * Tips that display on the frontpage
 */
export function Tips() {
	const tips = [
		"🚨 Hey! Have you read all these tips yet? 🚨",
		"Customize this site by clicking on the gear button in the top-right corner.",
		<React.Fragment>
			Have a 
			suggestion? <ExternalLink href={APP.ownerHypixelForumsUrl}>
				Message me on the Hypixel Forums. </ExternalLink>
		</React.Fragment>,
		`Try searching "${APP.suggestedPlayers[2]} guild" or simply "${APP.suggestedPlayers[2]} g" in the search bar!`,
		<React.Fragment>
			Interested in how this site was 
			built? <ExternalLink href={APP.organizationUrl}>Check out the code
			on GitHub.</ExternalLink>
		</React.Fragment>,
		"Clicking on a player's avatar brings you to their profile on NameMC.",
		"Player names are cached for 30 days to shorten page load times!",
		<React.Fragment>
			The "View SkyBlock Stats" button on the player stats page brings you
			to <ExternalLink href={APP.skyblockUrl}>SkyCrypt</ExternalLink>!
		</React.Fragment>,
		"The pink row in a table indicates your most played class/mode!",
		<React.Fragment>
			<ExternalLink href={APP.supportUrl}>Supporting this site</ExternalLink> keeps
			it free to use for thousands of players every day!
		</React.Fragment>,
	]
	const [tipIndex, setTipIndex] = useState(Math.floor(Math.random()*tips.length));

	function previousTip() {
		setTipIndex((tipIndex+tips.length-1)%tips.length);
	}
	function nextTip() {
		setTipIndex((tipIndex+1)%tips.length);
	}
	return (
		<span className="h-flex align-items-center justify-content-center mx-auto" style={{maxWidth:'42rem'}}>
			<Tippy content="Previous Tip">
				<button onClick={previousTip}>
					<ReactIcon icon={FaCaretLeft} clickable />
				</button>
			</Tippy>
			<p className="px-2 mx-auto">{tips[tipIndex]}</p>
			<Tippy content="Next Tip">
				<button onClick={nextTip}>
					<ReactIcon icon={FaCaretRight} clickable />
				</button>
			</Tippy>
		</span>
		);
}