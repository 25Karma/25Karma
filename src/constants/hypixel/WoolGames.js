export const WOOLGAMES = {
	TITLE: 'Wool Games',
	EASY_XP: [5000, 1000, 2000, 3000, 4000],
	NORMAL_XP: 5000,
	PRESTIGES: [
		{level: 0, colormap: '7', color: 'gray', name: 'None'},
		{level: 100, colormap: 'f', color: 'white', name: 'Sheep'},
		{level: 200, colormap: 'c', color: 'red', name: 'First Arc'},
		{level: 300, colormap: '6', color: 'gold', name: 'Second Arc'},
		{level: 400, colormap: 'e', color: 'yellow', name: 'Third Arc'},
		{level: 500, colormap: 'a', color: 'green', name: 'Fourth Arc'},
		{level: 600, colormap: '3', color: 'darkaqua', name: 'Fifth Arc'},
		{level: 700, colormap: '5', color: 'purple', name: 'Sixth Arc'},
		{level: 800, colormap: 'd', color: 'pink', name: 'Final Arc'},
		{level: 900, colormap: 'c6eabd', color: 'rainbow', name: 'Full Rainbow'},
		{level: 1000, colormap: '0fffff0', color: 'black text-light-shadow', name: 'Void Sheep'},
	],
	ICONS: {
		HEART: '\u2764', // ❤
		PLUS: '\u2719', // ✙
		STAR: '\u2606', // ☆
		PLANE: '\u2708', // ✈
		CROSS: '\u2720', // ✠
		CROWN: '\u2655', // ♕
		LIGHTNING: '\u26a1', // ⚡
		NUKE: '\u2622', // ☢
		PENSUL: '\u270f', // ✏
		YIN_YANG: '\u262f', // ☯
	},
	CLASSES: [
		{id: 'tank', name: 'Tank', difficulty: '1'},
		{id: 'archer', name: 'Archer', difficulty: '2'},
		{id: 'swordsman', name: 'Swordsman', difficulty: '1'},
		{id: 'engineer', name: 'Engineer', difficulty: '1'},
		{id: 'golem', name: 'Golem', difficulty: '2'},
		{id: 'assault', name: 'Assault', difficulty: '3'},
	],
	DIFFICULTIES: {
		'1': 'green',
		'2': 'yellow',
		'3': 'red',
		'4': 'darkred',
	},
}