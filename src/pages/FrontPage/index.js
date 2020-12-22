import React, { useEffect, useContext } from 'react';
import { ExternalLink, MinecraftText, Navbar, PageLayout, Searchbar } from 'components';
import { RecentSearches, Tips } from './components';
import { APP } from 'constants/app';
import { AppContext } from 'contexts';

/*
* The frontpage of the site
*
* @param {JSX} props.config     The frontpage will load banners and other components differently 
*                               depending on the config. The config must contain a reason 
*                               for the error. Other optional properties will be provided in the
*                               config depending on the reason.
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