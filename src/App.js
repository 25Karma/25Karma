import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';
import Cookies from 'js-cookie';
import { COOKIES, MAINTENANCE } from 'constants/app';
import { APIContextProvider, AppContextProvider } from 'contexts';
import { FriendsPage, FrontPage, GuildPage, NotFoundPage, MaintenancePage,
	PlayerPage, SearchPage } from 'pages';

function App() {
	const pinnedPlayer = Cookies.get(COOKIES.pinnedPlayer);
	
	return (
		<AppContextProvider>
		<APIContextProvider>
			<Router hashType="noslash">
			{MAINTENANCE.enabled ?
				<Switch>
					<Route default><MaintenancePage /></Route>
				</Switch>
				:
				<Switch>
					<Route exact path="/">
						{ pinnedPlayer ? 
							<Redirect to={`/search/${pinnedPlayer}`} /> : 
							<Redirect to={`/frontpage`} /> 
						}
					</Route>
					<Route path="/frontpage"><FrontPage /></Route>
					<Route path="/search/:slug"><SearchPage /></Route>
					<Route path="/player/:slug"><PlayerPage /></Route>
					<Route path="/guild/:slug"><GuildPage /></Route>
					<Route path="/friends/:slug"><FriendsPage /></Route>
					<Route default><NotFoundPage /></Route>
				</Switch>
			}
			</Router>
		</APIContextProvider>
		</AppContextProvider>
		);
}

export default App;