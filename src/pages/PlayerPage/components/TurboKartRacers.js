import React from 'react';
import { Accordion, Box, StatPair } from 'components';
import * as Utils from 'utils';

/*
* Stats accordion for Turbo Kart Racers
*
* @param {Object} props.player 	Player data in JSON object
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export function TurboKartRacers(props) {
	const consts = {
		ATTRIBUTES: {
			ACCELERATION: 'Acceleration',
			BOOSTER_SPEED: 'Booster Speed',
			BRAKES: 'Brakes',
			DRIFTING_EFFICIENCY: 'Drifting Efficiency',
			HANDLING: 'Handling',
			RECOVERY: 'Recovery',
			START_POSITION: 'Start Position',
			TOP_SPEED: 'Top Speed',
			TRACTION: 'Traction',
		},
		QUALITY: [
			{name: 'Starter', color: 'gray'},
			{name: 'Mini', color: 'gray'},
			{name: 'Auxillary', color: 'green'},
			{name: 'Standard', color: 'green'},
			{name: 'Primary', color: 'green'},
			{name: 'Experimental', color: 'green'},
			{name: 'Dynamic', color: 'blue'},
			{name: 'Stellar', color: 'blue'},
			{name: 'Kinetic', color: 'blue'},
			{name: 'Multi-phase', color: 'blue'},
			{name: 'Turbocharged', color: 'pink'},
			{name: 'Quantum', color: 'pink'},
			{name: 'Superluminal', color: 'pink'},
			{name: 'Psi', color: 'pink'},
			{name: 'Eternal', color: 'purple'},
		],
		RARITY: {
			BASIC: 'Basic',
			SUPER: 'Super',
			AWESOME: 'Awesome',
		}
	}

	const json = Utils.traverse(props.player, 'stats.GingerBread') || {};
	const trophies = {
		gold : `${Utils.formatNum(json.gold_trophy)}🏆\uFE0E`,
		silver : `${Utils.formatNum(json.silver_trophy)}🏆\uFE0E`,
		bronze : `${Utils.formatNum(json.bronze_trophy)}🏆\uFE0E`,
	}
	const kart = {
		Engine : getPartData(json.engine_active),
		Frame : getPartData(json.frame_active),
		Turbocharger : getPartData(json.booster_active),
	}
	
	function getPartData(str) {
		const raw = JSON.parse(addQuotes(str));
		let data = {};
		data.rarity = consts.RARITY[Utils.traverse(raw, 'GingerbreadPart.PartRarity')];
		if (Array.isArray(Utils.traverse(raw, 'GingerbreadPart.Attributes'))) {
			data.attributes = {};
			let quality = 0;
			for (const obj of raw.GingerbreadPart.Attributes) {
				data.attributes[consts.ATTRIBUTES[obj.KartAttributeType]] = parseInt(obj.Level);
				quality += parseInt(obj.Level);
			}
			if (quality > 0) {
				data.quality = consts.QUALITY[quality-1].name;
				data.color = consts.QUALITY[quality-1].color;
			}
		}
		return data;
	}
	
	// Adds quotation marks to the TKR parts JSON string so that we can apply JSON.parse() to it
	function addQuotes(str) {
		if (str === undefined) return '{}';
		const bank = ['{','}','[',']',',',':'];
		let newStr = str.charAt(0);
		for (let i = 1; i < str.length; i++) {
			if ((bank.includes(str[i-1]) && !bank.includes(str[i])) ||
				(!bank.includes(str[i-1]) && bank.includes(str[i]))) {
				newStr += '"';
			}
			newStr += str[i];
		}
		return newStr;
	}

	function renderAttributePoints(num) {
		const char = '⟩'
		return (
			<React.Fragment>
				<span className="c-green font-bold">{char.repeat(num)}</span>
				<span className="c-red font-bold">{char.repeat(5-num)}</span>
			</React.Fragment>
			);
	}

	const header = (
		<React.Fragment>
			<Box title="Gold" color="gold">{trophies.gold}</Box>
			<Box title="Silver" color="white">{trophies.silver}</Box>
			<Box title="Bronze" color="brown">{trophies.bronze}</Box>
		</React.Fragment>
		);

	return (
		<Accordion title="Turbo Kart Racers" header={header} index={props.index}>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<StatPair title="Coins" color="gold">{json.coins}</StatPair>
					<StatPair title="Grand Prix Tokens" color="aqua">{json.grand_prix_tokens}</StatPair>
					<br />
					<StatPair title="Wins">{json.wins}</StatPair>
					<StatPair title="Gold Trophies" color="gold">{trophies.gold}</StatPair>
					<StatPair title="Silver Trophies" color="white">{trophies.silver}</StatPair>
					<StatPair title="Bronze Trophies" color="brown">{trophies.bronze}</StatPair>
				</div>
				<div className="flex-1">
					<StatPair title="Coins Picked Up">{json.coins_picked_up}</StatPair>
					<StatPair title="Powerups Picked Up">{json.box_pickups}</StatPair>
					<StatPair title="Laps Completed">{json.laps_completed}</StatPair>
					<StatPair title="Blue Torpedoes Hit">{json.blue_torpedo_hit}</StatPair>
					<br />
					<StatPair title="Banana Hits Sent">{json.banana_hits_sent}</StatPair>
					<StatPair title="Banana Hits Received">{json.banana_hits_received}</StatPair>
					<StatPair title="Banana Sent/Received Ratio">{Utils.ratio(json.banana_hits_sent, json.banana_hits_received)}</StatPair>
				</div>
			</div>
			<div className="accordion-separator mb-3"></div>
			<div className="font-bold font-md text-center mb-2">Current Kart</div>
			<div className="h-flex overflow-x mb-2">
				{Object.entries(kart).map(part => Boolean(part[1].quality) ?
					<table className="flex-1 mx-3" key={part[0]}>
						<thead>
							<tr>
								<th colSpan="2" className={`c-${part[1].color}`}>
									{`${part[1].quality} ${part[1].rarity} ${part[0]}`}
								</th>
							</tr>
						</thead>
						<tbody>
						{Object.entries(part[1].attributes).map(attr =>
							<tr key={attr[0]}>
								<td className="c-gray pr-2">{attr[0]}</td>
								<td>{renderAttributePoints(attr[1])}</td>
							</tr>
						)}
						</tbody>
					</table>
					:
					<div className="flex-1 c-gray text-center mx-3" key={part[0]}>
						{`No ${part[0]} equipped.`}
					</div>
				)}
			</div>
		</Accordion>
		);
}