import React from 'react';
import { FaSortAlphaDown } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { AccordionList, PageLayout, ReactIcon, PageLoading } from 'src/components';
import { QuestsAccordions, QuestsCard, QuestsHeadline } from './components';
import { COOKIES } from 'src/constants/app';
import { useAPIContext } from 'src/hooks';

/**
 * Page that displays the quests of an individual player
 */
export function QuestsPage() {
	const { slug } = useParams();
	const { success } = useAPIContext(slug, 'quests');

	return (
		<PageLoading
		title={u => `${u}'s Quests`}
		loading={`Loading stats for ${slug}'s quests`}>
			{success && 
				// Conditionally rendered to prevent components from throwing an error due to missing API data
				<PageLayout 
				searchbar
				top={<QuestsHeadline />}
				left={
					<React.Fragment>
						<div className="py-1 hidden"><ReactIcon icon={FaSortAlphaDown} /></div>
						<QuestsCard />
					</React.Fragment>
				}
				center={<AccordionList cookie={COOKIES.questsAccordions} accordionModule={QuestsAccordions} />}/>
			}
		</PageLoading>
	);
}