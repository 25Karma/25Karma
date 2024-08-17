export const SKYWARS = {
	TITLE : 'SkyWars',
	INITIAL_XP: [0, 20, 70, 150, 250, 500, 1000, 2000, 3500, 6000, 10000, 15000],
	RECURRING_XP: 10000,
	PRESTIGES : [
		{level: 0,  color: 'gray', b_color: 'gray', name: 'None'}, 
		{level: 5,  color: 'white', b_color: 'white', name: 'Iron'}, 
		{level: 10, color: 'gold', b_color: 'gold', name: 'Gold'}, 
		{level: 15, color: 'aqua', b_color: 'aqua', name: 'Diamond'}, 
		{level: 20, color: 'darkgreen', b_color: 'darkgreen', name: 'Emerald'}, 
		{level: 25, color: 'darkaqua', b_color: 'darkaqua', name: 'Sapphire'}, 
		{level: 30, color: 'darkred', b_color: 'darkred', name: 'Ruby'}, 
		{level: 35, color: 'pink', b_color: 'pink', name: 'Crystal'}, 
		{level: 40, color: 'blue', b_color: 'blue', name: 'Opal'}, 
		{level: 45, color: 'purple', b_color: 'purple', name: 'Amethyst'}, 
		{level: 50, color: 'rainbow', b_color: 'red', name: 'Rainbow'}, 
		{level: 55, color: 'white', b_color: 'gray', name: 'First Class'}, 
		{level: 60, color: 'red', b_color: 'darkred', name: 'Assassin'}, 
		{level: 65, color: 'white', b_color: 'red', name: 'Veteran'}, 
		{level: 70, color: 'gold', b_color: 'yellow', name: 'God Like'}, 
		{level: 75, color: 'blue', b_color: 'white', name: 'Warrior'}, 
		{level: 80, color: 'aqua', b_color: 'white', name: 'Captain'}, 
		{level: 85, color: 'darkaqua', b_color: 'white', name: 'Soldier'}, 
		{level: 90, color: 'darkaqua', b_color: 'green', name: 'Infantry'}, 
		{level: 95, color: 'yellow', b_color: 'red', name: 'Sergeant'}, 
		{level: 100, color: 'darkblue', b_color: 'blue', name: 'Lieutenant'}, 
		{level: 105, color: 'darkred', b_color: 'gold', name: 'Admiral'}, 
		{level: 110, color: 'aqua', b_color: 'darkblue', name: 'General'}, 
		{level: 115, color: 'gray', b_color: 'darkgray', name: 'Villain'}, 
		{level: 120, color: 'purple', b_color: 'pink', name: 'Skilled'}, 
		{level: 125, color: 'yellow', b_color: 'white', name: 'Sneaky'}, 
		{level: 130, color: 'yellow', b_color: 'red', name: 'Overlord'}, 
		{level: 135, color: 'red', b_color: 'gold', name: 'War Chief'}, 
		{level: 140, color: 'red', b_color: 'green', name: 'Warlock'}, 
		{level: 145, color: 'aqua', b_color: 'green', name: 'Emperor'}, 
		{level: 150, color: 'rainbow font-bold', b_color: 'red font-bold', name: 'Mythic'}, 
	],
	ICONS : {
		default: '\u22c6', // ⋆
		angel_1: '\u2605', // ★
		angel_2: '\u2606', // ☆
		angel_3: '\u2055', // ⁕
		angel_4: '\u2736', // ✶
		angel_5: '\u2733', // ✳
		angel_6: '\u2734', // ✴
		angel_7: '\u2737', // ✷
		angel_8: '\u274b', // ❋
		angel_9: '\u273c', // ✼
		angel_10: '\u2742', // ❂
		angel_11: '\u2741', // ❁
		angel_12: '\u262c', // ☬
		iron_prestige: '\u2719', // ✙
		gold_prestige: '\u2764', // ❤
		diamond_prestige: '\u2620', // ☠
		emerald_prestige: '\u2726', // ✦
		sapphire_prestige: '\u270c', // ✌
		ruby_prestige: '\u2766', // ❦
		crystal_prestige: '\u2735', // ✵
		opal_prestige: '\u2763', // ❣
		amethyst_prestige: '\u262f', // ☯
		rainbow_prestige: '\u273a', // ✺
		first_class_prestige: '\u2708', // ✈
		assassin_prestige: '\u26b0', // ⚰
		veteran_prestige: '\u2720', // ✠
		god_like_prestige: '\u2655', // ♕
		warrior_prestige: '\u26a1', // ⚡
		captain_prestige: '\u2042', // ⁂
		soldier_prestige: '\u2730', // ✰
		infantry_prestige: '\u2051', // ⁑
		sergeant_prestige: '\u2622', // ☢
		lieutenant_prestige: '\u2725', // ✥
		admiral_prestige: '\u265d', //♝
		general_prestige: '\u2646', // ♆
		villain_prestige: '\u2601', // ☁
		skilled_prestige: '\u235f', // ⍟
		sneaky_prestige: '\u2657', // ♗
		overlord_prestige: '<Error icon="overlord"/>', //
		war_chief_prestige: '\u265e', // ♞
		warlock_prestige: '<Error icon="warlock"/>', //
		emperor_prestige: '\u2748', // ❈
		mythic_prestige: '\u0ca0_\u0ca0', // ಠ_ಠ
		favor_icon: '\u2694', // ⚔
		omega_icon: '\u03a9', // Ω
	},
	MODES : [
		{id: '_ranked',       name: 'Ranked'},
		{id: '_solo_normal',  name: 'Solo Normal'},
		{id: '_solo_insane',  name: 'Solo Insane'},
		{id: '_team_normal',  name: 'Teams Normal'},
		{id: '_team_insane',  name: 'Teams Insane'},
		{id: '_mega_normal',  name: 'Mega'},
		{id: '_mega_doubles', name: 'Mega Doubles'},
		{id: '', name: 'Overall'},
	],
	HEADS : [
		{id: 'eww',       name: 'Eww!',      color: 'darkgray'},
		{id: 'yucky',     name: 'Yucky!',    color: 'gray'},
		{id: 'meh',       name: 'Meh',       color: 'white'},
		{id: 'decent',    name: 'Decent',    color: 'yellow'},
		{id: 'salty',     name: 'Salty',     color: 'green'},
		{id: 'tasty',     name: 'Tasty',     color: 'darkaqua'},
		{id: 'succulent', name: 'Succulent', color: 'pink'},
		{id: 'sweet',     name: 'Sweet',     color: 'aqua'},
		{id: 'divine',    name: 'Divine',    color: 'gold'},
		{id: 'heavenly',  name: 'Heavenly',  color: 'purple'},
	],
}