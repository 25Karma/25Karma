export const WOOLWARS = {
	TITLE: 'Wool Wars',
	EASY_XP: [(level) => { if(level >= 100) { return 5000 } else { return 1 } }, 1000, 2000, 3000, 4000],
	NORMAL_XP: 5000,
	PRESTIGES: [
		{level: 0, colormap: '7', color: 'gray', name: 'None'},
		{level: 100, colormap: 'f', color: 'white', name: 'Iron'},
		{level: 200, colormap: 'c', color: 'red', name: 'Red'},
		{level: 300, colormap: '6', color: 'gold', name: 'Gold'},
	],
	PRESTIGE_ICONS: [
		{level: 0, symbol: '✫'},
	],
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