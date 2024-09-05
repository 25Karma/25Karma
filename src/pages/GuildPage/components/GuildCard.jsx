import React from 'react';
import reactStringReplace from 'react-string-replace';
import { Card, ExternalLink, GuildTag, HorizontalLine } from 'src/components';
import { Br, Pair, Progress, ProgressBar, Title } from 'src/components/Stats';
import { GUILD, HYPIXEL } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { HypixelLeveling } from 'src/utils/hypixel';

/**
 * The card on the left side of the page that contains info about the guild
 */
export function GuildCard() {
	const { guild } = useAPIContext();
	const hasTag = Boolean(guild.tag);
	const hasDesc = Boolean(guild.description);
	const preferredGames = guild.preferredGames || [];
	const achievements = guild.achievements || {};
	const gameXp = guild.guildExpByGameType || {};

	const leveling = new HypixelLeveling(xpToLevel, levelToXP, guild.exp);

	function xpToLevel(xp) {
		let xpRemaining = xp;
		let level = 0;
		let xpToLevelUp = GUILD.EXP[level];
		while (xpRemaining >= xpToLevelUp) {
			xpRemaining -= xpToLevelUp;
			level++;
			xpToLevelUp = GUILD.EXP[level > 14 ? 14 : level];
		}
		return level + xpRemaining/xpToLevelUp;
	}

	function levelToXP(lvl) {
		let xp = 0;
		for (let i = 0; i < lvl; i++) {
			xp += GUILD.EXP[i > 14 ? 14 : i];
		}
		return xp;
	}

	return (
		<Card className="p-2 pb-3">
			{hasTag && 
				<div className="w-100 text-center text-shadow mb-1">
					<GuildTag guild={guild} size="xl" />
				</div> 
			}
			{hasDesc && 
				<div className="w-100 mb-3">
					{reactStringReplace(
						guild.description,
						// Simpler and working regex pattern for matching URLs
						/(https?:\/\/[^\s/$.?#].[^\s]*)/g,
						(match, i) => <ExternalLink href={match} key={i}>{match}</ExternalLink>
					)}
				</div> 
			}
			{(hasTag || hasDesc) && <HorizontalLine className="mb-3" />}
			<div className="mb-1 font-bold">Leveling Progress</div>
			<div className="w-100 h-flex">
				<span className="pr-1">
					{leveling.levelFloor}
				</span>
				<div className="flex-1">
					<ProgressBar 
						dataTip={`${leveling.xpAboveLevel}/${leveling.levelTotalXP} GEXP`}>
						<Progress 
							proportion={leveling.proportionAboveLevel}
							color={guild.tagColor || 'white'}
							dataTip={`${leveling.xpAboveLevel}/${leveling.levelTotalXP} GEXP`} />
					</ProgressBar>
				</div>
				<span className="pl-1">
					{leveling.levelCeiling}
				</span>
			</div>
			<Br />
			<Pair title="Level">{leveling.level}</Pair>
			<Pair title="Created">{Utils.dateFormat(guild.created)}</Pair>
			<Pair title="Legacy Rank">{guild.legacyRanking !== undefined ? guild.legacyRanking+1 : '-'}</Pair>
			<Br />
			<Pair title="Members">{guild.members.length}</Pair>
			<Pair title="Publicly Listed">{guild.publiclyListed ? 'Yes' : 'No'}</Pair>
			<Pair title="Publicly Joinable">{guild.joinable ? 'Yes' : 'No'}</Pair>
			<Br />
			<Pair title="Preferred Games">
				{
					preferredGames.length > 0 ?
						preferredGames
						.map(g => HYPIXEL.GAMES[g])
						.filter(n => n)
						.sort()
						.join(', ')
						:
						'-'
				}
			</Pair>

			<HorizontalLine className="mt-3" />

			<Title>Achievements</Title>
			<Pair title="Experience Kings">{achievements.EXPERIENCE_KINGS}</Pair>
			<Pair title="Winners">{achievements.WINNERS}</Pair>
			<Pair title="Online Players">{achievements.ONLINE_PLAYERS}</Pair>

			{!Utils.isEmpty(gameXp) &&
				<React.Fragment>
					<HorizontalLine className="mt-3" />

					<Title>Experience</Title>
					{
						Object.entries(gameXp)
							.map(([k,v]) => [HYPIXEL.GAMES[k],v])
							.sort(([ka],[kb]) => ka > kb ? 1 : -1)
							.map(([k,v]) =>
								Boolean(k) && v !== 0 &&
								<Pair title={k} key={k}>{v}</Pair>
								)
					}
				</React.Fragment>
			}
		</Card>
		);
}