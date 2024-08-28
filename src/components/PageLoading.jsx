import React from 'react';
import { LoadingSpinner, PageLayout } from 'src/components';
import { APP } from 'src/constants/app';
import { useAPIContext } from 'src/hooks';
import { FrontPage } from 'src/pages';
import { pushToRecentSearches } from 'src/utils';

/**
 * PageLayout wrapper for pages that specifically load and display stats from the 25Karma API
 *
 * @param {Function} props.title    The title to be displayed on the page tab, should accept the player's username as its sole argument
 * @param {string} props.loading    The text to be displayed when waiting for the API response
 * @param {JSX} props.children      What to render on successful API call (should be a PageLayout component)
 */
export function PageLoading({ title, loading, children }) {
	const context = useAPIContext();

	const loadingPageLayout = (
		<PageLayout
		searchbar
		center={
			<div className="py-5">
				<LoadingSpinner text={loading} />
			</div>
		}/>
	);

	switch(context.success) {
		case true:
			document.title = `${title(context.mojang.username)} - ${APP.documentTitle}`;
			// Log the player into recentSearches cookie
			pushToRecentSearches(context.mojang.username);
			return children  || loadingPageLayout;
		case false:
			return <FrontPage config={context} />
		default:
			document.title = `Loading... - ${APP.documentTitle}`;
			return loadingPageLayout;
	}
}