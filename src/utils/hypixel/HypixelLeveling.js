import { formatNum } from 'utils';

/*
* @class    Simplifies calculations for the generic Hypixel leveling system -
*           simply provide functions to convert between xp and level
*/
export class HypixelLeveling {
	/*
	* Instance variables
	*
	* {number} this.xp                    amount of XP the player has
	* {number} this.level                 The exact level of the player - decimal value
	* {number} this.levelFloor            The level of the player rounded down
	* {number} this.levelCeiling          The next level of the player
	*
	* {number} this.proportionAboveLevel  How far the player is to the next level - 
	*                                     from 0 to 1
	* {string} this.xpAboveLevel          The amount of XP above the player's level, string formatted
	* {string} this.levelTotalXP          The change in XP to the next level, string formatted
	*/

	/* 
	* @constructor
	*
	* @param {function} xpToLevel    Function that converts xp to level
	* @param {function} levelToXP    Function that converts level to xp (level is always integer value)
	* @param {number} playerXP       How much xp the player has
	*/
	constructor(xpToLevel, levelToXP, playerXP) {
		this.xp = playerXP;
		
		// Level of the player (decimal value)
		this.level = xpToLevel(this.xp);

		this.levelFloor = Math.floor(this.level);
		this.levelCeiling = this.levelFloor + 1;

		// How far the player is to the next level - a percentage
		this.proportionAboveLevel = this.level - this.levelFloor;

		// How far the player is to the next level - in absolute terms
		this.xpAboveLevel = formatNum(this.xp - levelToXP(this.levelFloor));
		this.levelTotalXP = formatNum(levelToXP(this.levelCeiling) - levelToXP(this.levelFloor));
	}
}