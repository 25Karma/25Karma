import React, { memo } from 'react';
import { Accordion } from 'src/components';
import { Box, Br, Pair, Progress, ProgressBar } from 'src/components/Stats';
import { VAMPIREZ as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { findPrefix, calculatePrefixProgression, formatPrefix } from 'src/utils/hypixel';

/**
 * Stats accordion for VampireZ
 *
 * @param {number} props.index    The order in which to display the row (used by the dnd package)
 */
export const VampireZ = memo((props) => {
	
	const { player } = useAPIContext();
	const json = Utils.traverse(player, 'stats.VampireZ', {});
	const ratios = {
		kdv: Utils.ratio(json.human_kills, json.vampire_deaths),
		kdh: Utils.ratio(json.vampire_kills, json.human_deaths),
	}

	const humanWins = Utils.default0(json.human_wins);
	const humanKills = Utils.default0(json.human_kills);

	const { prefix: humanPrefix } = findPrefix(consts.HUMAN_PREFIXES, humanWins);
	const humanProgression = calculatePrefixProgression(consts.HUMAN_PREFIXES, humanWins);

	const { prefix: vampirePrefix } = findPrefix(consts.VAMPIRE_PREFIXES, humanKills);
	const vampireProgression = calculatePrefixProgression(consts.VAMPIRE_PREFIXES, humanKills);

	const formattedHumanPrefix = formatPrefix({
		prefixes: consts.HUMAN_PREFIXES,
		score: humanWins,
		trueScore: true
	});

	const formattedVampirePrefix = formatPrefix({
		prefixes: consts.VAMPIRE_PREFIXES,
		score: humanKills,
		trueScore: true
	});

	const header = (
		<React.Fragment>
			<Box title="Human">{formattedHumanPrefix}</Box>
			<Box title="Vampire">{formattedVampirePrefix}</Box>
			<Box title="Vampire KD">{ratios.kdv}</Box>
			<Box title="Human KD">{ratios.kdh}</Box>
			<Box title="Vampire Wins">{json.vampire_wins}</Box>
			<Box title="Human Wins">{json.human_wins}</Box>
		</React.Fragment>
		);

	const humanPrefixProgress = (
		<React.Fragment>
			<div className="flex-1">
				<ProgressBar dataTip={`${humanWins}/${humanProgression.next} Human Wins`}>
					<Progress
						proportion={humanProgression.progressProportion}
						color={humanPrefix.color === 'rainbow' ? 'gold' : humanPrefix.color}
						dataTip={`${humanWins}/${humanProgression.next} Human Wins`} />
				</ProgressBar>
			</div>
			{!humanProgression.isMaxed && (
				<span className={`px-1 c-${consts.HUMAN_PREFIXES[findPrefix(consts.HUMAN_PREFIXES, humanWins).index + 1]?.color === 'rainbow' ? 'gold' : consts.HUMAN_PREFIXES[findPrefix(consts.HUMAN_PREFIXES, humanWins).index + 1]?.color || 'gold'}`}>
					[{humanProgression.next}]
				</span>
			)}
		</React.Fragment>
	);

	const vampirePrefixProgress = (
		<React.Fragment>
			<div className="flex-1">
				<ProgressBar dataTip={`${humanKills}/${vampireProgression.next} Human Kills`}>
					<Progress
						proportion={vampireProgression.progressProportion}
						color={vampirePrefix.color === 'rainbow' ? 'gold' : vampirePrefix.color}
						dataTip={`${humanKills}/${vampireProgression.next} Human Kils`} />
				</ProgressBar>
			</div>
			{!vampireProgression.isMaxed && (
				<span className={`px-1 c-${consts.VAMPIRE_PREFIXES[findPrefix(consts.VAMPIRE_PREFIXES, humanKills).index + 1]?.color === 'rainbow' ? 'gold' : consts.VAMPIRE_PREFIXES[findPrefix(consts.VAMPIRE_PREFIXES, humanKills).index + 1]?.color || 'gold'}`}>
					[{Utils.formatNum(vampireProgression.next)}]
				</span>
			)}
		</React.Fragment>
	);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="mb-3">
				<div className="mb-1 font-bold">Human Prefix Progress</div>
				<div className="h-flex">
					{humanPrefixProgress}
				</div>
			</div>
			<div className="mb-3">
				<div className="mb-1 font-bold">Vampire Prefix Progress</div>
				<div className="h-flex">
					{vampirePrefixProgress}
				</div>
			</div>
			<Pair title="Coins" color="gold">{json.coins}</Pair>
			<div className="h-flex mt-2">
				<div className="flex-1">
					<Pair title="Wins as Vampire">{json.vampire_wins}</Pair>
					<Br />
					<Pair title="Vampire Kills">{json.vampire_kills}</Pair>
					<Pair title="Deaths as Vampire">{json.vampire_deaths}</Pair>
					<Pair title="Kill/Death Ratio as Vampire">{ratios.kdv}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Wins as Human">{json.human_wins}</Pair>
					<Br />
					<Pair title="Human Kills">{json.human_kills}</Pair>
					<Pair title="Deaths as Human">{json.human_deaths}</Pair>
					<Pair title="Kill/Death Ratio as Human">{ratios.kdh}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Zombie Kills">{json.zombie_kills}</Pair>
				</div>
			</div>
		</Accordion>
});