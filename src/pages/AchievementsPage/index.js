import React from 'react';
import { LoadingSpinner, PageLayout } from 'components';

/*
* Page that displays the achievements of an individual player
*/
export function AchievementsPage(props) {
	return (
		<PageLayout 
		searchbar
		center={
			<div className="py-5">
				<LoadingSpinner text="The achievements page is still under development. Check back later"/>
			</div>
		} />
	);
}