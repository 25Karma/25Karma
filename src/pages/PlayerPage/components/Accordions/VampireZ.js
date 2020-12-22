import React, { memo } from 'react';
import { Accordion } from 'components';
import { Box, Br, Pair } from 'components/Stats';
import { VAMPIREZ as consts } from 'constants/hypixel';
import { useAPIContext } from 'hooks';
import * as Utils from 'utils';

/*
* Stats accordion for VampireZ
*
* @param {number} props.index    The order in which to display the row (used by react-beautiful-dnd)
*/
export const VampireZ = memo((props) => {
	
	const { player } = useAPIContext();
	const json = Utils.traverse(player, 'stats.VampireZ', {});
	const ratios = {
		kdv: Utils.ratio(json.human_kills, json.vampire_deaths),
		kdh: Utils.ratio(json.vampire_kills, json.human_deaths),
	}

	const header = (
		<React.Fragment>
			<Box title="Vampire KD">{ratios.kdv}</Box>
			<Box title="Human KD">{ratios.kdh}</Box>
			<Box title="Vampire Wins">{json.vampire_wins}</Box>
			<Box title="Human Wins">{json.human_wins}</Box>
		</React.Fragment>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="mt-3">
				<Pair title="Coins" color="gold">{json.coins}</Pair>
			</div>
			<div className="h-flex mt-2 mb-3">
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