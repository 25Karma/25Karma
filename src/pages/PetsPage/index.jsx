import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, PageLayout, PageLoading } from 'src/components';
import { PetsCard, PetsHeadline, PetsList } from './components';
import { APP } from 'src/constants/app';
import { useAPIContext, useAppContext } from 'src/hooks';

/**
 * Page that displays the pets of an individual player
 */
export function PetsPage() {
	const { slug } = useParams();
	const { success, mojang } = useAPIContext(slug, 'pets');
	const { setBanner } = useAppContext();

	useEffect(() => {
		if (success) {
			setBanner({
				style: 'info',
				description: (
					<span>
						This page is about the cosmetic Hypixel Network pets. For SkyBlock pets, go
						to <ExternalLink href={`${APP.skyblockUrl}/${mojang.uuid}`}>SkyCrypt</ExternalLink>.
					</span>
				),
				expire: true
			})
		}
	}, [setBanner, success, mojang]);

	return (
		<PageLoading
		title={u => `${u}'s Pets`}
		loading={`Loading stats for ${slug}'s pets`}>
			{success && 
				// PageLayout is conditionally rendered to prevent components from throwing an error due to missing API data
				<PageLayout 
				searchbar
				top={<PetsHeadline />}
				left={<PetsCard />} 
				center={<PetsList />} />
			}
		</PageLoading>
	);
}