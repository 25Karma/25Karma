import React, { memo } from 'react';
import { Accordion } from 'components';
import { Box, Br, Pair } from 'components/Stats';
import { WALLS as consts } from 'constants/hypixel';
import { useAPIContext } from 'hooks';
import * as Utils from 'utils';

/*
* Stats accordion for Walls
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
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
			<Box title="KD">{ratios.kd}</Box>
			<Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="my-3">
				<Pair title="Coins" color="gold">{json.coins}</Pair>
				<Br />
				<Pair title="Kills">{json.kills}</Pair>
				<Pair title="Deaths">{json.deaths}</Pair>
				<Pair title="Kill/Death Ratio">{ratios.kd}</Pair>
				<Br />
				<Pair title="Wins">{json.wins}</Pair>
				<Pair title="Losses">{json.losses}</Pair>
				<Pair title="Win/Loss Ratio">{ratios.wl}</Pair>
			</div>
		</Accordion>
});