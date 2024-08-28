import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { SiKofi } from 'react-icons/si';
import Cookies from 'js-cookie';
import { Button, Collapsible, ExternalLink, ReactIcon } from 'src/components';
import { APP, COOKIES } from 'src/constants/app';

/**
 * Call-to-action menu that appears at the top of the website periodically
 */
export function Support() {

	const dismissCooldownDays = 90;
	const [ dismissSupportDate, setDismissSupportDate ] = useState(getDateFromCookie(new Date(0)));

	function dismissSupport() {
		setDateToCookie(new Date());
	}

	function doDisplaySupport() {
		const today = new Date();

		// If the dismissal date is in the future (implies tampering)
		if (dismissSupportDate > today) {
			return true;
		}
		// If it has been more days than the dismissal cooldown
		else if ((today-dismissSupportDate) > (dismissCooldownDays * 24 * 60 * 60 * 1000)) {
			return true;
		}

		return false;
	}

	function getDateFromCookie(defaultDate) {
		const cookie = Cookies.get(COOKIES.dismissSupportDate);

		// Check if the cookie does not exist
		if (cookie === undefined) {
			return defaultDate;
		}

		// Check if the cookie is an invalid stringified JSON object
		try {
			const dateJSON = JSON.parse(cookie);

			// Check if the cookie is a valid date
			if (isNaN(Date.parse(dateJSON))) {
				return defaultDate;
			}

			return new Date(dateJSON);

		} catch (e) {
			return defaultDate;
		}
	}
	
	function setDateToCookie(date) {
		setDismissSupportDate(date);
		const dateJSON = date.toJSON();
		Cookies.set(COOKIES.dismissSupportDate, JSON.stringify(dateJSON), {expires:365});
	}

	return doDisplaySupport() && (
		<Collapsible>
		{(provided) => (
			<div className="p-2 mb-1 box-shadow" style={{backgroundColor:"#5555ff"}}>
				<div className="h-flex align-items-center">
					<ReactIcon icon={SiKofi} />
					<span className="font-bold mx-2">Support {APP.appName}.</span>
					<span className="link cursor-pointer mr-2" {...provided.collapseButtonProps}>{provided.isCollapsed ? "Learn more" : "Show less"}</span>
					<button className="ml-auto" onClick={dismissSupport}>
						<ReactIcon icon={MdClose} clickable />
					</button>
				</div>
				<div {...provided.collapsibleProps}>
					<div className="pt-3 h-flex">
						<div className="pr-3 my-auto">
							<ExternalLink href={APP.supportUrl}>
								<Button>
									<div className="p-1" style={{width: "7.5rem"}}>
										<ReactIcon icon={SiKofi} size="lg"/>
										<div className="pt-1">Open Ko-fi</div>
									</div>
								</Button>
							</ExternalLink>
						</div>
						<div >
							<p className="pb-2">Thank you so much for thinking about supporting this website. Donations keep 25Karma free to use for thousands of players every day.</p>
							<p className="pb-2">Please visit my <ExternalLink href={APP.supportUrl}>Ko-fi page</ExternalLink> to see funding goals or to make a contribution.</p>
							<ReactIcon icon={FaHeart} />
						</div>
					</div>
				</div>
			</div>
		)}
		</Collapsible>
		);
}