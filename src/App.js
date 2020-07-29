import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import './App.css';
import { HypixelAPI, Navbar, PlayerStatsPage } from './components';
import key from './key.js';

function App() {

	const hypixelAPI = new HypixelAPI(key);

	const [playerData, setPlayerData] = useState(null);
	const [pageState, setPageState] = useState("idle");

	useEffect(() => {
		// Get params from URL
		var params = {};
		var vars = window.location.search.substr(1).split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			params[pair[0]] = decodeURIComponent(pair[1]);
		}
		if (params.player) {
			asyncSetPlayerData(params.player);
		}
	}, []);

	async function asyncSetPlayerData(player){
		setPageState("requested");
		let data = null;
		try {
			data = await hypixelAPI.getDataOfPlayer(player);
		} catch(e) {
			console.log(e);
			setPageState("failed");
			return;
		}
		setPlayerData(data);
		setPageState("received");
	}

	function renderBody() {
		if (pageState === "idle") {
			return (
				<div className="h-flex justify-content-center my-4">
					Enter a player name.
				</div>
				);
		}
		else if (pageState === "requested") {
			return (
				<div className="h-flex justify-content-center my-4">
					<ReactLoading type="spin" height="5rem" width="5rem"/>
				</div>
				);
		}
		else if (pageState === "failed") {
			return (
				<div className="h-flex justify-content-center my-4">
					API call failed.
				</div>
				);
		}
		else if (pageState === "received") {
			return (
				<PlayerStatsPage playerData={playerData} />
				);
		}
	}

	return (
		<div>
			<Navbar />
			<div className="container">
				{renderBody()}
			</div>
		</div>
		);
}

export default App;
