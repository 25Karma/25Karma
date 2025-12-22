import React, { memo } from 'react';
import { Accordion } from 'src/components';
import { Box, Br, Pair, Progress, ProgressBar } from 'src/components/Stats';
import { WALLS as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { findPrefix, calculatePrefixProgression, colorToCode, rainbow } from 'src/utils/hypixel';

/**
 * Stats accordion for Walls
 *
 * @param {number} props.index    The order in which to display the row (used by the dnd package)
 */
export const Walls = memo((props) => {
	
	const { player } = useAPIContext();
	const json = Utils.traverse(player, 'stats.Walls', {});
	const ratios = {
		kd: Utils.ratio(json.kills, json.deaths),
		wl: Utils.ratio(json.wins, json.losses),
	}

	const wins = Utils.default0(json.wins);
	const { prefix } = findPrefix(consts.PREFIXES, wins);
	const progression = calculatePrefixProgression(consts.PREFIXES, wins);

	const formatPrefix = (score) => {
		if (prefix.color === 'rainbow') {
			return rainbow(`[${score}]`);
		}
		const colorCode = colorToCode(prefix.color);
		const bold = prefix.bold ? '§l' : '';
		return `${colorCode}${bold}[${score}]`;
	};

	const formattedPrefix = formatPrefix(wins);

	const header = (
		<React.Fragment>
			<Box title="Prefix">{formattedPrefix}</Box>
			<Box title="Kills">{json.kills}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{json.wins}</Box>
			<Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
		);

	const prefixProgress = (
		<React.Fragment>
			<div className="flex-1">
				<ProgressBar dataTip={`${wins}/${progression.next} Wins`}>
					<Progress
						proportion={progression.progressProportion}
						color={prefix.color === 'rainbow' ? 'gold' : prefix.color}
						dataTip={`${wins}/${progression.next} Wins`} />
				</ProgressBar>
			</div>
			{!progression.isMaxed && (
				<span className={`px-1 c-${consts.PREFIXES[findPrefix(consts.PREFIXES, wins).index + 1]?.color || 'gold'}`}>
					[{progression.next}]
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
			<Pair title="Coins" color="gold">{json.coins}</Pair>
			<Br />
			<Pair title="Kills">{json.kills}</Pair>
			<Pair title="Deaths">{json.deaths}</Pair>
			<Pair title="Kill/Death Ratio">{ratios.kd}</Pair>
			<Br />
			<Pair title="Wins">{json.wins}</Pair>
			<Pair title="Losses">{json.losses}</Pair>
			<Pair title="Win/Loss Ratio">{ratios.wl}</Pair>
		</Accordion>
});