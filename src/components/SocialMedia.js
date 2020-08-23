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
			DISCORD: {icon: FaDiscord, color: 'gray'},
			HYPIXEL: {icon: 'HypixelLogo', color: 'gold'},
			TWITCH: {icon: FaTwitch, color: 'purple'},
			TWITTER: {icon: FaTwitter, color: 'aqua'},
			YOUTUBE: {icon: FaYoutube, color: 'red'},
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
					<span key={k} className="pr-2">
						<button onClick={()=>{setBannerShown(true)}}>
							<ReactIcon 
								icon={s.icon} 
								color={s.color}
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
					<span key={k} className="pr-2">
						<ExternalLink href={v}>
							<ReactIcon 
								icon={s.icon} 
								color={s.color} 
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
