import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, HorizontalLine } from 'src/components';
import { Box, Br, Pair } from 'src/components/Stats';
import { PETS } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { calculateNetworkLevel, isPet } from 'src/utils/hypixel';

/**
 * Displays general pets stats about the player
 */
export function PetsCard() {
	const { player = {}, mojang } = useAPIContext();
	const { petConsumables = {}, petJourneyTimestamp = 0, petStats = {} } = player;
	const networkLevel = calculateNetworkLevel(player.networkExp);

	const petList = Object.entries(petStats)
		.map(([k,v]) => isPet(v) ? {id: k, ...v} : false)
		.filter(n => n);

	let favoritePet = petList[0] || {};
	petList.forEach(pet => {
		if (pet.experience > favoritePet.experience) favoritePet = pet;
	})
	const favoritePetConstants = PETS.PETS[favoritePet.id] || {};
	const currentPetConstants = PETS.PETS[player.currentPet] || {};

	const missionStatus = (() => {
		const timeSince = Date.now() - petJourneyTimestamp;
		const minutesSince = timeSince / (60*1000);
		const minutesLeft = Math.ceil(60 - minutesSince);
		if (minutesLeft <= 0) {
			return {
				color: 'green',
				description: 'Ready!',
			}
		}
		else if (minutesLeft <= 10) {
			return {
				color: 'gold',
				description: `${minutesLeft} minutes`,
			}
		}
		else {
			return {
				color: 'red',
				description: `${minutesLeft} minutes`,
			}
		}
	})();

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

			<Pair title="Favourite Pet" color={PETS.RARITY[favoritePetConstants.rarity]}>
				{favoritePetConstants.name || favoritePet.id || 'N/A'}
			</Pair>
			<Pair title="Current Pet" color={PETS.RARITY[currentPetConstants.rarity]}>
				{currentPetConstants.name || player.currentPet || 'N/A'}
			</Pair>
			<Pair title="Active Pets">{petList.length}</Pair>
			<Br />
			<Pair title="Mission Cooldown" color={missionStatus.color}>{missionStatus.description}</Pair>
			{Boolean(petJourneyTimestamp) &&
				<Pair title="Last Mission">{Utils.dateFormat(petJourneyTimestamp)}</Pair>
			}

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