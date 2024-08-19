import React, { memo } from 'react';
import { Accordion } from 'src/components';
import { Box, Br, Pair } from 'src/components/Stats';
import { WALLS as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';

/*
* Stats accordion for Walls
*
* @param {number} props.index    The order in which to display the row (used by react-beautiful-dnd)
*/
export const Walls = memo((props) => {
	
	const { player } = useAPIContext();
	const json = Utils.traverse(player, 'stats.Walls', {});
	const ratios = {
		kd: Utils.ratio(json.kills, json.deaths),
		wl: Utils.ratio(json.wins, json.losses),
	}

	const header = (
		<React.Fragment>
			<Box title="Kills">{json.kills}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{json.wins}</Box>
			<Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
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