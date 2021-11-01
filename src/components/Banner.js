import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Banner.css';
import { FaDiscord } from 'react-icons/fa';
import { MdClose, MdContentCopy, MdReport, MdInfoOutline } from 'react-icons/md';
import { ReactIcon } from 'components';
import { useAppContext} from 'hooks';
import * as Utils from 'utils';

/*
* A popup banner to display a message at the bottom of the screen
* Retrieves banner data from the App context
*
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
			info: { icon: MdInfoOutline, color: "rgb(40,70,200)" },
			error: { icon: MdReport, color: "rgb(200,50,50)" },
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
				{banner.copyable &&
					<button onClick={copyToClipboard} className="pl-2">
						<ReactIcon icon={MdContentCopy} clickable /> 
					</button>
				}
				<span className="px-2">
					{banner.title &&
						<span className="font-bold">{banner.title}&nbsp;</span>
					}
					<span>{banner.description}</span>
				</span>
				<button onClick={close}>
					<ReactIcon icon={MdClose} clickable /> 
				</button>
			</div>
			</div>
		</div>
		)
}