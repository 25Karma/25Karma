import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Cookies from 'js-cookie';
import { COOKIES, MAINTENANCE, PAGES } from 'src/constants/app';
import { APIContextProvider, AppContextProvider } from 'src/contexts';
import { FrontPage, MaintenancePage, NotFoundPage, SearchPage } from 'src/pages';

function App() {
	const pinnedPlayer = Cookies.get(COOKIES.pinnedPlayer);
	
	return (
		<AppContextProvider>
			<APIContextProvider>
				<Router basename={import.meta.env.BASE_URL}>
					{MAINTENANCE.enabled ?
						<Routes>
							<Route default element={<MaintenancePage />}></Route>
						</Routes>
						:
						<Routes>
							<Route exact path="/" element={<Navigate replace to={pinnedPlayer ? `/search/${pinnedPlayer}` : '/frontpage'} />}></Route>
							{PAGES.map(p => <Route key={p.path} path={`/${p.path}/:slug`} element={<p.component />}></Route>)}
							<Route path="/frontpage" element={<FrontPage />}></Route>
							<Route path="/search/:slug" element={<SearchPage />}></Route>
							<Route path="*" element={<NotFoundPage />}></Route>
						</Routes>
					}
				</Router>
			</APIContextProvider>
		</AppContextProvider>
		);
}

export default App;