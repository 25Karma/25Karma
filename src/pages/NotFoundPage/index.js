import React from 'react';
import { Link } from 'react-router-dom';
import { MinecraftText, Navbar, PageLayout } from 'components';
import { APP } from 'constants/app';

/*
* 404 page
*/
export function NotFoundPage(props) {
	document.title = `Error 404 - ${APP.documentTitle}`;
	return (
		<PageLayout
			header={<Navbar />}
			top={
				<span className="text-shadow">
						<MinecraftText size="xxl">§cError 404</MinecraftText>
				</span>
			}
			center={
				<React.Fragment>
					<div className="font-md pb-4 text-center">
						<MinecraftText>§eThe page you were looking for §7fell into the void.</MinecraftText>
					</div>
					<Link to="/frontpage">
						<p className="link text-center">Take me back to the frontpage!</p>
					</Link>
				</React.Fragment>
			}/>
		);
}