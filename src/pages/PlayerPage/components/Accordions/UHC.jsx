import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'src/components';
import { Box, Cell, Pair, Progress, ProgressBar, Row, Table } from 'src/components/Stats';
import { UHC as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { HypixelLeveling } from 'src/utils/hypixel';

/*
* Stats accordion for UHC
*
* @param {number} props.index    The order in which to display the row (used by react-beautiful-dnd)
*/
export const UHC = memo((props) => {

	// Get the player's API data for UHC
	const { player } = useAPIContext();
	const json = Utils.traverse(player,'stats.UHC') || {};

	const leveling = new HypixelLeveling(scoreToStar, starToScore, Utils.default0(json.score));
	if (leveling.levelCeiling > 15) leveling.levelCeiling = 15;
	const title = getTitle(leveling.levelFloor).name;
	const titleColor = getTitle(leveling.levelFloor).color;

	// Calculate total kills/deaths etc. across all gamemodes
	let kills = 0, deaths = 0, wins = 0, heads = 0;
	for (const mode of consts.MODES) {
		wins += Utils.add(...mode.id.map(id => json[`wins${id}`]));
		kills += Utils.add(...mode.id.map(id => json[`kills${id}`]));
		deaths += Utils.add(...mode.id.map(id => json[`deaths${id}`]));
		heads += Utils.add(...mode.id.map(id => json[`heads_eaten${id}`]));
	}

	const ratios = {
		kd: Utils.ratio(kills,deaths),
		kw: Utils.ratio(kills,wins),
	}

	function scoreToStar(score) {
		const stars = consts.STARS;
		for(let i = 0; i < stars.length; i++) {
			if(score < stars[i].value) {
				return i + (score - stars[i-1].value) / (stars[i].value - stars[i-1].value);
			}
		}
	}

	function starToScore(star) {
		return consts.STARS[star-1].value;	
	}

	function getTitle(star) {
		return {
			name: consts.STARS[star-1].name,
			color: consts.STARS[star-1].color
		}
	}

	const header = (
		<React.Fragment>
			<Box title="Star" color="gold">{`[${leveling.levelFloor}✫]`}</Box>
			<Box title="KD">{ratios.kd}</Box>
			<Box title="Wins">{wins}</Box>
		</React.Fragment>
		);

	const progressBar = (() => {
		let levelingProgressProps = {
			proportion: leveling.xp / starToScore(leveling.levelCeiling),
			color: titleColor,
			dataTip: `${Utils.formatNum(leveling.xp)}/${Utils.formatNum(starToScore(leveling.levelCeiling))} Score`
		}
		if (leveling.levelFloor === 15) {
			levelingProgressProps = {
					proportion: 1,
					color: titleColor,
					dataTip: `${Utils.formatNum(leveling.xp)}/${Utils.formatNum(starToScore(15))} Score`
				}
		}
		return (
			<React.Fragment>
				<div className="flex-1">
					<ProgressBar {...levelingProgressProps}>
						<Progress {...levelingProgressProps} />
					</ProgressBar>
				</div>
				<span className={`px-1 c-${getTitle(leveling.levelCeiling).color}`}>
					{getTitle(leveling.levelCeiling).name}
				</span>
			</React.Fragment>
			);
	})();

	const table = (
		<Table>
			<thead>
				<tr>
					<th>Mode</th>
					<th>Kills</th>
					<th>Deaths</th>
					<th>KD</th>
					<th>Wins</th>
					<th>KW</th>
					<th>Heads Eaten</th>
				</tr>
			</thead>
			<tbody>
			{
				consts.MODES.map(mode => {
					const wins = Utils.add(...mode.id.map(id => json[`wins${id}`]));
					const kills = Utils.add(...mode.id.map(id => json[`kills${id}`]));
					const deaths = Utils.add(...mode.id.map(id => json[`deaths${id}`]));
					const headsEaten = Utils.add(...mode.id.map(id => json[`heads_eaten${id}`]));
					if (Utils.add(wins, deaths)) {
						return ( 
							<tr key={mode.id}>
								<Cell>{mode.name}</Cell>
								<Cell>{kills}</Cell>
								<Cell>{deaths}</Cell>
								<Cell>{Utils.ratio(kills,deaths)}</Cell>
								<Cell>{wins}</Cell>
								<Cell>{Utils.ratio(kills,wins)}</Cell>
								<Cell>{headsEaten}</Cell>
							</tr>
						);
					}
					return null;
				})
			}
				<Row id=''>
					<Cell>Overall</Cell>
					<Cell>{kills}</Cell>
					<Cell>{deaths}</Cell>
					<Cell>{Utils.ratio(kills,deaths)}</Cell>
					<Cell>{wins}</Cell>
					<Cell>{Utils.ratio(kills,wins)}</Cell>
					<Cell>{heads}</Cell>
				</Row>
			</tbody>
		</Table>
		);
		
	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>
			<div className="mb-1 font-bold">Title Progress</div>
			<div className="h-flex">
				{progressBar}
			</div>
			<div className="h-flex mt-3">
				<div className="flex-1">
					<Pair title="Score">{leveling.xp}</Pair>
					<Pair title="Title" color={titleColor}>{title}</Pair>
					<Pair title="Coins" color="gold">{json.coins}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Kills">{kills}</Pair>
					<Pair title="Deaths">{deaths}</Pair>
					<Pair title="Kill/Death Ratio">{ratios.kd}</Pair>
				</div>
				<div className="flex-1">
					<Pair title="Wins">{wins}</Pair>
					<Pair title="Kill/Win Ratio">{ratios.kw}</Pair>
					<Pair title="Heads Eaten">{heads}</Pair>
					<Pair title="Ultimates Crafted">
						{Utils.default0(json.ultimates_crafted) + Utils.default0(json.ultimates_crafted_solo)}
					</Pair>
				</div>
			</div>
			
			<HorizontalLine className="my-3" />

			{table}
		</Accordion>
});