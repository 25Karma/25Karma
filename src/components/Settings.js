import React, { useRef } from 'react';
import Cookies from 'js-cookie';
import './Settings.css';
import { Button, ExternalLink } from 'components';
import { APP, COOKIES } from 'constants/app';
import { useAppContext, useTooltip } from 'hooks';

/*
* Gets/sets cookies based on user's site preferences
*
* @param {function} props.toggle   Function that is run when 'Save Settings' is clicked
*/
export function Settings(props) {
	
	// Refs used by setCookies() to locate inputs
	const pinnedPlayerInput = useRef(COOKIES.pinnedPlayer);
	const decimalInput = useRef(COOKIES.decimalPlaces);
	const hideCompleteAchievementsInput = useRef(COOKIES.hideCompletedAchievements);
	const { setBanner } = useAppContext();

	useTooltip();

	/*
	* Sets cookies related to user preferences
	*/
	function setCookies() {
		// Check that decimal places input is valid
		const decimalString = parseDecimalInput(decimalInput.current.value);
		if (decimalString === false) {
			setBanner({
				style: 'error',
				title: 'Invalid Entry.',
				description: '"Decimal Places" must be an integer between 0 and 8.', 
				expire: true
			});
			return;
		}
		// If all is well, set the cookies
		Cookies.set(COOKIES.pinnedPlayer, pinnedPlayerInput.current.value, {expires:365});
		Cookies.set(COOKIES.decimalPlaces, decimalString, {expires:365});
		Cookies.set(COOKIES.hideCompletedAchievements, hideCompleteAchievementsInput.current.checked, {expires:365})
		props.toggle();
	}
	
	/*
	* Clears all cookies - user preference cookies as well as others used by the app
	*/
	function clearCookies() {
		Object.values(COOKIES).forEach((cookie) => {
			Cookies.remove(cookie);
		});
		setBanner({
			style: 'info',
			title: 'Your cookies were cleared.',
			description: 'You may reload the page, or click Save Settings if this was a mistake.',
		});
	}
	
	/*
	* Checks that the 'Decimal Places' input is a number from 0 to 8
	*
	* @param {string} str The string to parse for an integer value
	* @return {number} Either false or the successfully parsed number
 	*/
	function parseDecimalInput(str) {
		try {
			parseInt(str);
		}
		catch (e) {
			return false;
		}
		// Accepts decimals, but rounds down to nearest integer
		const num = parseInt(str);
		if (isNaN(num) || num < 0 || num > 8) return false;
		return num;
	}

	return (
		<div className="settings p-2">
			<div className="container v-flex">
				{/* 'Pinned Player' row */}
				<div className="h-flex align-items-center pb-2">
					<span 
						data-tip="The player you would like to load by default when you visit this site." 
						className="font-bold cursor-help pr-2">
						Pinned Player
					</span>
					<input 
						ref={pinnedPlayerInput}
						style={{width:'15rem'}}
						type="text" 
						placeholder={`ex. ${APP.suggestedPlayers[1]}`}
						defaultValue={Cookies.get(COOKIES.pinnedPlayer)}/>
					<div className="pl-2 ml-auto">
						<Button type="error" onClick={clearCookies}>
							<span className="font-bold">Clear Cookies</span>
						</Button>
					</div>
				</div>
				{/* 'Decimal Places' row */}
				<div className="h-flex align-items-center pb-2">
					<span 
						data-tip="The amount of decimal places to display for K/D, W/L, etc." 
						className="font-bold cursor-help pr-2">
						Decimal Places
					</span>
					<input 
						ref={decimalInput}
						style={{width:'4rem'}}
						type="number"  
						defaultValue={Cookies.get(COOKIES.decimalPlaces) || '2'}
						min="0"
						max="8"
						step="1"/>
				</div>
				{/* 'Hide Completed Achievements' row */}
				<div className="h-flex align-items-center pb-2">
					<span
						data-tip="Whether to hide completed achievements."
						className="font-bold cursor-help pr-2">
						Hide Completed Achievements
					</span>
					<input
						ref={hideCompleteAchievementsInput}
						type="checkbox"
						defaultChecked={Cookies.get(COOKIES.hideCompletedAchievements) === 'true' || false}/>
				</div>
				<div className="v-flex align-items-center pb-3">
					<Button onClick={setCookies}><span className="font-bold">Save Settings</span></Button>
				</div>
				<p>
					Your preferences are stored as <ExternalLink href="http://www.whatarecookies.com/">
					cookies</ExternalLink> on your computer. They are accessible to you and to you only. 
					You can clear the cookies used by this site at any time by clicking the Clear Cookies button.
				</p>
			</div>
		</div>
		);
}
