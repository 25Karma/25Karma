import React, { memo } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Accordion, Button, ExternalLink, HorizontalLine, ReactIcon } from 'components';
import { Box, Br, Cell, Pair, Progress, ProgressBar, Span, Row, Table } from 'components/Stats';
import { WARLORDS as consts } from 'constants/hypixel';
import { useHypixelContext } from 'hooks';
import * as Utils from 'utils';
import { getMostPlayed } from 'utils/hypixel';

/*
* Stats accordion for Mega Walls
*
* @param {number} props.index 	The order in which to display the row (used by react-beautiful-dnd)
*/
export const Warlords = memo((props) => {
	const { mojang, player } = useHypixelContext();
	const json = Utils.traverse(player, 'stats.Battleground', {});
	const ratios = {
		ak: Utils.ratio(json.assists, json.kills),
		kd: Utils.ratio(json.kills, json.deaths),
		wl: Utils.ratio(json.wins, json.losses),
	}

	const mostPlayedClass = getMostPlayed(consts.CLASSES,
		({id}) => Utils.add(json[`wins${id}`], json[`losses${id}`]));

	function getClassLevel(id) {
		const strippedId = id.substring(1);
		return Utils.add(...consts.UPGRADES.map(({id}) => json[`${strippedId}_${id}`]))
	}

	const header = (
		<React.Fragment>
			<Box title="Main" color={mostPlayedClass.id && 'gold'}>{mostPlayedClass.name || '-'}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
		);

	const repairedProgress = (
		<ProgressBar>
			{consts.RARITIES.slice().reverse().map(({id, name, color}) => {
				const amount = Utils.default0(json[`repaired_${id}`]);
				if (amount === 0) return null;
				return <Progress
					key={id}
					color={color}
					proportion={Utils.ratio(amount, json.repaired)}
					dataTip={`${amount} ${name} Weapons`} />
			})}
		</ProgressBar>
		);

	const classTable = (
		<Table>
			<thead>
				<tr>
					<th>Class</th>
					<th>Damage</th>
					<th>Damage Prevented</th>
					<th>Healing</th>
					<th>Wins</th>
					<th>Losses</th>
					<th>WL</th>
				</tr>
			</thead>
			<tbody>
				{consts.CLASSES.map(({id, name}) =>
					<Row key={id} id={id} isHighlighted={id === mostPlayedClass.id}>
						{id ? 
							<Cell>
								<Span color="gray">{`Lv${getClassLevel(id)} `}</Span>
								<Span color="gold">{name}</Span>
							</Cell>
							:
							<Cell>{name}</Cell>
						}
						<Cell>{json[`damage${id}`]}</Cell>
						<Cell>{json[`damage_prevented${id}`]}</Cell>
						<Cell>{json[`heal${id}`]}</Cell>
						<Cell>{json[`wins${id}`]}</Cell>
						<Cell>{json[`losses${id}`]}</Cell>
						<Cell>{Utils.ratio(json[`wins${id}`], json[`losses${id}`])}</Cell>
					</Row>
				)}
			</tbody>
		</Table>
		);
	
	// Kills are omitted from this table because the numbers don't add up
	const modesTable = (
		<Table>
			<thead>
				<tr>
					<th>Mode</th>
					<th>Wins</th>
				</tr>
			</thead>
			<tbody>
				{consts.MODES.map(({id, name}) =>
					Boolean(json[`wins${id}`]) &&
					<Row key={id} id={id}>
						<Cell>{name}</Cell>
						<Cell>{json[`wins${id}`]}</Cell>
					</Row>
				)}
			</tbody>
		</Table>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="h-flex my-3">
				<div className="flex-1">
					<Pair title="Coins" color="gold">{json.coins}</Pair>
					<Pair title="Magic Dust" color="aqua">{json.magic_dust}</Pair>
					<Pair title="Void Shards" color="pink">{json.void_shards}</Pair>
					<Br />
					<Pair title="Wins">{json.wins}</Pair>
					<Pair title="Losses">{json.losses}</Pair>
					<Pair title="Win/Loss Ratio">{ratios.wl}</Pair>
					<Br />
					<ExternalLink href={`https://gen.plancke.io/warlords/class/${mojang.uuid}.png`}>
						<Button>
							<span className="font-bold pr-1">Class Levels</span>
							<ReactIcon icon={FaExternalLinkAlt} size="sm" />
						</Button>
					</ExternalLink>
				</div>
				<div className="flex-1">
					<Pair title="Kills">{json.kills}</Pair>
					<Pair title="Assists">{json.assists}</Pair>
					<Pair title="Assist/Kill Ratio">{ratios.ak}</Pair>
					<Pair title="Deaths">{json.deaths}</Pair>
					<Pair title="Kill/Death Ratio">{ratios.kd}</Pair>
					<Br />
					<Pair title="Flags Captured">{json.flag_conquer_self}</Pair>
					<Pair title="Flags Returned">{json.flag_returns}</Pair>
				</div>
			</div>

			<HorizontalLine />

			<div className="my-3">
				<Pair title="Total Weapons Repaired">{json.repaired}</Pair>
				<div className="mt-1 mb-3">
					{repairedProgress}
				</div>
				<div className="font-bold mb-1">Weapon Inventory</div>
				{json.weapon_inventory && json.weapon_inventory.map((data, index) =>
					<Weapon data={data} key={index}></Weapon>	
				)}
			</div>

			<HorizontalLine />

			<div className="overflow-x my-3">
				{classTable}
			</div>

			<HorizontalLine />

			<div className="overflow-x my-3">
				{modesTable}
			</div>
		</Accordion>
});

function Weapon(props) {
	const { data } = props;
	const score = 0
		+ data.damage * (1 + data.upgradeTimes * 0.075)
		+ data.chance
		+ data.multiplier
		+ data.abilityBoost * (1 + data.upgradeTimes * 0.075)
		+ data.health * (1 + data.upgradeTimes * 0.25)
		+ data.energy * (1 + data.upgradeTimes * 0.1)
		+ data.cooldown * (1 + data.upgradeTimes * 0.075)
		+ data.movement * (1 + data.upgradeTimes * 0.075);
	
	let prefix = '';
	for (const s of consts.SCORES[data.category].slice().reverse()) {
		if (score > s.score) {
			prefix = s.prefix;
			break;
		} 
	}
	const material = consts.MATERIALS[data.material];
	const playerClass = consts.PLAYERCLASSES[data.spec.playerClass][data.spec.spec];
	const rarity = consts.RARITIES.find(n => n.id === data.category.toLowerCase());
	return (
		<div style={{marginBottom: '0.25rem'}}>
			<Span color={rarity.color}>{`${prefix} ${material} of the ${playerClass}`}</Span>
		</div>
		);
}