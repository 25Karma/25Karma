import React from 'react';
import { FaSortAlphaDown } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { AccordionList, PageLayout, PageLoading, ReactIcon } from 'src/components';
import { AchievementsAccordions, AchievementsCard, AchievementsHeadline } from './components';
import { COOKIES } from 'src/constants/app';
import {useAPIContext } from 'src/hooks';

/**
 * Page that displays the achievements of an individual player
 */
export function AchievementsPage() {
	const { slug } = useParams();
	const { success } = useAPIContext(slug, 'achievements');

	return (
		<PageLoading
		title={u => `${u}'s Achievements`}
		loading={`Loading stats for ${slug}'s achievements`}>
			{success && 
				// Conditionally rendered to prevent components from throwing an error due to missing API data
				<PageLayout 
				searchbar
				top={<AchievementsHeadline />}
				left={
					<React.Fragment>
						<div className="py-1 hidden"><ReactIcon icon={FaSortAlphaDown} /></div>
						<AchievementsCard />
					</React.Fragment>
				}
				center={<AccordionList cookie={COOKIES.achievementsAccordions} accordionModule={AchievementsAccordions} />}/>
			}
		</PageLoading>
	);
}