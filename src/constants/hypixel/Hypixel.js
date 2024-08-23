export const HYPIXEL = {
	GAMES : {
		ARCADE: 'Arcade Games',
		ARENA: 'Arena Brawl',
		BATTLEGROUND: 'Warlords',
		BEDWARS: 'Bed Wars',
		BUILD_BATTLE: 'Build Battle',
		DUELS: 'Duels',
		GINGERBREAD: 'Turbo Kart Racers',
		HOUSING: 'Housing',
		LEGACY: 'Classic Games',
		MAIN: 'Main',
		MCGO: 'Cops and Crims',
		MURDER_MYSTERY: 'Murder Mystery',
		PAINTBALL: 'Paintball',
		PIT: 'Pit',
		PROTOTYPE: 'Prototype',
		QUAKECRAFT: 'Quakecraft',
		REPLAY: 'Replay',
		SKYBLOCK: 'SkyBlock',
		SKYWARS: 'SkyWars',
		SMP: 'SMP',
		SPEED_UHC: 'Speed UHC',
		SUPER_SMASH: 'Smash Heroes',
		SURVIVAL_GAMES: 'Blitz SG',
		TNTGAMES: 'TNT Games',
		TOURNAMENT: 'Tournament Hall',
		UHC: 'UHC Champions',
		VAMPIREZ: 'VampireZ',
		WALLS: 'Walls',
		WALLS3: 'Mega Walls',
		WOOL_GAMES: 'Wool Games',
	},
	QUESTS: {
		arcade: 'Arcade Games',
		arena: 'Arena Brawl',
		battleground: 'Warlords',
		bedwars: 'Bed Wars',
		buildbattle: 'Build Battle',
		duels: 'Duels',
		gingerbread: 'Turbo Kart Racers',
		hungergames: 'Blitz SG',
		mcgo: 'Cops and Crims',
		murdermystery: 'Murder Mystery',
		paintball: 'Paintball',
		pit: 'Pit',
		quake: 'Quakecraft',
		skywars: 'SkyWars',
		supersmash: 'Smash Heroes',
		tntgames: 'TNT Games',
		uhc: 'UHC Champions',
		vampirez: 'VampireZ',
		walls: 'Walls',
		walls3: 'Mega Walls',
		woolgames: 'Wool Games',
	},
	ACHIEVEMENTS: {
		arcade: 'Arcade Games',
		arena: 'Arena Brawl',
		bedwars: 'Bed Wars',
		blitz: 'Blitz SG',
		buildbattle: 'Build Battle',
		christmas2017: 'Christmas',
		copsandcrims: 'Cops and Crims',
		duels: 'Duels',
		easter: 'Easter',
		general: 'General',
		gingerbread: 'Turbo Kart Racers',
		halloween2017: 'Halloween',
		housing: 'Housing',
		murdermystery: 'Murder Mystery',
		paintball: 'Paintball',
		pit: 'Pit',
		quake: 'Quakecraft',
		skyblock: 'SkyBlock',
		skywars: 'SkyWars',
		speeduhc: 'Speed UHC',
		summer: 'Summer',
		supersmash: 'Smash Heroes',
		tntgames: 'TNT Games',
		uhc: 'UHC Champions',
		vampirez: 'VampireZ',
		walls: 'Walls',
		walls3: 'Mega Walls',
		warlords: 'Warlords',
		woolgames: 'Wool Games',
	},
	MULTIPLIER: [
		{level: 0, value: 1},
		{level: 5, value: 1.5},
		{level: 10, value: 2},
		{level: 15, value: 2.5},
		{level: 20, value: 3},
		{level: 25, value: 3.5},
		{level: 30, value: 4},
		{level: 40, value: 4.5},
		{level: 50, value: 5},
		{level: 100, value: 5.5},
		{level: 125, value: 6},
		{level: 150, value: 6.5},
		{level: 200, value: 7},
		{level: 250, value: 8},
	],
	RANKPRIORITY: [
		undefined,
		'NONE',
		'VIP',
		'VIP_PLUS',
		'MVP',
		'MVP_PLUS',
		'SUPERSTAR',
		'YOUTUBER',
		'HELPER',
		'MODERATOR',
		'GAME_MASTER',
		'ADMIN'
	],
	RANKMULTIPLIER: {
		VIP: {value: 2, name: 'VIP'},
		VIP_PLUS: {value: 3, name: 'VIP+'},
		MVP: {value: 4, name: 'MVP'},
		MVP_PLUS: {value: 5, name: 'MVP+'},
		YOUTUBER: {value: 7, name: 'YouTuber'},
	},
	TOTALCOINS: [
		'stats.Arcade.coins',
		'stats.Arena.coins',
		'stats.Bedwars.coins',
		'stats.HungerGames.coins',
		'stats.BuildBattle.coins',
		'stats.MCGO.coins',
		'stats.Duels.coins',
		'stats.Walls3.coins',
		'stats.MurderMystery.coins',
		'stats.Paintball.coins',
		'stats.Quake.coins',
		'stats.SkyWars.coins',
		'stats.SuperSmash.coins',
		'stats.SpeedUHC.coins',
		'stats.TNTGames.coins',
		'stats.GingerBread.coins',
		'stats.UHC.coins',
		'stats.VampireZ.coins',
		'stats.Walls.coins',
		'stats.Battleground.coins',
		'stats.TrueCombat.coins', // Crazy Walls (removed)
		'stats.SkyClash.coins', // SkyClash (removed)
		'stats.WoolGames.coins',
	],
	TOTALKILLS: [
		'stats.Arcade.kills_dayone',
		'stats.Arcade.kills_oneinthequiver',
		'stats.Arcade.woolhunt_kills',
		'stats.Arcade.kills_dragonwars2',
		'stats.Arcade.sw_kills',
		'stats.Arcade.kills_throw_out',
		'stats.Arcade.kills_mini_walls',
		'stats.Arcade.final_kills_mini_walls',
		'stats.Arena.kills_1v1',
		'stats.Arena.kills_2v2',
		'stats.Arena.kills_4v4',
		'stats.Bedwars.kills_bedwars',
		'stats.Bedwars.final_kills_bedwars',
		'stats.HungerGames.kills',
		'stats.MCGO.kills',
		'stats.MCGO.kills_deathmatch',
		'stats.MCGO.kills_gungame',
		'stats.Duels.kills',
		'stats.Duels.bridge_kills',
		'stats.Duels.duel_arena_kills',
		'stats.Walls3.kills',
		'stats.Walls3.final_kills',
		'stats.MurderMystery.kills',
		'stats.Paintball.kills',
		'stats.Pit.pit_stats_ptl.kills',
		'stats.Quake.kills',
		'stats.Quake.kills_teams',
		'stats.SkyWars.kills',
		'stats.SuperSmash.kills',
		'stats.SpeedUHC.kills',
		'stats.TNTGames.kills_pvprun',
		'stats.TNTGames.kills_tntag',
		'stats.TNTGames.kills_capture',
		'stats.UHC.kills_solo',
		'stats.UHC.kills',
		'stats.UHC.kills_red vs blue',
		'stats.UHC.kills_no diamonds',
		'stats.UHC.kills_vanilla doubles',
		'stats.UHC.kills_brawl',
		'stats.UHC.kills_solo brawl',
		'stats.UHC.kills_duo brawl',
		'stats.VampireZ.vampire_kills',
		'stats.VampireZ.human_kills',
		'stats.Walls.kills',
		'stats.Battleground.kills', 
		'stats.TrueCombat.kills', // Crazy Walls (removed)
		'stats.SkyClash.kills', // SkyClash (removed)
		'stats.WoolGames.wool_wars.stats.kills',
	],
	TOTALWINS: [
		'stats.Arcade.dropper.wins',
		'stats.Arcade.wins_dayone',
		'stats.Arcade.wins_oneinthequiver',
		'stats.Arcade.wins_dragonwars2',
		'stats.Arcade.wins_easter_simulator',
		'stats.Arcade.wins_ender',
		'stats.Arcade.wins_farm_hunt',
		'stats.Arcade.wins_soccer',
		'stats.Arcade.sw_game_wins',
		'stats.Arcade.wins_grinch_simulator_v2',
		'stats.Arcade.wins_halloween_simulator',
		'stats.Arcade.seeker_wins_hide_and_seek',
		'stats.Arcade.hider_wins_hide_and_seek',
		'stats.Arcade.wins_hole_in_the_wall',
		'stats.Arcade.wins_simon_says',
		'stats.Arcade.wins_party',
		'stats.Arcade.wins_party_2',
		'stats.Arcade.wins_party_3',
		'stats.Arcade.wins_draw_their_thing',
		'stats.Arcade.wins_scuba_simulator',
		'stats.Arcade.wins_throw_out',
		'stats.Arcade.wins_mini_walls',
		'stats.Arcade.wins_zombies',
		'stats.Arcade.pixel_party.wins',
		'stats.Arena.wins_1v1',
		'stats.Arena.wins_2v2',
		'stats.Arena.wins_4v4',
		'stats.Bedwars.wins_bedwars',
		'stats.HungerGames.wins',
		'stats.BuildBattle.wins',
		'stats.MCGO.game_wins', // Only wins for Defusal
		'stats.MCGO.game_wins_deathmatch',
		'stats.MCGO.game_wins_gungame',
		'stats.Duels.wins',
		'stats.Duels.duel_arena_wins',
		'stats.Walls3.wins',
		'stats.MurderMystery.wins',
		'stats.Paintball.wins',
		'stats.Quake.wins',
		'stats.Quake.wins_teams',
		'stats.SkyWars.wins',
		'stats.SkyWars.wins_lab',
		'stats.SuperSmash.wins',
		'stats.SpeedUHC.wins',
		'stats.TNTGames.wins', // Every TNT Game except PVP Run
		'stats.TNTGames.wins_pvprun',
		'stats.GingerBread.wins',
		'stats.UHC.wins_solo',
		'stats.UHC.wins',
		'stats.UHC.wins_red vs blue',
		'stats.UHC.wins_no diamonds',
		'stats.UHC.wins_vanilla doubles',
		'stats.UHC.wins_brawl',
		'stats.UHC.wins_solo brawl',
		'stats.UHC.wins_duo brawl',
		'stats.VampireZ.vampire_wins',
		'stats.VampireZ.human_wins',
		'stats.Walls.wins',
		'stats.Battleground.wins',
		'stats.TrueCombat.wins', // Crazy Walls (removed)
		'stats.SkyClash.wins', // SkyClash (removed)
		'stats.WoolGames.wool_wars.stats.wins',
	],
	MODES: {
		ARCADE: {
			DAYONE: 'Blocking Dead',
			ONEINTHEQUIVER: 'Bounty Hunters',
			PVP_CTW: 'Capture the Wool',
			DEFENDER: 'Creeper Attack',
			DRAGONWARS2: 'Dragon Wars',
			DROPPER: 'Dropper',
			ENDER: 'Ender Spleef',
			FARM_HUNT: 'Farm Hunt',
			SOCCER: 'Football',
			STARWARS: 'Galaxy Wars',
			HIDE_AND_SEEK_PROP_HUNT: 'Hide and Seek (Prop Hunt)',
			HIDE_AND_SEEK_PARTY_POOPER: 'Hide and Seek (Party Pooper)',
			HOLE_IN_THE_WALL: 'Hole in the Wall',
			SIMON_SAYS: 'Hypixel Says',
			MINI_WALLS: 'Mini Walls',
			PARTY: 'Party Games',
			DRAW_THEIR_THING: 'Pixel Painters',
			PIXEL_PARTY: 'Pixel Party',
			THROW_OUT: 'Throw Out',
			ZOMBIES_DEAD_END: 'Zombies',
			ZOMBIES_BAD_BLOOD: 'Zombies',
			ZOMBIES_ALIEN_ARCADIUM: 'Zombies',
			ZOMBIES_PRISON: 'Zombies',
		},
		ARENA: {
			'1v1': '1v1',
			'2v2': '2v2',
			'4v4': '4v4',
		},
		BATTLEGROUND: {
			mini_ctf: 'Capture the Flag',
			domination: 'Domination',
			team_deathmatch: 'Team Deathmatch',
		},
		BEDWARS: {
			BEDWARS_EIGHT_ONE: 'Solo',
			BEDWARS_EIGHT_TWO: 'Doubles',
			BEDWARS_EIGHT_TWO_TOURNEY: 'Doubles (Tournament)',
			BEDWARS_FOUR_THREE: '3v3v3v3',
			BEDWARS_FOUR_FOUR: '4v4v4v4',
			BEDWARS_FOUR_FOUR_TOURNEY: '4v4v4v4 (Tournament)',
			BEDWARS_TWO_FOUR: '4v4',
			BEDWARS_TWO_FOUR_TOURNEY: '4v4 (Tournament)',
			BEDWARS_EIGHT_ONE_RUSH: 'Rush Solo',
			BEDWARS_EIGHT_TWO_RUSH: 'Rush Doubles',
			BEDWARS_FOUR_FOUR_RUSH: 'Rush 4v4v4v4',
			BEDWARS_EIGHT_ONE_ULTIMATE: 'Ultimate Solo',
			BEDWARS_EIGHT_TWO_ULTIMATE: 'Ultimate Doubles',
			BEDWARS_FOUR_FOUR_ULTIMATE: 'Ultimate 4v4v4v4',
			BEDWARS_EIGHT_TWO_VOIDLESS: 'Voidless Doubles',
			BEDWARS_FOUR_FOUR_VOIDLESS: 'Voidless 4v4v4v4',
			BEDWARS_EIGHT_TWO_ARMED: 'Armed Doubles',
			BEDWARS_FOUR_FOUR_ARMED: 'Armed 4v4v4v4',
			BEDWARS_EIGHT_TWO_SWAP: 'Swappage Doubles',
			BEDWARS_FOUR_FOUR_SWAP: 'Swappage 4v4v4v4',
			BEDWARS_EIGHT_TWO_UNDERWORLD: 'Underworld Doubles',
			BEDWARS_FOUR_FOUR_UNDERWORLD: 'Underworld 4v4v4v4',
			BEDWARS_CASTLE: 'Castle',
			BEDWARS_PRACTICE: 'Practice',
		},
		BUILD_BATTLE:  {
			BUILD_BATTLE_SOLO_PRO: 'Pro',
			BUILD_BATTLE_SOLO_NORMAL: 'Solo',
			BUILD_BATTLE_TEAMS_NORMAL: 'Teams',
			BUILD_BATTLE_GUESS_THE_BUILD: 'Guess the Build',
			BUILD_BATTLE_HALLOWEEN: 'Halloween Hyper',
			BUILD_BATTLE_CHRISTMAS_NEW_TEAMS: 'Holiday Teams',
			BUILD_BATTLE_SOLO_NORMAL_LATEST: 'Solo (1.14+)',
			BUILD_BATTLE_CHRISTMAS_NEW_SOLO: 'Holiday Solo',
			BUILD_BATTLE_CHRISTMAS: 'Christmas',
		},
		DUELS: {
			DUELS_UHC_DUEL: 'UHC 1v1',
			DUELS_UHC_DOUBLES: 'UHC 2v2',
			DUELS_UHC_TOURNAMENT: 'UHC Championship',
			DUELS_UHC_FOUR: 'UHC 4v4',
			DUELS_UHC_MEETUP: 'UHC Deathmatch',
			DUELS_OP_DUEL: 'OP 1v1',
			DUELS_OP_DOUBLES: 'OP 2v2',
			DUELS_SW_DUEL: 'SkyWars 1v1',
			DUELS_SW_DOUBLES: 'SkyWars 2v2',
			DUELS_SW_TOURNAMENT: 'SkyWars Championship',
			DUELS_BOW_DUEL: 'Bow 1v1',
			DUELS_BLITZ_DUEL: 'Blitz 1v1',
			DUELS_MW_DUEL: 'MegaWalls 1v1',
			DUELS_MW_DOUBLES: 'MegaWalls 2v2',
			DUELS_SUMO_DUEL: 'Sumo 1v1',
			DUELS_SUMO_TOURNAMENT: 'Sumo Championship',
			DUELS_BOWSPLEEF_DUEL: 'Bow Spleef 1v1',
			DUELS_PARKOUR_EIGHT: 'Parkour',
			DUELS_BOXING_DUEL: 'Boxing 1v1',
			DUELS_CLASSIC_DUEL: 'Classic 1v1',
			DUELS_POTION_DUEL: 'NoDebuff 1v1',
			DUELS_COMBO_DUEL: 'Combo 1v1',
			DUELS_BRIDGE_DUEL: 'Bridge 1v1',
			DUELS_BRIDGE_DOUBLES: 'Bridge 2v2',
			DUELS_BRIDGE_TOURNAMENT: 'The Bridge Championship',
			DUELS_BRIDGE_THREES: 'Bridge 3v3',
			DUELS_BRIDGE_FOUR: 'Bridge 4v4',
			DUELS_BRIDGE_2V2V2V2: 'Bridge 2v2v2v2',
			DUELS_BRIDGE_3V3V3V3: 'Bridge 3v3v3v3',
			DUELS_CAPTURE_THREES: 'Bridge CTF 3v3',
			DUELS_DUEL_ARENA: 'Duel Arena',
		},
		GINGERBREAD: {},
		HOUSING: {},
		LEGACY: {},
		MAIN: {},
		MCGO: {
			normal: 'Defusal',
			gungame: 'Gun Game',
			deathmatch: 'Team Deathmatch',
			DEFUSAL_TOURNEY: 'Defusal (Tournament)'
		},
		MURDER_MYSTERY: {
			MURDER_CLASSIC: 'Classic',
			MURDER_ASSASSINS: 'Assassins',
			MURDER_INFECTION: 'Infection',
			MURDER_DOUBLE_UP: 'Double Up',
			MURDER_HARDCORE: 'Hardcore',
			MURDER_SHOWDOWN: 'Showdown',
		},
		PAINTBALL: {},
		PIT: {},
		PROTOTYPE: {},
		QUAKECRAFT: {
			teams: 'Teams',
			solo: 'Solo',
			solo_tourney: 'Solo (Tournament)'
		},
		SKYBLOCK: {
			farming_1: 'The Farming Islands',
			crystal_hollows: 'Crystal Hollows',
			winter: 'Jerry\'s Workshop',
			foraging_1: 'The Park',
			dark_auction: 'Dark Auction',
			dungeon: 'Dungeons',
			combat_3: 'The End',
			crismon_isle: 'Crimson Isle',
			hub: 'Hub',
			instanced: 'Kuudra\'s Hollow',
			dynamic: 'Private Island',
			mining_3: 'Dwarven Mines',
			garden: 'The Garden',
			mining_1: 'Gold Mine',
			combat_2: 'Blazing Fortress',
			mining_2: 'Deep Caverns',
			combat_1: 'Spider\'s Den'
		},
		SKYWARS: {
			ranked_normal: 'Ranked',
			solo_normal: 'Solo Normal',
			solo_insane: 'Solo Insane',
			team_normal: 'Teams Normal',
			team_insane: 'Teams Insane',
			mega_normal: 'Mega',
			mega_doubles: 'Mega Doubles',
			solo_insane_lucky: 'Solo Lucky Block',
			teams_normal_tourney: 'Doubles Normal (Tournament)',
			solo_insane_slime: 'Solo Slime',
			teams_insane_slime: 'Teams Slime',
			teams_insane_rush: 'Teams Rush',
			teams_insane_lucky: 'Teams Lucky Block',
			solo_crazyinsane: 'Solo Crazy Insane (Tournament)',
			teams_insane_tourney: 'Doubles Insane (Tournament)',
			solo_insane_hunters_vs_beasts: 'Solo Hunters vs Beasts',
			solo_insane_tnt_madness: 'Solo TNT Madness',
			solo_insane_rush: 'Solo Rush',
			teams_insane_tnt_madness: 'Teams TNT Madness',
		},
		SMP: {},
		SPEED_UHC: {
			solo_normal: 'Solo Normal',
			solo_insane: 'Solo Insane',
			team_normal: 'Teams Normal',
			team_insane: 'Teams Insane',
		},
		SUPER_SMASH: {
			solo_normal: 'Solo',
			teams_normal: 'Teams',
			friends_normal: 'Friends',
		},
		SURVIVAL_GAMES: {
			solo_normal: 'Solo',
			teams_normal: 'Teams',
		},
		TNTGAMES: {
			BOWSPLEEF: 'Bow Spleef',
			PVPRUN: 'PVP Run',
			TNTRUN: 'TNT Run',
			TNTAG: 'TNT Tag',
			CAPTURE: 'Wizards',
			TNTRUN_TOURNEY: 'TNT Run Tourney',
			TEAMS_NORMAL: 'Teams Mode',
		},
		TOURNAMENT: {},
		UHC: {
			SOLO: 'Solo',
			TEAMS: 'Teams',
		},
		VAMPIREZ: {},
		WALLS: {},
		WALLS3: {
			face_off: 'Face Off',
			standard: 'Standard',
		},
		WOOL_GAMES: {
			wool_wars_two_four_tourney: '4v4 (Tournament)',
			wool_wars_two_four: '4v4',
			capture_the_wool_two_twenty: 'Capture the Wool',
			sheep_wars_two_six: 'Sheep Wars',
		},
	}
}