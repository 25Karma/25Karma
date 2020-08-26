import React from 'react';
import { FaSortAlphaDown } from 'react-icons/fa';
import { AccordionList, LoadingSpinner, Navbar, PageLayout, 
	PlayerCard, PlayerHeadline, ReactIcon } from 'components';
import { FrontPage } from 'pages';
import { useHypixelContext } from 'hooks';

/*
* Page that displays the stats for an individual player
* The assumption being that it is only called by App.js if player is not null
*/
export function PlayerPage(props) {
	const context = useHypixelContext();

	/*
	* Loads different JSX depending on the states
	*/
	if (context.success === false) {
		const config = {
			...context,
			player: context.slug,
		}
		return <FrontPage config={config} />
	}
	else {
		return (
			<PageLayout
				header={<Navbar searchbar />}
				top={context.success && <PlayerHeadline />}
				left={context.success && 
					<React.Fragment>
						<div className="py-1 hidden"><ReactIcon icon={FaSortAlphaDown} /></div>
						<PlayerCard />
					</React.Fragment>
				}
				center={
					context.success ? 
					<AccordionList />
					:
					<div className="py-5">
						<LoadingSpinner text={`Loading stats for ${context.slug}`} />
					</div>
				}/>
			);
	}
}
