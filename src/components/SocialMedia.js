import React, { useState } from 'react';
import { FaDiscord, FaTwitch, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Banner, ExternalLink, ReactIcon } from 'components';

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
			TWITCH: {icon: FaTwitch, color: '#9147ff'},
			TWITTER: {icon: FaTwitter, color: '#1da1f2'},
			YOUTUBE: {icon: FaYoutube, color: '#ff0000'},
		},
	}

	const { links } = props;
	let discordBanner = null;
	const [bannerShown, setBannerShown] = useState(false);

	let socialMediaIcons = [];
	for (const [k,v] of Object.entries(links)) {
		const s = consts.SOCIALMEDIA[k]
		if (s) {
			if (k === 'DISCORD') {
				socialMediaIcons.push(
					<span key={k} className="pr-2" style={{color: s.color}}>
						<button onClick={()=>{setBannerShown(true)}}>
							<ReactIcon 
								icon={s.icon} 
								clickable />
						</button>
					</span>
					);
				discordBanner = (
				<Banner
					type="info"
					title={v}
					expire
					onExpiry={()=>{setBannerShown(false)}} />
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

	return (
		<React.Fragment>
			<div>
				{socialMediaIcons}
			</div>
			<div className="v-flex align-items-center">
				{bannerShown && discordBanner}
			</div>
		</React.Fragment>
		);
}
