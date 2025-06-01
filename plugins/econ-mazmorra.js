let handler = async (m, { conn, usedPrefix, command }) => {
  const user = global.db.data.users[m.chat][m.sender];
  const lvl = user.level;
  const now = Date.now();
  if (user.dungeonTime && now < user.dungeonTime) {
    let timeLeft = (user.dungeonTime - now) / 1000;
    return m.reply(`\`\`\`⏳ Debes esperar ${timeLeft.toFixed(0)} segundos para volver a entrar a la mazmorra.\`\`\``);
  }

  const floors = {
    "Goblin Grotto": {
      monsters: [
        { name: "Goblin", str: [10, 30], reward: [50, 200] },
        { name: "Hobgoblin", str: [20, 40], reward: [100, 300] },
        { name: "Goblin Shaman", str: [30, 50], reward: [150, 350] },
        { name: "Dire Wolf", str: [35, 55], reward: [200, 400] },
        { name: "Giant Rat", str: [15, 35], reward: [75, 250] },
      ],
      levelRange: [1, 10],
    },
    "Spider's Lair": {
      monsters: [
        { name: "Giant Spider", str: [40, 60], reward: [300, 500] },
        { name: "Poisonous Spider", str: [45, 65], reward: [350, 550] },
        { name: "Cave Spider", str: [50, 70], reward: [400, 600] },
        { name: "Arachne", str: [60, 80], reward: [500, 700] },
        { name: "Spider Queen", str: [70, 90], reward: [600, 800] },
        { name: "Giant Scorpion", str: [55, 75], reward: [450, 650] },
      ],
      levelRange: [11, 25],
    },
    "Dragon's Peak": {
      monsters: [
        { name: "Young Dragon", str: [70, 90], reward: [600, 800] },
        { name: "Drake", str: [75, 95], reward: [650, 850] },
        { name: "Fire Dragon", str: [80, 100], reward: [700, 900] },
        { name: "Ice Dragon", str: [90, 110], reward: [800, 1000] },
        { name: "Ancient Dragon", str: [100, 120], reward: [900, 1100] },
        { name: "Wyvern", str: [85, 105], reward: [750, 950] },
      ],
      levelRange: [26, 50],
    },
     "Infernal Abyss": {
      monsters: [
        { name: "Imp", str: [90, 110], reward: [800, 1000] },
        { name: "Cerberus", str: [95, 115], reward: [850, 1050] },
        { name: "Succubus", str: [100, 120], reward: [900, 1100] },
        { name: "Pit Fiend", str: [110, 130], reward: [1000, 1200] },
        { name: "Balrog", str: [115, 135], reward: [1050, 1250] },
        { name: "Archdemon", str: [120, 140], reward: [1100, 1300] },
      ],
      levelRange: [51, 75],
    },
    "Celestial Garden": {
      monsters: [
        { name: "Angel", str: [110, 130], reward: [1000, 1200] },
        { name: "Archangel", str: [115, 135], reward: [1050, 1250] },
        { name: "Seraphim", str: [120, 140], reward: [1100, 1300] },
        { name: "Griffin", str: [105, 125], reward: [950, 1150] },
        { name: "Pegasus", str: [110, 130], reward: [1000, 1200] },
         { name: "Phoenix", str: [125, 145], reward: [1150, 1350] },
      ],
      levelRange: [76, 100],
    },
     "Abyssal Void": {
      monsters: [
        { name: "Cthulhu Spawn", str: [130, 150], reward: [1200, 1400] },
        { name: "Deep One", str: [135, 155], reward: [1250, 1450] },
        { name: "Elder Thing", str: [140, 160], reward: [1300, 1500] },
        { name: "Shoggoth", str: [145, 165], reward: [1350, 1550] },
        { name: "Star Spawn", str: [150, 170], reward: [1400, 1600] },
         { name: "Cthulhu", str: [160, 180], reward: [1500, 1700] },
      ],
      levelRange: [101, 9999],
    },
  };

  function getRandomFloor(lvl) {
    const availableFloors = Object.entries(floors).filter(([, data]) => lvl >= data.levelRange[0] && lvl <= data.levelRange[1]);
    if (availableFloors.length === 0) {
      return Object.entries(floors)[0];
    }
    const randomIndex = Math.floor(Math.random() * availableFloors.length);
    return availableFloors[randomIndex];
  }
  function Dungeon(userLvl) {
    const [floorName, floorData] = getRandomFloor(userLvl);
    const { monsters } = floorData;
    const coinsFound = randomNumber(500, 3000);
    let msg = "";
    const generateMonster = () => {
      const monster = monsters[Math.floor(Math.random() * monsters.length)];
      if (randomNumber(1, 20) === 1) {
        const allMonsters = Object.values(floors).map(f => f.monsters).flat(); 
        const highLvlMonster = allMonsters[Math.floor(Math.random() * allMonsters.length)];
        return highLvlMonster;
      }
      return monster;
    };

    const monster = generateMonster();
    const userStr = userLvl * randomNumber(5, 15);
    let encounterChance;
    if (userLvl <= 10) encounterChance = 70;
    else if (userLvl <= 30) encounterChance = 60;
    else encounterChance = 50;

    if (randomNumber(1, 100) <= encounterChance) {
      if (userStr > randomNumber(monster.str[0], monster.str[1])) {
        const extraBonus = randomNumber(monster.reward[0], monster.reward[1]); 
        user.exp += extraBonus + coinsFound;
        msg = `\`\`\`🏰 Entraste en ${floorName} y te encontraste con un ${monster.name}! Lo derrotaste y encontraste ${coinsFound} xp + ${extraBonus} xp extras como recompensa.\`\`\``;
      } else {
        const xpLoss = Math.floor(user.exp * randomNumber(50, 75) / 100); 
        user.exp = Math.max(0, user.exp - xpLoss);
        msg = `\`\`\`💀 Entraste en ${floorName} y te encontraste con un ${monster.name}! Te derrotó y perdiste ${xpLoss} xp.\`\`\``;
      }
    } else {
      user.exp += coinsFound;
      msg = `\`\`\`💰 Entraste en ${floorName} y encontraste ${coinsFound} xp!\`\`\``;
    }

    return msg;
  }

  const result = Dungeon(lvl);
  await m.reply(result);
  user.dungeonTime = now + 30000;
};

handler.help = ["dungeon"];
handler.tags = ["economy"];
handler.command = ["dungeon", "mazmorra", "explorar"];

export default handler;

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}