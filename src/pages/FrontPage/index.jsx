import React, { useEffect, useMemo } from 'react';
import { ExternalLink, MinecraftText, PageLayout } from 'src/components';
import { RecentSearches, Search, Tips } from './components';
import { APP } from 'src/constants/app';
import { useAppContext } from 'src/hooks';

/**
 * The frontpage of the site
 *
 * @param {JSX} props.config    The frontpage will load banners and other components differently 
 *                              depending on the config. The config must contain a reason 
 *                              for the error. Other optional properties will be provided in the
 *                              config depending on the reason.
 */
export function FrontPage(props) {

	const config = useMemo(() => props.config || {}, [props.config]);
	document.title = `Hypixel Player Stats - ${APP.documentTitle}`;

	// Set the banner according to the config
	const { setBanner } = useAppContext();
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
							<ExternalLink href={`${APP.namemcUrl}${config.slug}`}>{config.slug}</ExternalLink>
							" does not exist.
						</span>
						)
				});
				break;
			case ('MOJANG_RATELIMITED'):
				setBanner({
					style: 'error',
					title: 'Search failed.',
					description: 'The Mojang API is currently overloaded. Try again in a few minutes.'
				});
				break;
			case ('HYPIXEL_PLAYER_DNE'):
				setBanner({
					style: 'error',
					title: 'Player not found.',
					description: (
						<span>
							The player "
							<ExternalLink href={`${APP.namemcUrl}${config.slug}`}>{config.slug}</ExternalLink>
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
			case ('HYPIXEL_THROTTLED'):
				setBanner({
					style: 'error',
					title: 'Search failed.',
					description: 'Access to the Hypixel API was throttled. Try again in a few minutes.'
				});
				break;
			case ('HYPIXEL_DOWN'):
				setBanner({
					style: 'error',
					title: 'Hypixel API Error.',
					description: (
						<span>
							The Hypixel API is not responding. <ExternalLink href={APP.hypixelStatusUrl}>
							Is it down?</ExternalLink>
						</span>
						)
				});
				break;
			case ('RATELIMITED'):
				setBanner({
					style: 'error',
					title: 'Woah there!',
					description: "You've sent too many requests recently! Try again in a few minutes."
				});
				break;
			case ('UNKNOWN'):
				setBanner({
					style: 'error',
					title: 'Whaaaat?',
					description: 'An unknown error occurred.'
				});
				break;
			default: break;
		}
	}, [config, setBanner])
	
	return (
		<PageLayout
			top={
				<h1 className="text-shadow">
					<MinecraftText size="xxl">
						{"§d"+APP.appName}
					</MinecraftText>
				</h1>
			}
			center={
				<React.Fragment>
					<Search defaultValue={config.slug} />
					<RecentSearches />
					<div className="pt-5 pb-2">
						<Tips />
					</div>
				</React.Fragment>
			}/>
		);
}