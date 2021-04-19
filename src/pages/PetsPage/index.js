import React from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout, PageLoading } from 'components';
import { PetsCard, PetsHeadline } from './components';
import { useAPIContext } from 'hooks';

/*
* Page that displays the pets of an individual player
*/
export function PetsPage(props) {
	const { slug } = useParams();
	const { success } = useAPIContext(slug, 'pets');

	return (
		<PageLoading
		title={u => `${u}'s Pets`}
		loading={`Loading stats for ${slug}'s pets`}>
			{success && 
				// PageLayout is conditionally rendered to prevent components from throwing an error due to missing API data
				<PageLayout 
				searchbar
				top={<PetsHeadline />}
				left={<PetsCard />} />
			}
		</PageLoading>
	);
}