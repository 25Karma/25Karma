import React from 'react';
import LazyLoad from 'react-lazyload';
import { MinecraftText, SortableList } from 'src/components';
import { Progress, ProgressBar } from 'src/components/Stats';
import { PETS } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { HypixelLeveling, isPet } from 'src/utils/hypixel';

/**
 * The sortable list of pets displayed at the center of the page
 */
export function PetsList() {
	const { player } = useAPIContext();
	const petStats = player.petStats || {};
	const petList = Object.entries(petStats)
		.map(([k,v]) => isPet(v) ? preparePetData(k,v) : null)
		.filter(n => n);

	function preparePetData(petId, petData) {
		const petConstants = PETS.PETS[petId] || {};
		const name = petData.name || '';
		const mob = Utils.isEmpty(petConstants) ? petId : petConstants.name;
		return {
			id: petId,
			...petData,
			name,
			cleanName: name.replace(/§./g, ''),
			mob,
			hunger: happinessValueOf(petData.HUNGER),
			thirst: happinessValueOf(petData.THIRST),
			exercise: happinessValueOf(petData.EXERCISE),
		}
	}

	function petLeveling(petExp) {
		function expToLevel(exp) {
			let expRemaining = exp;
			let level = 1;
			while (expRemaining >= PETS.EXP[level+1]) {
				level++;
				expRemaining -= PETS.EXP[level];
			}
			return level + (expRemaining/PETS.EXP[level+1]);
		}
		function levelToExp(lvl) {
			let exp = 0;
			for (let i = 1; i <= lvl; i++) {
				exp += PETS.EXP[i];
			}
			return exp;
		}
		return new HypixelLeveling(expToLevel, levelToExp, Utils.default0(petExp))
	}

	function happinessValueOf(json) {
		if (json === undefined) return 0;
		const initialValue = json.value;
		const minutesSince = ( Date.now() - json.timestamp ) / (60*1000);
		return Math.max( initialValue-Math.floor(minutesSince/5), 0 );
	}

	function happinessColor(happinessValue) {
		for (const h of PETS.HAPPINESS) {
			if (happinessValue >= h.value) {
				return h.color;
			}
		}
	}

	function sortByExp(petList, polarity) {
		return petList.sort((a,b) => Utils.default0(a.experience) < Utils.default0(b.experience) ? polarity : -polarity);
	}

	function sortByName(petList, polarity) {
		return petList.sort((a,b) => {
			const aName = a.cleanName || a.mob;
			const bName = b.cleanName || b.mob;
			return aName.toLowerCase() > bName.toLowerCase() ? polarity : -polarity;
		});
	}

	return (
		<SortableList headers={[
			{title: 'Level', sortHandler: sortByExp, initial: true},
			{title: 'Name', sortHandler: sortByName},
			{title: 'Hunger'},
			{title: 'Thirst'},
			{title: 'Exercise'},
		]}
		items={petList}>
		{(pet) => {
			const petConstants = PETS.PETS[pet.id] || {};
			const rarityColor = PETS.RARITY[petConstants.rarity] || '';
			const lvl = petLeveling(pet.experience);
			return (
				<tr key={pet.id}>
					<td className="td-shrink">
						<MinecraftText>{`§8Lv§7${('000'+lvl.levelFloor.toString()).slice(-3)}`}</MinecraftText>
					</td>
					<td>
						<p className="pb-1">
						{pet.cleanName &&
							<MinecraftText className="pr-2">{`${pet.name}`}</MinecraftText>
						}
							<span className={`c-${rarityColor}`}>{pet.mob}</span>
						</p>
						<LazyLoad once>
							<ProgressBar>
								{lvl.levelFloor === 100 ?
									<Progress proportion="1" color={rarityColor}>Max level!</Progress>
									:
									<Progress proportion={lvl.proportionAboveLevel} color={rarityColor}>
										{`${lvl.xpAboveLevel}/${lvl.levelTotalXP} EXP`}
									</Progress>
								}
							</ProgressBar>
						</LazyLoad>
					</td>
					<td className="td-shrink">
						<MinecraftText>{`${happinessColor(pet.hunger)}${pet.hunger}`}</MinecraftText>
						<p className="pt-1">{petConstants.food}&nbsp;</p>
					</td>
					<td className="td-shrink">
						<MinecraftText>{`${happinessColor(pet.thirst)}${pet.thirst}`}</MinecraftText>
						<p className="pt-1">{petConstants.drink}&nbsp;</p>
					</td>
					<td className="td-shrink">
						<MinecraftText>{`${happinessColor(pet.exercise)}${pet.exercise}`}</MinecraftText>
						<p className="pt-1">{petConstants.exercise}&nbsp;</p>
					</td>
				</tr>
			);
		}}
		</SortableList>
	)
}