import React from 'react';
import { LoadingSpinner, PageLayout } from 'components';

/*
* Page that displays the pets of an individual player
*/
export function PetsPage(props) {
	return (
		<PageLayout 
		searchbar
		center={
			<div className="py-5">
				<LoadingSpinner text="The pets page is still under development. Check back later"/>
			</div>
		} />
	);
}