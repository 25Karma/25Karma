import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Footer } from 'components';
import { FrontPage, NotFoundPage, PlayerPage } from 'pages';

function App() {
	const pinnedPlayer = Cookies.get('pinnedPlayer');

	// Set dark/light theme of page - dark by default
	const theme = Cookies.get('theme');
	if (theme === 'light') {

	}
	
	return (
		<div className="h-100 v-flex">
			<div className="flex-1">
				<Switch>
					<Route exact path="/">
						{ pinnedPlayer ? <Redirect to={`/player/${pinnedPlayer}`} /> : <FrontPage />  }
					</Route>
					<Route path="/frontpage" component={FrontPage} />
					<Route path="/player/:username" component={PlayerPage} />
					<Route default component={NotFoundPage}/>
				</Switch>
			</div>
			<Footer />
		</div>
		);
}

export default App;
