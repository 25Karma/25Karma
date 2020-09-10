import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'components';
import { Box, Br, Pair, Title } from 'components/Stats';
import { TURBOKARTRACERS as consts } from 'constants/hypixel';
import { useHypixelContext } from 'hooks';
import * as Utils from 'utils';

/*
* Stats accordion for Turbo Kart Racers
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export const TurboKartRacers = memo((props) => {

	const { player } = useHypixelContext();
	const json = Utils.traverse(player, 'stats.GingerBread') || {};

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
	
	const currentKart = Object.entries(kart).map(
		part => Boolean(part[1].quality) ?
		<table className="flex-1 px-3" key={part[0]}>
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
					<td className="px-3">{attr[0]}</td>
					<td className="text-right pr-3">{renderAttributePoints(attr[1])}</td>
				</tr>
			)}
			</tbody>
		</table>
		:
		<div className="flex-1 c-gray text-center px-3" key={part[0]}>
			{`No ${part[0]} equipped.`}
		</div>
		);
	
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

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="h-flex my-3">
				<div className="flex-1">
					<Pair title="Coins" color="gold">{json.coins}</Pair>
					<Pair title="Grand Prix Tokens" color="aqua">{json.grand_prix_tokens}</Pair>
					<Br />
					<Pair title="Wins">{json.wins}</Pair>
					<Pair title="Gold Trophies" color="gold">{trophies.gold}</Pair>
					<Pair title="Silver Trophies" color="white">{trophies.silver}</Pair>
					<Pair title="Bronze Trophies" color="brown">{trophies.bronze}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Coins Picked Up">{json.coins_picked_up}</Pair>
					<Pair title="Powerups Picked Up">{json.box_pickups}</Pair>
					<Pair title="Laps Completed">{json.laps_completed}</Pair>
					<Pair title="Blue Torpedoes Hit">{json.blue_torpedo_hit}</Pair>
					<Br />
					<Pair title="Banana Hits Sent">{json.banana_hits_sent}</Pair>
					<Pair title="Banana Hits Received">{json.banana_hits_received}</Pair>
					<Pair title="Banana Sent/Received Ratio">{Utils.ratio(json.banana_hits_sent, json.banana_hits_received)}</Pair>
				</div>
			</div>
			
			<HorizontalLine />

			<Title>Current Kart</Title>
			<div className="h-flex overflow-x mb-3">
				{currentKart}
			</div>
		</Accordion>
});