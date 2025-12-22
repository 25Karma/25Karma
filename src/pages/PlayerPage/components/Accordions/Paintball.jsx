import React, { memo } from 'react';
import { Accordion } from 'src/components';
import { Box, Pair, Progress, ProgressBar } from 'src/components/Stats';
import { PAINTBALL as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { findPrefix, calculatePrefixProgression, colorToCode, abbreviateNumber } from 'src/utils/hypixel';

/**
 * Stats accordion for Paintball
 *
 * @param {number} props.index    The order in which to display the row (used by the dnd package)
 */
export const Paintball = memo((props) => {
	
	const { player } = useAPIContext();
	const json = Utils.traverse(player, 'stats.Paintball', {});
	const ratios = {
		kd: Utils.ratio(json.kills, json.deaths),
		sk: Utils.ratio(json.shots_fired, json.kills),
	}

	const totalKills = Utils.default0(json.kills);
	const { prefix } = findPrefix(consts.PREFIXES, totalKills);
	const progression = calculatePrefixProgression(consts.PREFIXES, totalKills);

	const formatPrefix = (score) => {
		const colorCode = colorToCode(prefix.color);
		const abbreviated = abbreviateNumber(score);
		return `${colorCode}[${abbreviated}]`;
	};

	const formattedPrefix = formatPrefix(totalKills);

	const header = (
		<React.Fragment>
			<Box title="Prefix">{formattedPrefix}</Box>
			<Box title="Kills">{json.kills}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{json.wins}</Box>
		</React.Fragment>
		);

	const prefixProgress = (
		<React.Fragment>
			<div className="flex-1">
				<ProgressBar dataTip={`${Utils.formatNum(totalKills)}/${Utils.formatNum(progression.next)} Kills`}>
					<Progress
						proportion={progression.progressProportion}
						color={prefix.color}
						dataTip={`${Utils.formatNum(totalKills)}/${Utils.formatNum(progression.next)} Kills`} />
				</ProgressBar>
			</div>
			{!progression.isMaxed && (
				<span className={`px-1 c-${consts.PREFIXES[findPrefix(consts.PREFIXES, totalKills).index + 1]?.color || 'gold'}`}>
					[{abbreviateNumber(progression.next)}]
				</span>
			)}
		</React.Fragment>
	);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="mb-3">
				<div className="mb-1 font-bold">Prefix Progress</div>
				<div className="h-flex">
					{prefixProgress}
				</div>
			</div>
			<div className="h-flex">
				<div className="flex-1">
					<Pair title="Coins" color="gold">{json.coins}</Pair>
					<Pair title="Wins">{json.wins}</Pair>
					<Pair title="Force Field Time">{Utils.secondsToHms(json.forcefieldTime)}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Kills">{json.kills}</Pair>
					<Pair title="Deaths">{json.deaths}</Pair>
					<Pair title="Kill/Death Ratio">{ratios.kd}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Killstreaks">{json.killstreaks}</Pair>
					<Pair title="Shots Fired">{json.shots_fired}</Pair>
					<Pair title="Shot/Kill Ratio">{ratios.sk}</Pair>
				</div>
			</div>
		</Accordion>
});