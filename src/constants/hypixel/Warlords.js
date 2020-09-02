export const WARLORDS = {
	TITLE: 'Warlords',
	CLASSES: [
		{id: '_mage', name: 'Mage'},
		{id: '_paladin', name: 'Paladin'},
		{id: '_shaman', name: 'Shaman'},
		{id: '_warrior', name: 'Warrior'},
		{id: '', name: 'Overall'},
	],
	MODES: [
		{id: '_capturetheflag', name: 'Capture the Flag'},
		{id: '_domination', name: 'Domination'},
		{id: '_teamdeathmatch', name: 'Team Deathmatch'},
		{id: '', name: 'Overall'},
	],
	RARITIES: [
		{id: 'common', name: 'Common', color: 'green'},
		{id: 'rare', name: 'Rare', color: 'blue'},
		{id: 'epic', name: 'Epic', color: 'purple'},
		{id: 'legendary', name: 'Legendary', color: 'gold'},
	],
	UPGRADES: [
		{id: 'cooldown', name: 'Cooldown'},
		{id: 'critchance', name: 'Crit Chance'},
		{id: 'critmultiplier', name: 'Crit Multiplier'},
		{id: 'energy', name: 'Energy'},
		{id: 'health', name: 'Health'},
		{id: 'skill1', name: 'First Skill'},
		{id: 'skill2', name: 'Second Skill'},
		{id: 'skill3', name: 'Third Skill'},
		{id: 'skill4', name: 'Fourth Skill'},
		{id: 'skill5', name: 'Ultimate SKill'},
	],
	MATERIALS: {
		'WOOD_AXE': 'Steel Sword', 'STONE_AXE': 'Training Sword', 'IRON_AXE': 'Demonblade',
		'GOLD_AXE': 'Venomstrike', 'DIAMOND_AXE': 'Diamondspark', 'WOOD_HOE': 'Zweireaper',
		'STONE_HOE': 'Runeblade', 'IRON_HOE': 'Elven Greatsword', 'GOLD_HOE': 'Hatchet',
		'DIAMOND_HOE': 'Gem Axe', 'WOOD_SPADE': 'Nomegusta', 'STONE_SPADE': 'Drakefang',
		'IRON_SPADE': 'Hammer', 'GOLD_SPADE': 'Stone Mallet', 'DIAMOND_SPADE': 'Gemcrusher',
		'WOOD_PICKAXE': 'Abbadon', 'STONE_PICKAXE': 'Walking Stick', 'IRON_PICKAXE': 'World Tree Branch',
		'GOLD_PICKAXE': 'Flameweaver', 'DIAMOND_PICKAXE': 'Void Twig', 'SALMON': 'Scimitar',
		'PUFFERFISH': 'Golden Gladius', 'CLOWNFISH': 'Magmasword', 'COD': 'Frostbite',
		'ROTTEN_FLESH': 'Pike', 'POTATO': 'Halberd', 'MELON': 'Divine Reach',
		'POISONOUS_POTATO': 'Ruby Thorn', 'STRING': 'Hammer of Light', 'RAW_CHICKEN': 'Nethersteel Katana',
		'MUTTON': 'Claws', 'PORK': 'Mandibles', 'RAW_BEEF': 'Katar',
		'APPLE': 'Enderfist', 'PUMPKIN_PIE': 'Orc Axe', 'COOKED_COD': 'Doubleaxe',
		'BREAD': 'Runic Axe', 'MUSHROOM_STEW': 'Lunar Relic', 'RABBIT_STEW': 'Bludgeon',
		'COOKED_RABBIT': 'Cudgel', 'COOKED_CHICKEN': 'Tenderizer', 'BAKED_POTATO': 'Broccomace',
		'COOKED_SALMON': 'Felflame Blade', 'COOKED_MUTTON': 'Amaranth', 'COOKED_BEEF': 'Armblade',
		'GRILLED_PORK': 'Gemini', 'COOKED_PORKCHOP': 'Gemini', 'GOLDEN_CARROT': 'Void Edge'
	},
	PLAYERCLASSES: [
		['Pyromancer', 'Cryomancer', 'Aquamancer'], // Mage
		['Berserker', 'Defender', 'Revenant'], // Warrior
		['Avenger', 'Crusader', 'Protector'], // Paladin
		['Thunderlord', 'Earthwarden', 'Spiritguard'], // Shaman
	],
	SCORES : {
		COMMON: [
			{score: 276, prefix: 'Crumbly'},
			{score: 302, prefix: 'Flimsy'},
			{score: 327, prefix: 'Rough'},
			{score: 352, prefix: 'Honed'},
			{score: 378, prefix: 'Refined'},
			{score: 403, prefix: 'Balanced'},
		],
		RARE: [
			{score: 359, prefix: 'Savage'},
			{score: 400, prefix: 'Vicious'},
			{score: 440, prefix: 'Deadly'},
			{score: 481, prefix: 'Perfect'},
		],
		EPIC: [
			{score: 450, prefix: 'Fierce'},
			{score: 489, prefix: 'Mighty'},
			{score: 527, prefix: 'Brutal'},
			{score: 566, prefix: 'Gladiator\'s'},
		],
		LEGENDARY: [
			{score: 595, prefix: 'Vanquisher\'s'},
			{score: 665, prefix: 'Champion\'s'},
			{score: 735, prefix: 'Warlord\'s'},
		],
	},
}