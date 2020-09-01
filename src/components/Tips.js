import React, { useState } from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { ExternalLink, ReactIcon } from 'components';
import p from 'constants/site';

export function Tips(props) {
	const proTips = [
		"Pro tip: Customize this site by clicking on the gear button in the top-right corner.",
		<React.Fragment>
			Have a suggestion? Message me on the Hypixel
			Forums <ExternalLink href={p.hypixelForums}>here</ExternalLink>.
		</React.Fragment>,
		"Clicking on a player's avatar brings you to their profile on NameMC.",
		<React.Fragment>
			The SkyBlock Stats button on the player stats page brings you
			to <ExternalLink href="https://sky.lea.moe">sky.lae.moe</ExternalLink>!
		</React.Fragment>,
	]
	const [tipIndex, setTipIndex] = useState(Math.floor(Math.random()*proTips.length));

	function previousTip() {
		setTipIndex((tipIndex+proTips.length-1)%proTips.length);
	}
	function nextTip() {
		setTipIndex((tipIndex+1)%proTips.length);
	}
	return (
		<span className="h-flex align-items-center justify-content-center mx-auto" style={{maxWidth:'40rem'}}>
			<button onClick={previousTip}>
				<ReactIcon icon={FaCaretLeft} clickable />
			</button>
			<p className="px-2 mx-auto">{proTips[tipIndex]}</p>
			<button onClick={nextTip}>
				<ReactIcon icon={FaCaretRight} clickable />
			</button>
		</span>
		);
}