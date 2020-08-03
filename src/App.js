import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Footer, FrontPage, PlayerStatsPage } from './components';

function App() {
	
	const pinnedPlayer = Cookies.get('pinnedPlayer');

	return (
		<div className="h-100 v-flex">
			<div className="flex-1">
				<Switch>
					<Route path="/" component={FrontPage} exact>
						{ pinnedPlayer ? <Redirect to={`/player/${pinnedPlayer}`} /> : <FrontPage />  }
					</Route>
					<Route path="/frontpage" component={FrontPage} />
					<Route path="/player/:playername" component={PlayerStatsPage} />
				</Switch>
			</div>
			<Footer />
		</div>
		);
}

export default App;
