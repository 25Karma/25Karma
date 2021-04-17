import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';
import Cookies from 'js-cookie';
import { COOKIES, MAINTENANCE } from 'constants/app';
import { APIContextProvider, AppContextProvider } from 'contexts';
import * as Page from 'pages';

function App() {
	const pinnedPlayer = Cookies.get(COOKIES.pinnedPlayer);
	
	return (
		<AppContextProvider>
		<APIContextProvider>
			<Router hashType="noslash">
			{MAINTENANCE.enabled ?
				<Switch>
					<Route default><Page.MaintenancePage /></Route>
				</Switch>
				:
				<Switch>
					<Route exact path="/">
						{ pinnedPlayer ? 
							<Redirect to={`/search/${pinnedPlayer}`} /> : 
							<Redirect to={`/frontpage`} /> 
						}
					</Route>
					<Route path="/achievements/:slug"> <Page.AchievementsPage />  </Route>
					<Route path="/friends/:slug">      <Page.FriendsPage />       </Route>
					<Route path="/frontpage">          <Page.FrontPage />         </Route>
					<Route path="/guild/:slug">        <Page.GuildPage />         </Route>
					<Route path="/pets/:slug">         <Page.PetsPage />          </Route>
					<Route path="/player/:slug">       <Page.PlayerPage />        </Route>
					<Route path="/quests/:slug">       <Page.QuestsPage />        </Route>
					<Route path="/search/:slug">       <Page.SearchPage />        </Route>
					<Route default>                    <Page.NotFoundPage />      </Route>
				</Switch>
			}
			</Router>
		</APIContextProvider>
		</AppContextProvider>
		);
}

export default App;