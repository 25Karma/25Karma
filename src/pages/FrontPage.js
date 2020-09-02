import React from 'react';
import { Banner, ExternalLink, MinecraftText, Navbar, 
	PageLayout, Tips, RecentSearches, Searchbar } from 'components';
import properties from 'constants/site';

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
	document.title = properties.documentTitle;

	// Set the banner according to the config
	let banner = null;
	switch (config.reason) {
		case ('MOJANG_CALL_FAILED'):
		case ('MOJANG_PLAYER_DNE'):
			banner = (
				<Banner type="error"
					title='Player not found. '
					description={
							<span>
								A player with the name "
								<ExternalLink href={`https://namemc.com/search?q=${config.slug}`}>{config.slug}</ExternalLink>
								" does not exist.
							</span>
					}/>
				);
			break;
		case ('HYPIXEL_PLAYER_DNE'):
			banner = (
				<Banner type="error"
					title='Player not found. '
					description={`The player "${config.slug}" has never played on Hypixel.`}/>
				);
			break;
		case ('HYPIXEL_ACCESS_DENIED'):
			banner = (
				<Banner type="error"
					title='Access denied. '
					description={`The call to the Hypixel API was denied due to '${config.cause}'.`}/>
				);
			break;
		case ('HYPIXEL_API_DOWN'):
			banner = (
				<Banner type="error"
					title='Hypixel API Error. '
					description={`The Hypixel API is not responding. Is it down?`}/>
				);
			break;
		case ('RATELIMITED'):
			banner = (
				<Banner type="error"
					title='Woah there! '
					description={`You've sent too many requests recently! Try again in a few minutes.`}/>
				);
			break;
		default: break;
	}
	
	return (
		<PageLayout
			header={<Navbar />}
			top={
				<span className="text-shadow">
					<MinecraftText size="xl">
						{"§d"+properties.appName}
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
					<div className="mx-auto">
						{banner}
					</div>
					<div className="pt-5 pb-2">
						<Tips />
					</div>
				</React.Fragment>
			}/>
		);
}