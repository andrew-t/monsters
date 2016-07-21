window.monsterdex = {

	Test: {
		type: "example",
		rarity: 1
	}

	/*Bojo: {
		evolution: "Trumpo",
		type: "Batshit/Racist",
		rarity: 1
	},
	Trumpo: {
		evolution: "Baybo",
		type: "Batshit/Racist",
		rarity: 3
	},
	Baybo: {
		type: "Batshit/Racist",
		rarity: 8
	},

	Ledzom: {
		type: "Plant/Tory",
		evolution: "Trees Army",
		rarity: 2
	},
	"Trees Army": {
		type: "Plant/Tory",
		evolution: "Trees Army",
		rarity: 1
	},
	Thatcher: {
		type: "Plant/Tory",
		rarity: 5
	}*/
};

// flesh it out a tad
window.monsterArray = [];
var totalCommonness = 0;
for (var name in monsterdex) {
	var monster = monsterdex[name];
	monster.name = name;
	monster.commonness = 1 / monster.rarity;
	totalCommonness += monster.commonness;
	monster.imageUrl = '/monster-images/' + name.toLowerCase().replace(' ', '-') + '.png';
	if (monster.evolution) {
		monster.evolution = monsterdex[monster.evolution];
		monster.evolution.evolvesFrom = monster;
	}
	monsterArray.push(monster);
}
window.monsterArray.forEach(function(monster) {
	monster.commonness /= totalCommonness;
});