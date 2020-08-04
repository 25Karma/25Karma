import React from 'react';
import { Link } from 'react-router-dom';
import { MinecraftText, Navbar } from 'components';

/*
* 404 page
*/
export function NotFoundPage(props) {
	return (
		<div>
			<Navbar />
			<div className="container my-4 v-flex align-items-center">
				<div className="text-shadow pb-2">
					<MinecraftText font="xl">§cError 404</MinecraftText>
				</div>
				<div className="font-md pb-4">
					<MinecraftText>§eThe page you were looking for §7fell into the void.</MinecraftText>
				</div>
				<Link to="/frontpage">
					<p className="link">Take me back to the frontpage!</p>
				</Link>
			</div>
		</div>
		);
}