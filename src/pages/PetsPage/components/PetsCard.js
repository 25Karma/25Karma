import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, HorizontalLine } from 'components';
import { Box, Br, Pair } from 'components/Stats';
import { PETS } from 'constants/hypixel';
import { useAPIContext } from 'hooks';
import * as Utils from 'utils';
import { calculateNetworkLevel } from 'utils/hypixel';

/*
* Displays general pets stats about the player
*/
export function PetsCard(props) {
	const { player, mojang } = useAPIContext();
	const networkLevel = calculateNetworkLevel(player.networkExp);
	const petConsumables = Utils.traverse(player, 'petConsumables', {});

	return (
		<Card className="px-2 pt-1 pb-3 my-1">
			<div className="h-flex w-100 justify-content-center">
				<Box title="Hypixel Level" color="white">
					{Utils.formatNum(networkLevel)}
				</Box>
				<Box title="Karma" color="pink">
					{player.karma}
				</Box>
			</div>

			<HorizontalLine className="mb-3"/>

			<HorizontalLine className="my-3"/>

			{PETS.CONSUMABLES.map(c => 
				<React.Fragment key={c.id}>
					<Pair title={c.name}>{petConsumables[c.id]}</Pair>
					{['MAGMA_CREAM', 'LAVA_BUCKET'].includes(c.id) && <Br />}
				</React.Fragment>
			)}

			<HorizontalLine className="my-3"/>

			<Link to={`/player/${mojang.username}`}>
				<Button>
					<span className="font-bold">View Player Stats</span>
				</Button>
			</Link>
			
		</Card>
	);
}