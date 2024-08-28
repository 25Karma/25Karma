import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Banner.css';
import { FaDiscord } from 'react-icons/fa';
import { MdClose, MdContentCopy, MdReport, MdInfoOutline } from 'react-icons/md';
import { ReactIcon, Tippy } from 'src/components';
import { useAppContext } from 'src/hooks';
import * as Utils from 'src/utils';

/**
 * A popup banner to display a message at the bottom of the screen
 * Retrieves banner data from the App context
 */
export function Banner(props) {
	const { banner } = useAppContext();
	const [bannerVisibility, setBannerVisibility] = useState('hidden');
	const bannerStyle = getStyle(banner.style);

	const styleStates = {
		hidden: { transform: "translateY(100%)" },
		shown: { transform: "translateY(0)" },
	}
	
	// Returns styling information about the banner
	function getStyle(style) {
		const bannerStyles = {
			info: { icon: MdInfoOutline, color: "#5555ff" },
			error: { icon: MdReport, color: "#ff3c3c" },
			discord: { icon: FaDiscord, color: "#7289da" }
		}
		if (style === undefined) {
			return bannerStyles.info;
		}
		return bannerStyles[style];
	}

	const willExpire = banner.expire || false;
	useEffect(() => {
		let timeoutID;
		if (!Utils.isEmpty(banner)) {
			setBannerVisibility('shown');
		}
		if (willExpire) {
			timeoutID = setTimeout(close, 5000);
		}
		// useEffect should clean up the timeout so that it doesn't leak
		return () => {
			clearTimeout(timeoutID);
		}
	}, [banner, willExpire])

	// Wipes banner on page change
	const location = useLocation();
	useEffect(close, [location.pathname]);

	function close() {
		setBannerVisibility('hidden');
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(banner.title);
	}

	return !Utils.isEmpty(banner) && (
		<div className="banner-wrapper" style={styleStates[bannerVisibility]}>
			<div className="container v-flex align-items-center">
			<div className="banner mb-4 p-2" style={{backgroundColor: bannerStyle.color}}>
				<span>
					<ReactIcon icon={bannerStyle.icon}/>
				</span>
				<span className="px-2">
					{banner.title &&
						<span className="font-bold">{banner.title}&nbsp;</span>
					}
					<span>{banner.description}</span>
				</span>
				{banner.copyable &&
					<Tippy content="Copy to clipboard" followCursor={true}>
						<button onClick={copyToClipboard} className="pr-1">
							<ReactIcon icon={MdContentCopy} clickable /> 
						</button>
					</Tippy>
				}
				<button onClick={close}>
					<ReactIcon icon={MdClose} clickable /> 
				</button>
			</div>
			</div>
		</div>
		)
}