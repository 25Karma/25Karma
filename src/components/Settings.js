import React, { useState, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import Cookies from 'js-cookie';
import './Settings.css';
import { Link, Banner, Button } from '../components';
import * as Utils from '../utils';

export function Settings(props) {

	const pinnedPlayerInput = useRef('pinnedPlayer');
	const decimalInput = useRef('decimal');
	const [banner, setBanner] = useState(null);

	function setCookies() {
		// Check that decimal places input is valid
		const decimalString = parseDecimalInput(decimalInput.current.value);
		if (decimalString === false) {
			setBanner("DecimalPlaceError");
			return;
		}
		// If all is well, set the cookies
		Cookies.set('pinnedPlayer', pinnedPlayerInput.current.value, {expires:365});
		Cookies.set('decimal', decimalString, {expires:365});
		props.toggle();
	}

	function clearCookies() {
		Cookies.remove('pinnedPlayer');
		Cookies.remove('decimal');
		let recentSearches = new Utils.RecentSearches();
		recentSearches.clear();
		setBanner("ClearCookiesInfo");
	}

	function parseDecimalInput(str) {
		try {
			parseInt(str);
		}
		catch (e) {
			return false;
		}
		const num = parseInt(str);
		if (isNaN(num) || num < 0 || num > 8) return false;
		return num;
	}

	function renderBanner() {
		if (banner === "DecimalPlaceError") {
			return (
				<Banner type="error"
					title='Invalid Entry. '
					description='"Decimal Places" must be an integer between 0 and 8.' 
					expire
					onExpiry={()=>{setBanner(null)}}
					/>
				);
		}
		else if (banner === "ClearCookiesInfo") {
			return (
				<Banner type="info"
					title='Your cookies were cleared. '
					description='You may reload the page, or click Save Settings if this was a mistake.' 
					expire
					onExpiry={()=>{setBanner(null)}}
					/>
				);
		}
	}

	return (
		<div className="settings p-2">
			<div className="container v-flex">
				<div className="h-flex align-items-center pb-2">
					<div 
						data-tip="The player you would like to load by default when you visit this page." 
						className="font-bold cursor-help pr-2">
						Pinned Player
					</div>
					<input 
						ref={pinnedPlayerInput}
						style={{width:'15rem'}}
						type="text" 
						placeholder="ex. Technoblade" 
						defaultValue={Cookies.get('pinnedPlayer')}/>
					<div className="pl-2 ml-auto">
						<Button type="error" onClick={clearCookies}>
							<small>Clear Cookies</small>
						</Button>
					</div>
				</div>
				<div className="h-flex align-items-center pb-2">
					<div 
						data-tip="The amount of decimal places to display for K/D, W/L, etc." 
						className="font-bold cursor-help pr-2">
						Decimal Places
					</div>
					<input 
						ref={decimalInput}
						style={{width:'4rem'}}
						type="number"  
						defaultValue={Cookies.get('decimal') || '2'}
						min="0"
						max="8"
						step="1"/>
				</div>
				<div className="v-flex align-items-center pb-2">
					<div className="pb-2">
						<Button onClick={setCookies}>Save Settings</Button>
					</div>
					{renderBanner()}
				</div>
				<p>Your preferences are stored as&nbsp;
					<Link href="http://www.whatarecookies.com/">cookies</Link> on your computer.&nbsp;
					They are accessible to you and to you only. You can clear the cookies used by&nbsp;
					this site at any time by clicking the Clear Cookies button.
				</p>
			</div>
			<ReactTooltip />
		</div>
		);
}