import React from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout, PageLoading } from 'src/components';
import { FriendsCard, FriendsHeadline, FriendsList } from './components';
import { useAPIContext } from 'src/hooks';

/**
 * Page that displays the friends of an individual player
 */
export function FriendsPage() {
	const { slug } = useParams();
	const { success } = useAPIContext(slug, 'friends');
	
	return (
		<PageLoading
		title={u => `${u}'s Friends`}
		loading={`Loading ${slug}'s friends`}>
			{success &&
				// Conditionally rendered to prevent components from throwing an error due to missing API data
				<PageLayout 
				searchbar
				top={<FriendsHeadline />}
				left={<FriendsCard />}
				center={<FriendsList />} />
			}
		</PageLoading>
	);
}