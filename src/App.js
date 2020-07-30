import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './App.css';
import { Banner, Link, FrontPage, LoadingPage, PlayerStatsPage } from './components';
import * as Utils from './utils';
import p from './properties.js';
import key from './key.js';

function App() {

	const hypixelAPI = new Utils.HypixelAPI(key);
	const params = new URL(window.location.href).searchParams;

	const [playerData, setPlayerData] = useState(null);
	const [pageState, setPageState] = useState("idle");

	useEffect(() => {
		if (params.get('player')) {
			asyncSetPlayerData(params.get('player'));
		}
	}, []);

	async function asyncSetPlayerData(player){
		setPageState("requested");
		let data = null;
		try {
			data = await hypixelAPI.getDataOfPlayer(player);
		} catch(e) {
			setPageState("failed");
			return;
		}
		setPlayerData(data);
		setPageState("received");
	}

	function render() {
		if (params.get('player')) {
			return renderPlayerStats();
		}
		if (params.get('redirect') === "false") {
			return <FrontPage />;
		}
		Utils.searchForPlayer(Cookies.get('pinnedPlayer'));
		return <FrontPage />;		
	}

	function renderPlayerStats() {
		if (pageState === "requested") {
			return <LoadingPage player={params.get('player')} />;
		} 
		if (pageState === "failed") {
			const banner = (
				<Banner type="error"
					title='API call failed. '
					description='The site failed to fetch from the Hypixel API.'/>
				);
			return <FrontPage banner={banner} />
		}
		if (pageState === "received") {
			if (playerData === null) {
				const banner = <Banner type="error"
					title='Player not found. '
					description={`Could not find a player with the name "${params.get('player')}".`}/>
				return <FrontPage banner={banner} />
			}
			return <PlayerStatsPage playerData={playerData} />;
		}
	}

	return (
		<div className="h-100 v-flex">
			<div className="flex-1">
				{render()}
			</div>
			<div className="p-1 footer">
				<small>
					Powered by the&nbsp;
					<Link href={p.hypixelAPIURL}>{p.hypixelAPI}</Link>. 
					Hosted on&nbsp;
					<Link href={p.gitHubURL}>{p.gitHubName}</Link>.
				</small>
				<small>
					Made with ❤️ by&nbsp;
					<Link href={p.authorURL}>{p.author}</Link>.
				</small>
			</div>
		</div>
		);
}

export default App;
