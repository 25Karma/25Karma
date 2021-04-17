import React from 'react';
import { LoadingSpinner, PageLayout } from 'components';

/*
* Page that displays the quests of an individual player
*/
export function QuestsPage(props) {
	return (
		<PageLayout 
		searchbar
		center={
			<div className="py-5">
				<LoadingSpinner text="The quests page is still under development. Check back later"/>
			</div>
		} />
	);
}