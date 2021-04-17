import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, HorizontalLine } from 'components';
import { Br, Box, Pair } from 'components/Stats';
import { useAPIContext } from 'hooks';
import * as Utils from 'utils';
import { calculateNetworkLevel } from 'utils/hypixel';

/*
* Displays relevant Hypixel friend stats about the player in the Hypixel Context
*/
export function FriendsCard(props) {
	
	const { friends, player, mojang } = useAPIContext();
	const json = player || {};
	const networkLevel = calculateNetworkLevel(json.networkExp);

	return (
		<Card className="px-2 pt-1 pb-3 my-1">
			<div className="h-flex w-100 justify-content-center">
				<Box title="Hypixel Level" color="white">
					{Utils.formatNum(networkLevel)}
				</Box>
				<Box title="Karma" color="pink">
					{json.karma}
				</Box>
			</div>
			<HorizontalLine className="mb-3"/>
			<Pair title="Friends">{friends.length}</Pair>
			<Br />
			<Link to={`/player/${mojang.username}`}>
				<Button>
					<span className="font-bold">View Player Stats</span>
				</Button>
			</Link>
		</Card>
		);
}