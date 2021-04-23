import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Cookies from 'js-cookie';
import { COOKIES, MAINTENANCE, PAGES } from 'constants/app';
import { APIContextProvider, AppContextProvider } from 'contexts';
import { FrontPage, MaintenancePage, NotFoundPage, SearchPage } from 'pages';

function App() {
	const pinnedPlayer = Cookies.get(COOKIES.pinnedPlayer);
	
	return (
		<AppContextProvider>
		<APIContextProvider>
			<Router basename={process.env.PUBLIC_URL}>
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
					{PAGES.map(p =>
						<Route key={p.path} path={`/${p.path}/:slug`}><p.component /></Route>
					)}
					<Route path="/frontpage">          <FrontPage />         </Route>
					<Route path="/search/:slug">       <SearchPage />        </Route>
					<Route default>                    <NotFoundPage />      </Route>
				</Switch>
			}
			</Router>
		</APIContextProvider>
		</AppContextProvider>
		);
}

export default App;