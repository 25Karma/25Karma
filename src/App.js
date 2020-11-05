import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AppContextProvider } from 'contexts';
import { FrontPage, GuildPage, NotFoundPage, PlayerPage } from 'pages';

function App() {
	const pinnedPlayer = Cookies.get('pinnedPlayer');

	return (
		<AppContextProvider>
			<Router hashType="noslash">
				<Switch>
					<Route exact path="/">
						{ pinnedPlayer ? 
							<Redirect to={`/player/${pinnedPlayer}`} /> : 
							<Redirect to={`/frontpage`} /> 
						}
					</Route>
					<Route path="/frontpage"><FrontPage /></Route>
					<Route path="/player/:slug"><PlayerPage /></Route>
					<Route path="/guild/:slug"><GuildPage /></Route>
					<Route default><NotFoundPage /></Route>
				</Switch>
			</Router>
		</AppContextProvider>
		);
}

export default App;
