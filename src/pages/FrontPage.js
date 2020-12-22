import React, { useState, useEffect, useContext } from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { ExternalLink, MinecraftText, Navbar, 
	PageLayout, ReactIcon, RecentSearches, Searchbar } from 'components';
import { APP } from 'constants/app';
import { AppContext } from 'contexts';

/*
* The frontpage of the site
*
* @param {JSX} props.config 	The frontpage will load banners and other components differently 
*								depending on the config. The config must contain a reason 
*								for the error. Other optional properties will be provided in the
*								config depending on the reason.
*/
export function FrontPage(props) {

	const config = props.config || {};
	document.title = APP.documentTitle;

	// Set the banner according to the config
	const { setBanner } = useContext(AppContext);
	useEffect(() => {
		switch (config.reason) {
			case ('MOJANG_CALL_FAILED'):
			case ('MOJANG_PLAYER_DNE'):
				setBanner({
					style: 'error',
					title: 'Player not found.',
					description: (
						<span>
							The player "
							<ExternalLink href={`https://namemc.com/search?q=${config.slug}`}>{config.slug}</ExternalLink>
							" does not exist.
						</span>
						)
				});
				break;
			case ('HYPIXEL_PLAYER_DNE'):
				setBanner({
					style: 'error',
					title: 'Player not found.',
					description: (
						<span>
							The player "
							<ExternalLink href={`https://namemc.com/search?q=${config.slug}`}>{config.slug}</ExternalLink>
							" has never played on Hypixel.
						</span>
						)
				});
				break;
			case ('HYPIXEL_GUILD_DNE'):
				setBanner({
					style: 'error',
					title: 'Guild not found.',
					description: `The player "${config.slug}" is not in a guild.`
				});
				break;
			case ('HYPIXEL_ACCESS_DENIED'):
				setBanner({
					style: 'error',
					title: 'Access denied.',
					description: `The call to the Hypixel API was denied due to '${config.cause}'.`
				});
				break;
			case ('HYPIXEL_API_DOWN'):
				setBanner({
					style: 'error',
					title: 'Hypixel API Error.',
					description: `The Hypixel API is not responding. Is it down?`
				});
				break;
			case ('RATELIMITED'):
				setBanner({
					style: 'error',
					title: 'Woah there!',
					description: `You've sent too many requests recently! Try again in a few minutes.`
				});
				break;
			default: break;
		}
	}, [config, setBanner])
	
	return (
		<PageLayout
			header={<Navbar />}
			top={
				<span className="text-shadow">
					<MinecraftText size="xxl">
						{"§d"+APP.appName}
					</MinecraftText>
				</span>
			}
			center={
				<React.Fragment>
					<p className="py-1 pl-2">
						<MinecraftText size="md">
							Search for the stats of a Hypixel player
						</MinecraftText>
					</p>
					<div className="py-1">
						<Searchbar defaultValue={config.slug || ''}/>
					</div>
					<div className="pl-2 h-flex align-items-start">
						<RecentSearches />
					</div>
					<div className="pt-5 pb-2">
						<Tips />
					</div>
				</React.Fragment>
			}/>
		);
}

function Tips(props) {
	const tips = [
		"🚨 Hey! Have you read all these tips yet? 🚨",
		"Customize this site by clicking on the gear button in the top-right corner.",
		<React.Fragment>
			Have a 
			suggestion? <ExternalLink href={APP.hypixelForums}>
				Message me on the Hypixel Forums. </ExternalLink>
		</React.Fragment>,
		<React.Fragment>
			Interested in how this site was 
			built? <ExternalLink href="https://github.com/25karma">Check out the code
			on GitHub.</ExternalLink>
		</React.Fragment>,
		"Clicking on a player's avatar brings you to their profile on NameMC.",
		<React.Fragment>
			The SkyBlock Stats button on the player stats page brings you
			to <ExternalLink href="https://sky.shiiyu.moe">sky.shiiyu.moe</ExternalLink>!
		</React.Fragment>,
		"The pink row in a table indicates your most played class/mode!"
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
			<button onClick={previousTip}>
				<ReactIcon icon={FaCaretLeft} clickable />
			</button>
			<p className="px-2 mx-auto">{tips[tipIndex]}</p>
			<button onClick={nextTip}>
				<ReactIcon icon={FaCaretRight} clickable />
			</button>
		</span>
		);
}