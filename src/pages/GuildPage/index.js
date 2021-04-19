import React from 'react';
import { useParams } from 'react-router-dom';
import { MinecraftText, PageLayout, PageLoading } from 'components';
import { GuildCard, GuildMemberList } from './components';
import { useAPIContext } from 'hooks';
import * as Utils from 'utils';

/*
* Page that displays the stats of a guild
*/
export function GuildPage(props) {
	const { slug } = useParams();
	const { guild, success } = useAPIContext(slug, 'guild');
	
	return (
		<PageLoading
		title={u => `${u}'s Guild`}
		loading={`Loading stats for ${slug}'s guild`}>
			{success &&
				// Conditionally rendered to prevent components from throwing an error due to missing API data
				<PageLayout
				searchbar
				top={
					<MinecraftText size="xl" className="px-2 text-shadow">
						{`${Utils.toColorCode(guild.tagColor || 'gray')}${guild.name}`}
					</MinecraftText>
				} 
				left={<GuildCard />}
				center={<GuildMemberList />} />
			}
		</PageLoading>
	);
}