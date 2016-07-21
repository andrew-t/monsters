window.monsterdex = {

	Test: {
		type: "example",
		evolution: "Test 2",
		rarity: 1
	},
	"Test 2": {
		type: "example",
		rarity: 2
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
for (var name in monsterdex) {
	var monster = monsterdex[name];
	monster.name = name;
	monster.imageUrl = 'monster-images/' + name.toLowerCase().replace(' ', '-') + '.png';
	if (monster.evolution) {
		monster.evolution = monsterdex[monster.evolution];
		monster.evolution.evolvesFrom = monster;
	}
	monsterArray.push(monster);
}
var totalCommonness = 0;
window.monsterArray.forEach(function(monster) {
	monster.commonness = 1 / monster.rarity;
	totalCommonness += monster.commonness;
});
window.monsterArray.forEach(function(monster) {
	monster.commonness /= totalCommonness;
});