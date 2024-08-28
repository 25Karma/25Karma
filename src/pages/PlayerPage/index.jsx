import React from 'react';
import { FaSortAlphaDown } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { AccordionList, PageLayout, PageLoading, ReactIcon } from 'src/components';
import { PlayerCard, PlayerHeadline } from './components';
import * as Accordions from './components/Accordions';
import { COOKIES } from 'src/constants/app';
import { useAPIContext } from 'src/hooks';

/**
 * Page that displays the stats for an individual player
 * The assumption being that it is only called by App.js if the APIContext is not null
 */
export function PlayerPage() {
	const { slug } = useParams();
	const { success } = useAPIContext(slug, 'player');

	return (
		<PageLoading
		title={u => `${u}'s Stats`}
		loading={`Loading stats for ${slug}`}>
			{success &&
				// Conditionally rendered to prevent components from throwing an error due to missing API data
				<PageLayout
				searchbar
				top={<PlayerHeadline />}
				left={
					<React.Fragment>
						<div className="py-1 hidden"><ReactIcon icon={FaSortAlphaDown} /></div>
						<PlayerCard page="player" />
					</React.Fragment>
				}
				center={<AccordionList cookie={COOKIES.playerAccordions} accordionModule={Accordions} />}/>
			}

		</PageLoading>
	)
}