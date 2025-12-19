import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'src/components';
import { Box, Br, Cell, Pair, Row, Table } from 'src/components/Stats';
import { DUELS as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { getMostPlayed } from 'src/utils/hypixel';

/**
 * Stats accordion for Duels
 *
 * @param {number} props.index    The order in which to display the row (used by the dnd package)
 */
export const Duels = memo((props) => {
	
	const { player } = useAPIContext();
	const json = Utils.traverse(player,'stats.Duels') || {};

	const mostPlayedMode = getMostPlayed(consts.MODES, 
		({id}) => Utils.add(json[`${id}_wins`], json[`${id}_losses`]));

	// sum wins by divisionId
	const winsByDivisionId = {};
	for (const mode of consts.MODES) {
		if (!mode.divisionId) continue;
		const wins = json[`${mode.id}_wins`] || 0;
		winsByDivisionId[mode.divisionId] = (winsByDivisionId[mode.divisionId] || 0) + wins;
	}

	const division = getDivision(json.wins, 'overall');

	const stats = (() => {
		let totalDeaths = 0, totalKills = 0;
		// Ignores Bridge deaths and kills
		for (const [k,v] of Object.entries(json)) {
			if (k.includes('deaths') && k!=='deaths' && !k.includes('bridge')) {
				totalDeaths += v;
			}
			else if (k.includes('kills') && k!=='kills' && !k.includes('bridge')) {
				totalKills += v;
			}
		}
		return {
			kills : Utils.default0(totalKills),
			deaths : Utils.default0(totalDeaths),
		}
	})();

	const ratios = {
		kd : Utils.ratio(stats.kills,stats.deaths),
		wl : Utils.ratio(json.wins,json.losses),
		mhm : Utils.ratio(json.melee_hits,json.melee_swings),
		ahm : Utils.ratio(json.bow_hits,json.bow_shots),
	}

	function getDivision(wins, requirementType = 'default') {
		if (!wins || wins <= 0) {
			return {name: '-', level: '-', color: 'gray', style: '', bold: false};
		}
		const divisions = consts.DIVISIONS[requirementType];
		let divIndex = 0;
		for (let i = divisions.length - 1; i >= 0; i--) {
			if (wins >= divisions[i].req) {
				divIndex = i;
				break;
			}
		}
		const div = divisions[divIndex];
		if (div.id === 'none') {
			return {name: '-', level: '-', color: 'gray', style: '', bold: false};
		}
		const remaining = wins - div.req;
		const level = Math.min(div.max, div.step ? Math.floor(remaining / div.step) + 1 : 1);
		const roman = Utils.romanize(level);
		return {
			name: `${div.name}${level > 1 ? ' ' + roman : ''}`,
			level: roman,
			color: div.color,
			style: div.style,
			bold: div.bold,
		};
	}

	function formatDivisionTitle(div) {
		if (div.name === '-') return '§7-';
		
		const iconKey = (json.active_prefix_icon || '').replace('prefix_icon_', '');
		const schemeKey = (json.active_prefix_scheme || '').replace('prefix_scheme_', '');
		
		const icon = consts.ICONS[iconKey] || '';
		const scheme = consts.SCHEMES[schemeKey] || consts.SCHEMES.default;
		
		const title = div.name;
		const bold = div.bold ? '§l' : '';
		
		if (scheme.type === 'solid') {
			const iconPart = icon ? `${scheme.color}${icon} ` : '';
			return `${iconPart}${scheme.color}${bold}${title}§r`;
		}
		
		if (scheme.type === 'gradient') {
			const iconPart = icon ? `${icon} ` : '';
			const fullText = `${iconPart}${title}`;
			const colors = scheme.colors;
			const chunkSize = Math.floor(fullText.length / colors.length);
			
			let result = '';
			for (let i = 0; i < colors.length; i++) {
				const start = i * chunkSize;
				const end = i === colors.length - 1 ? fullText.length : (i + 1) * chunkSize;
				const chunk = fullText.slice(start, end);
				if (i === 0 && bold && iconPart) {
					const iconLen = iconPart.length;
					result += colors[i] + chunk.slice(0, iconLen) + bold + chunk.slice(iconLen);
				} else {
					result += colors[i] + (i === 0 && bold ? bold : '') + chunk;
				}
			}
			return result + '§r';
		}
		
		// default scheme
		const iconPart = icon ? `${icon} ` : '';
		return `${div.style}${iconPart}${bold}${title}§r`;
	}

	function kills(id) {
		return Utils.add(json[`${id}_bridge_kills`], json[`${id}${id && '_'}kills`]);
	} 

	function deaths(id) {
		return Utils.add(json[`${id}_bridge_deaths`], json[`${id}${id && '_'}deaths`]);
	}
	const header = (
		<React.Fragment>
			<Box title="Division">{formatDivisionTitle(division)}</Box>
			<Box title="Most Played" color="white">{mostPlayedMode.name || '§7-'}</Box>
			<Box title="Wins">{json.wins}</Box>
			<Box title="WL">{ratios.wl}</Box>
		</React.Fragment>
		);

	const table = (
		<Table>
			<thead>
				<tr>
					<th>Mode</th>
					<th>Div</th>
					<th>Kills</th>
					<th>Deaths</th>
					<th>KD</th>
					<th>Wins</th>
					<th>Losses</th>
					<th>WL</th>
					<th>WS</th>
					<th>Top WS</th>
					<th>Melee HM</th>
					<th>Arrow HM</th>
					<th>Goals</th>
				</tr>
			</thead>
			<tbody>
			{
				consts.MODES.map(({id, name, divisionId, requirement}) => {
					const divisionWins = winsByDivisionId[divisionId] || 0;
					const modeDivision = getDivision(divisionWins, requirement);
					if (Boolean(Utils.add(json[`${id}${id && '_'}wins`], json[`${id}${id && '_'}losses`]))) {
						return (
							<Row key={id} id={id} isHighlighted={id === mostPlayedMode.id}>
								<Cell>{name}</Cell>
								<Cell color={modeDivision.color}>{modeDivision.level}</Cell>
								<Cell>{kills(id)}</Cell>
								<Cell>{deaths(id)}</Cell>
								<Cell>{Utils.ratio(kills(id),deaths(id))}</Cell>
								<Cell>{json[`${id}${id && '_'}wins`]}</Cell>
								<Cell>{json[`${id}${id && '_'}losses`]}</Cell>
								<Cell>{Utils.ratio(json[`${id}${id && '_'}wins`],json[`${id}${id && '_'}losses`])}</Cell>
								<Cell>{Utils.defaultUnknown(json[`current_winstreak${id && '_mode_'}${id}`])}</Cell>
								<Cell>{Utils.defaultUnknown(json[`best_winstreak${id && '_mode_'}${id}`])}</Cell>
								<Cell>{Utils.ratio(json[`${id}${id && '_'}melee_hits`],json[`${id}${id && '_'}melee_swings`])}</Cell>
								<Cell>{Utils.ratio(json[`${id}${id && '_'}bow_hits`],json[`${id}${id && '_'}bow_shots`])}</Cell>
								<Cell>{json[`${id}${id && '_'}goals`]}</Cell>
							</Row>
							)
					}
					else return null;
				})
			}
			</tbody>
		</Table>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="h-flex mb-3">
				<div className="flex-1">
					<Pair title="Tokens" color="darkgreen">{json.coins}</Pair>
					<Pair title="Loot Chests">{json.duels_chests}</Pair>
					<Br/>
					<Br/>
					<Pair title="Kills">{stats.kills}</Pair>
					<Pair title="Deaths">{stats.deaths}</Pair>
					<Pair title="Kill/Death Ratio">{ratios.kd}</Pair>
					<Br/>
					<Pair title="Melee Swings">{json.melee_swings}</Pair>
					<Pair title="Melee Hits">{json.melee_hits}</Pair>
					<Pair title="Melee Hit Accuracy" percentage>{ratios.mhm}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Best Winstreak">{Utils.defaultUnknown(json.best_overall_winstreak)}</Pair>
					<Pair title="Current Winstreak">{Utils.defaultUnknown(json.current_winstreak)}</Pair>
					<Pair title="Overall Division" color={division.color}>{division.name}</Pair>
					<Br/>
					<Pair title="Wins">{json.wins}</Pair>
					<Pair title="Losses">{json.losses}</Pair>
					<Pair title="Win/Loss Ratio">{ratios.wl}</Pair>
					<Br/>
					<Pair title="Arrows Shot">{json.bow_shots}</Pair>
					<Pair title="Arrows Hit">{json.bow_hits}</Pair>
					<Pair title="Arrow Hit Accuracy" percentage>{ratios.ahm}</Pair>
				</div>
			</div>
			
			<HorizontalLine className="my-3" />

			{table}
		</Accordion>
});