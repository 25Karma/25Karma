export const COPSANDCRIMS = {
	TITLE: 'Cops And Crims',
	MODES: [
		{id: '', name: 'Defusal'},
		{id: '_deathmatch', name: 'Team Deathmatch'},
		{id: '_gungame', name: 'Gun Game'},
	],
	GUNS: [
		{id: 'knife', name: 'Knife'},
		{id: 'pistol', name: 'Pistol'},
		{id: 'handgun', name: 'Handgun'},
		{id: 'magnum', name: 'Magnum'},
		{id: 'sniper', name: 'Sniper'},
		{id: 'bullpup', name: 'Bullpup'},
		{id: 'smg', name: 'SMG'},
		{id: 'rifle', name: 'Rifle'},
		{id: 'carbine', name: 'Carbine'},
		{id: 'scoped_rifle', name: 'Scoped Rifle'},
		{id: 'shotgun', name: 'Shotgun'},
		{id: 'auto_shotgun', name: 'Auto Shotgun'},
	],
	SCORE: [
		{score: 0, color: 'gray'},
		{score: 2500, color: 'white'},
		{score: 5000, color: 'yellow'},
		{score: 20000, color: 'gold'},
		{score: 50000, color: 'darkaqua'},
		{score: 100000, color: 'red'},
	],
	UPGRADES: [
		{id: 'damage_increase', name: 'Damage Increase'},
		{id: 'recoil_reduction', name: 'Recoil Reduction'},
		{id: 'charge_bonus', name: 'Target Acquire'}, // For sniper only
		{id: 'reload_speed_reduction', name: 'Reload Time Reduction'},
		{id: 'cost_reduction', name: 'Cost Reduction'},
		{id: 'attack_delay', name: 'Attack Delay'}, // For knife only
	],
	UPGRADELEVELS: [
		{level: 0, color: 'gray'},
		{level: 3, color: 'yellow'},
		{level: 6, color: 'red'},
		{level: 9, color: 'darkred'},
	]
}