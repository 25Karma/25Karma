import React, { useContext } from 'react';
import { FaDiscord, FaInstagram, FaTwitch, FaTwitter, FaYoutube } from 'react-icons/fa';
import { ExternalLink, ReactIcon } from 'components';
import { AppContext } from 'contexts';

/*
* Displays a person's social media as a row of icons
*
* @param {Object} props.links 	An Object from player.socialMedia.links
*/
export function SocialMedia(props) {
	const consts = {
		SOCIALMEDIA: {
			DISCORD: {icon: FaDiscord, color: '#7289da'},
			HYPIXEL: {icon: 'HypixelLogo', color: '#ffaa00'},
			INSTAGRAM: {icon: FaInstagram, color: '#e1306c'},
			TWITCH: {icon: FaTwitch, color: '#9147ff'},
			TWITTER: {icon: FaTwitter, color: '#1da1f2'},
			YOUTUBE: {icon: FaYoutube, color: '#ff0000'},
		},
	}

	const { links } = props;
	const { setBanner } = useContext(AppContext);

	let socialMediaIcons = [];
	for (const [k,v] of Object.entries(links)) {
		const s = consts.SOCIALMEDIA[k]
		if (s) {
			if (k === 'DISCORD') {
				socialMediaIcons.push(
					<span key={k} className="pr-2" style={{color: s.color}}>
						<button onClick={() => {displayDiscordBanner(v)}}>
							<ReactIcon 
								icon={s.icon} 
								clickable />
						</button>
					</span>
					);
			}
			else {
				socialMediaIcons.push(
					<span key={k} className="pr-2" style={{color: s.color}}>
						<ExternalLink href={v}>
							<ReactIcon 
								icon={s.icon} 
								clickable />
						</ExternalLink>
					</span>
					);
			}
		}
	}

	function displayDiscordBanner(discordTag) {
		setBanner({
			style: 'discord',
			title: discordTag
		});
	}

	return (
		<React.Fragment>
			<div>
				{socialMediaIcons}
			</div>
		</React.Fragment>
		);
}
