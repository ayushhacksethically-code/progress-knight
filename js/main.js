var gameData = {
    taskData: {},
    itemData: {},

    coins: 0,
    days: 365 * 14,
    evil: 0,
    paused: false,
    timeWarpingEnabled: true,

    prestigePoints: 0,
    merchantsBlessing: false,
    autoJob: null,
    autoSkill: null,

    rebirthOneCount: 0,
    rebirthTwoCount: 0,

    currentJob: null,
    currentSkill: null,
    currentProperty: null,
    currentMisc: null,
}

var tempData = {}
var skillWithLowestMaxXp = null

var gameSpeedMultiplier = 5

const autoPromoteElement = document.getElementById("autoPromote")
const autoLearnElement = document.getElementById("autoLearn")

const updateSpeed = 20
const baseLifespan = 365 * 70
const baseGameSpeed = 4

const permanentUnlocks = ["Scheduling", "Shop", "Automation", "Quick task display"]

const jobBaseData = {
    "Beggar": {name: "Beggar", maxXp: 50, income: 5},
    "Farmer": {name: "Farmer", maxXp: 100, income: 9},
    "Fisherman": {name: "Fisherman", maxXp: 200, income: 15},
    "Miner": {name: "Miner", maxXp: 400, income: 40},
    "Blacksmith": {name: "Blacksmith", maxXp: 800, income: 80},
    "Merchant": {name: "Merchant", maxXp: 1600, income: 150},

    "Squire": {name: "Squire", maxXp: 100, income: 5},
    "Footman": {name: "Footman", maxXp: 1000, income: 50},
    "Veteran footman": {name: "Veteran footman", maxXp: 10000, income: 120},
    "Knight": {name: "Knight", maxXp: 100000, income: 300},
    "Veteran knight": {name: "Veteran knight", maxXp: 1000000, income: 1000},
    "Elite knight": {name: "Elite knight", maxXp: 7500000, income: 3000},
    "Holy knight": {name: "Holy knight", maxXp: 40000000, income: 15000},
    "Legendary knight": {name: "Legendary knight", maxXp: 150000000, income: 50000},

    // New Class: Mage
    "Apprentice": {name: "Apprentice", maxXp: 350, income: 60},
    "Wizard": {name: "Wizard", maxXp: 3000, income: 450},
    "Archmage": {name: "Archmage", maxXp: 35000, income: 4000},

    "Student": {name: "Student", maxXp: 100000, income: 100},
    "Apprentice mage": {name: "Apprentice mage", maxXp: 1000000, income: 1000},
    "Mage": {name: "Mage", maxXp: 10000000, income: 7500},
    "Grand wizard": {name: "Grand wizard", maxXp: 100000000, income: 50000},
    "Master wizard": {name: "Master wizard", maxXp: 10000000000, income: 250000},
    "Chairman": {name: "Chairman", maxXp: 1000000000000, income: 1000000},
    // Mythical / Overlord Jobs
    "Trade Prince": {name: "Trade Prince", maxXp: 500, income: 500000},
    "Shadow Broker": {name: "Shadow Broker", maxXp: 2000, income: 1500000},
    "Midas": {name: "Midas", maxXp: 10000, income: 10000000},
}

const skillBaseData = {
    "Concentration": {name: "Concentration", maxXp: 100, effect: 0.01, description: "Skill xp"},
    "Productivity": {name: "Productivity", maxXp: 100, effect: 0.01, description: "Job xp"},
    "Bargaining": {name: "Bargaining", maxXp: 100, effect: -0.01, description: "Expenses"},
    "Meditation": {name: "Meditation", maxXp: 100, effect: 0.01, description: "Happiness"},

    "Strength": {name: "Strength", maxXp: 100, effect: 0.01, description: "Military pay"},
    "Battle tactics": {name: "Battle tactics", maxXp: 100, effect: 0.01, description: "Military xp"},
    "Muscle memory": {name: "Muscle memory", maxXp: 100, effect: 0.01, description: "Strength xp"},

    "Mana control": {name: "Mana control", maxXp: 100, effect: 0.01, description: "Magic & Mage xp"},
    "Spellcraft": {name: "Spellcraft", maxXp: 150, effect: 0.02, description: "Mage income & xp"},
    "Immortality": {name: "Immortality", maxXp: 100, effect: 0.01, description: "Longer lifespan"},
    "Time warping": {name: "Time warping", maxXp: 100, effect: 0.01, description: "Gamespeed"},
    "Super immortality": {name: "Super immortality", maxXp: 100, effect: 0.01, description: "Longer lifespan"},

    "Dark influence": {name: "Dark influence", maxXp: 100, effect: 0.01, description: "All xp"},
    "Evil control": {name: "Evil control", maxXp: 100, effect: 0.01, description: "Evil gain"},
    "Intimidation": {name: "Intimidation", maxXp: 100, effect: -0.01, description: "Expenses"},
    "Demon training": {name: "Demon training", maxXp: 100, effect: 0.01, description: "All xp"},
    "Blood meditation": {name: "Blood meditation", maxXp: 100, effect: 0.01, description: "Evil gain"},
    "Demon's wealth": {name: "Demon's wealth", maxXp: 100, effect: 0.002, description: "Job pay"},
}

const itemBaseData = {
    "Homeless": {name: "Homeless", expense: 0, effect: 1},
    "Tent": {name: "Tent", expense: 15, effect: 1.4},
    "Wooden hut": {name: "Wooden hut", expense: 100, effect: 2},
    "Cottage": {name: "Cottage", expense: 750, effect: 3.5},
    "House": {name: "House", expense: 3000, effect: 6},
    "Large house": {name: "Large house", expense: 25000, effect: 12},
    "Small palace": {name: "Small palace", expense: 300000, effect: 25},
    "Grand palace": {name: "Grand palace", expense: 5000000, effect: 60},

    "Book": {name: "Book", expense: 10, effect: 1.5, description: "Skill xp"},
    "Dumbbells": {name: "Dumbbells", expense: 50, effect: 1.5, description: "Strength xp"},
    "Personal squire": {name: "Personal squire", expense: 200, effect: 2, description: "Job xp"},
    "Steel longsword": {name: "Steel longsword", expense: 1000, effect: 2, description: "Military xp"},
    "Butler": {name: "Butler", expense: 7500, effect: 1.5, description: "Happiness"},
    "Sapphire charm": {name: "Sapphire charm", expense: 50000, effect: 3, description: "Magic xp"},
    "Study desk": {name: "Study desk", expense: 1000000, effect: 2, description: "Skill xp"},
    "Library": {name: "Library", expense: 10000000, effect: 1.5, description: "Skill xp"},
}

const jobCategories = {
    "Common work": ["Beggar", "Farmer", "Fisherman", "Miner", "Blacksmith", "Merchant"],
    "Military" : ["Squire", "Footman", "Veteran footman", "Knight", "Veteran knight", "Elite knight", "Holy knight", "Legendary knight"],
    "Mage": ["Apprentice", "Wizard", "Archmage"],
    "The Arcane Association" : ["Student", "Apprentice mage", "Mage", "Grand wizard", "Master wizard", "Chairman"],
    "Mythical / Overlord": ["Trade Prince", "Shadow Broker", "Midas"]
}

const skillCategories = {
    "Fundamentals": ["Concentration", "Productivity", "Bargaining", "Meditation"],
    "Combat": ["Strength", "Battle tactics", "Muscle memory"],
    "Magic": ["Mana control", "Spellcraft", "Immortality", "Time warping", "Super immortality"],
    "Dark magic": ["Dark influence", "Evil control", "Intimidation", "Demon training", "Blood meditation", "Demon's wealth"]
}

const itemCategories = {
    "Properties": ["Homeless", "Tent", "Wooden hut", "Cottage", "House", "Large house", "Small palace", "Grand palace"],
    "Misc": ["Book", "Dumbbells", "Personal squire", "Steel longsword", "Butler", "Sapphire charm", "Study desk", "Library"]
}

const categoryAccentColors = {
    "Common work": "#3b82f6",
    "Military": "#f43f5e",
    "Mage": "#a855f7",
    "The Arcane Association": "#c084fc",
    "Mythical / Overlord": "#f59e0b",
    "Fundamentals": "#64748b",
    "Combat": "#f97316",
    "Magic": "#38bdf8",
    "Dark magic": "#ec4899",
    "Properties": "#10b981",
    "Misc": "#14b8a6",
}

const headerRowColors = categoryAccentColors

const tooltips = {
    "Beggar": "Struggle day and night for a couple of copper coins. It feels like you are at the brink of death each day.",
    "Farmer": "Plow the fields and grow the crops. It's not much but it's honest work.",
    "Fisherman": "Reel in various fish and sell them for a handful of coins. A relaxing but still a poor paying job.",
    "Miner": "Delve into dangerous caverns and mine valuable ores. The pay is quite meager compared to the risk involved.",
    "Blacksmith": "Smelt ores and carefully forge weapons for the military. A respectable and OK paying commoner job.",
    "Merchant": "Travel from town to town, bartering fine goods. The job pays decently well and is a lot less manually-intensive.",

    "Squire": "Carry around your knight's shield and sword along the battlefield. Very meager pay but the work experience is quite valuable.",
    "Footman": "Put down your life to battle with enemy soldiers. A courageous, respectable job but you are still worthless in the grand scheme of things.",
    "Veteran footman": "More experienced and useful than the average footman, take out the enemy forces in battle with your might. The pay is not that bad.",
    "Knight": "Slash and pierce through enemy soldiers with ease, while covered in steel from head to toe. A decently paying and very respectable job.",
    "Veteran knight": "Utilising your unmatched combat ability, slaughter enemies effortlessly. Most footmen in the military would never be able to acquire such a well paying job like this.",
    "Elite knight": "Obliterate squadrons of enemy soldiers in one go with extraordinary proficiency, while equipped with the finest gear. Such a feared unit on the battlefield is paid extremely well.",
    "Holy knight": "Collapse entire armies in mere seconds with your magically imbued blade. The handful of elite knights who attain this level of power are showered with coins.",
    "Legendary knight": "Feared worldwide, obliterate entire nations in a blink of an eye. Roughly every century, only one holy knight is worthy of receiving such an esteemed title.",

    "Apprentice": "Channel your internal mana through basic spell incantations. Generous pay for an eager student of the arcane arts.",
    "Wizard": "Wield destructive arcane spells and unravel cosmic mysteries. Revered and richly compensated by kingdoms far and wide.",
    "Archmage": "Master of elemental forces, space, and reality. An apex spellcaster who commands immense fortunes and celestial power.",

    "Student": "Study the theory of mana and practice basic spells. There is minor pay to cover living costs, however, this is a necessary stage in becoming a mage.",
    "Apprentice mage": "Under the supervision of a mage, perform basic spells against enemies in battle. Generous pay will be provided to cover living costs.",
    "Mage": "Turn the tides of battle through casting intermediate spells and mentor other apprentices. The pay for this particular job is extremely high.",
    "Grand wizard": "Utilise advanced spells to ravage and destroy entire legions of enemy soldiers. Rewarded with an insanely high pay.",
    "Master wizard": "Blessed with unparalleled talent, perform unbelievable feats with magic at will. It is said that a master wizard has enough destructive power to wipe an empire off the map.",
    "Chairman": "Spend your days administrating The Arcane Association and investigate the concepts of true immortality. The chairman receives ludicrous amounts of pay daily.",

    "Trade Prince": "Ruler of subterranean syndicates and global monopolies. Grants +2x global income to all jobs.",
    "Shadow Broker": "Whisperer of continental secrets and dealer of nations. Bestows a permanent +10% boost to all skill XP.",
    "Midas": "The Mythical Golden King whose touch turns every burden to gold. Completely reduces all daily living expenses to 0.",

    "Concentration": "Improve your learning speed through practising intense concentration activities.",
    "Productivity": "Learn to procrastinate less at work and receive more job experience per day.",
    "Bargaining": "Study the tricks of the trade and persuasive skills to lower any type of expense.",
    "Meditation": "Fill your mind with peace and tranquility to tap into greater happiness from within.",

    "Strength": "Condition your body and strength through harsh training. Stronger individuals are paid more in the military.",
    "Battle tactics": "Create and revise battle strategies, improving experience gained in the military.",
    "Muscle memory": "Strengthen your neurons through habit and repetition, improving strength gains throughout the body.",

    "Mana control": "Strengthen your mana channels throughout your body, aiding you in becoming a more powerful magical user.",
    "Spellcraft": "Refine the art of shaping magical energy into incantations, heavily boosting Mage class income and experience.",
    "Immortality": "Lengthen your lifespan through the means of magic. However, is this truly the immortality you have tried seeking for...?",
    "Time warping": "Bend space and time through forbidden techniques, resulting in a faster gamespeed.",
    "Super immortality": "Through harnessing ancient, forbidden techniques, lengthen your lifespan drastically beyond comprehension.",

    "Dark influence": "Encompass yourself with formidable power bestowed upon you by evil, allowing you to pick up and absorb any job or skill with ease.",
    "Evil control": "Tame the raging and growing evil within you, improving evil gain in-between rebirths.",
    "Intimidation": "Learn to emit a devilish aura which strikes extreme fear into other merchants, forcing them to give you heavy discounts.",
    "Demon training": "A mere human body is too feeble and weak to withstand evil. Train with forbidden methods to slowly manifest into a demon, capable of absorbing knowledge rapidly.",
    "Blood meditation": "Grow and culture the evil within you through the sacrifice of other living beings, drastically increasing evil gain.",
    "Demon's wealth": "Through the means of dark magic, multiply the raw matter of the coins you receive from your job.",

    "Homeless": "Sleep on the uncomfortable, filthy streets while almost freezing to death every night. It cannot get any worse than this.",
    "Tent": "A thin sheet of tattered cloth held up by a couple of feeble, wooden sticks. Horrible living conditions but at least you have a roof over your head.",
    "Wooden hut": "Shabby logs and dirty hay glued together with horse manure. Much more sturdy than a tent, however, the stench isn't very pleasant.",
    "Cottage": "Structured with a timber frame and a thatched roof. Provides decent living conditions for a fair price.",
    "House": "A building formed from stone bricks and sturdy timber, which contains a few rooms. Although quite expensive, it is a comfortable abode.",
    "Large house": "Much larger than a regular house, which boasts even more rooms and multiple floors. The building is quite spacious but comes with a hefty price tag.",
    "Small palace": "A very rich and meticulously built structure rimmed with fine metals such as silver. Extremely high expenses to maintain for a lavish lifestyle.",
    "Grand palace": "A grand residence completely composed of gold and silver. Provides the utmost luxurious and comfortable living conditions possible for a ludicrous price.",

    "Book": "A place to write down all your thoughts and discoveries, allowing you to learn a lot more quickly.",
    "Dumbbells": "Heavy tools used in strenuous exercise to toughen up and accumulate strength even faster than before.",
    "Personal squire": "Assists you in completing day to day activities, giving you more time to be productive at work.",
    "Steel longsword": "A fine blade used to slay enemies even quicker in combat and therefore gain more experience.",
    "Butler": "Keeps your household clean at all times and also prepares three delicious meals per day, leaving you in a happier, stress-free mood.",
    "Sapphire charm": "Embedded with a rare sapphire, this charm activates more mana channels within your body, providing a much easier time learning magic.",
    "Study desk": "A dedicated area which provides many fine stationery and equipment designed for furthering your progress in research.",
    "Library": "Stores a collection of books, each containing vast amounts of information from basic life skills to complex magic spells.",
}

const units = ["", "k", "M", "B", "T", "q", "Q", "Sx", "Sp", "Oc"]
const jobTabButton = document.getElementById("jobTabButton")

const demonRanks = [
    // Tier 1: Lesser Spawns (Lvl 1 - 25)
    {minLvl: 1, maxLvl: 3, name: "Imp (Chhote Shaitan)", tier: "Tier 1: Lesser Spawn", tierBadge: "Tier 1", tierColor: "#16a34a", desc: "Chote shaitan jo basic chaos aur dark energy absorb karte hain.", bonus: 1.05},
    {minLvl: 4, maxLvl: 7, name: "Gremlin", tier: "Tier 1: Lesser Spawn", tierBadge: "Tier 1", tierColor: "#16a34a", desc: "Shararti jantu jo machines aur magic ko alter karte hain.", bonus: 1.10},
    {minLvl: 8, maxLvl: 12, name: "Hellhound (Narki Shikari)", tier: "Tier 1: Lesser Spawn", tierBadge: "Tier 1", tierColor: "#16a34a", desc: "Narak ki aag se bane hue tez shikar karne wale praani.", bonus: 1.15},
    {minLvl: 13, maxLvl: 18, name: "Fiend (Demonic Soldier)", tier: "Tier 1: Lesser Spawn", tierBadge: "Tier 1", tierColor: "#16a34a", desc: "Demonic fauj ke frontline warriors.", bonus: 1.20},
    {minLvl: 19, maxLvl: 25, name: "Wraith (Pret)", tier: "Tier 1: Lesser Spawn", tierBadge: "Tier 1", tierColor: "#16a34a", desc: "Sirf aatma aur chhaaya se bane hue dangerous pret.", bonus: 1.28},

    // Tier 2: Mid-Tier Demons (Lvl 26 - 65)
    {minLvl: 26, maxLvl: 33, name: "Incubus / Succubus", tier: "Tier 2: Mid-Tier", tierBadge: "Tier 2", tierColor: "#eab308", desc: "Prana aur aatma ki urja ko sookhne wale mayawi demons.", bonus: 1.38},
    {minLvl: 34, maxLvl: 42, name: "Oni (Rākshasa)", tier: "Tier 2: Mid-Tier", tierBadge: "Tier 2", tierColor: "#eab308", desc: "Brutal takat aur horns wale vishal yoddha.", bonus: 1.50},
    {minLvl: 43, maxLvl: 51, name: "Hell Knight", tier: "Tier 2: Mid-Tier", tierBadge: "Tier 2", tierColor: "#eab308", desc: "Cursed black armor se susajjit narak ke senani.", bonus: 1.65},
    {minLvl: 52, maxLvl: 65, name: "Nightmare Weaver", tier: "Tier 2: Mid-Tier", tierBadge: "Tier 2", tierColor: "#eab308", desc: "Darr aur bharm paida karke dimag ko qabu karne wale.", bonus: 1.80},

    // Tier 3: High-Tier Demons (Lvl 66 - 120)
    {minLvl: 66, maxLvl: 78, name: "Archfiend", tier: "Tier 3: High-Tier", tierBadge: "Tier 3", tierColor: "#f97316", desc: "Prachand shakti wale mahabali demonic adhyaksh.", bonus: 2.00},
    {minLvl: 79, maxLvl: 92, name: "Infernal Balrog", tier: "Tier 3: High-Tier", tierBadge: "Tier 3", tierColor: "#f97316", desc: "Aag ke chaabuk aur jwala se dahekne wale parvat-samaani danav.", bonus: 2.25},
    {minLvl: 93, maxLvl: 106, name: "Shadow Stalker", tier: "Tier 3: High-Tier", tierBadge: "Tier 3", tierColor: "#f97316", desc: "Andhere mein chalne wale ghatak one-hit assassins.", bonus: 2.50},
    {minLvl: 107, maxLvl: 120, name: "Demon Commander", tier: "Tier 3: High-Tier", tierBadge: "Tier 3", tierColor: "#f97316", desc: "Hazaron narki sainikon ka netritva karne wale senapati.", bonus: 2.80},

    // Tier 4: Elite Commander Tier (Lvl 121 - 200)
    {minLvl: 121, maxLvl: 140, name: "Demon Duke (Narki Sardar)", tier: "Tier 4: Elite Commander", tierBadge: "Tier 4", tierColor: "#ef4444", desc: "Patal lok ke shreshtha kshetron ke mantri aur commander.", bonus: 3.20},
    {minLvl: 141, maxLvl: 160, name: "Abyssal Prince (Patal Rajkumar)", tier: "Tier 4: Elite Commander", tierBadge: "Tier 4", tierColor: "#ef4444", desc: "Gehre abyss ke rajyapal aur shaktishali raajvanshi.", bonus: 3.70},
    {minLvl: 161, maxLvl: 180, name: "Archdemon", tier: "Tier 4: Elite Commander", tierBadge: "Tier 4", tierColor: "#ef4444", desc: "Prachin kaal se jeevit pralaykari maha-rakshas.", bonus: 4.30},
    {minLvl: 181, maxLvl: 200, name: "Seven Sins Incarnate", tier: "Tier 4: Elite Commander", tierBadge: "Tier 4", tierColor: "#ef4444", desc: "Krodh, Lobh aur Ahankar ke sakshat avtar.", bonus: 5.00},

    // Tier 5: Sovereign Tier (Lvl 201 - 350)
    {minLvl: 201, maxLvl: 240, name: "Demon King (Maou)", tier: "Tier 5: Sovereign", tierBadge: "Tier 5", tierColor: "#a855f7", desc: "Samast asur aur demon kul ke sarvochch samrat.", bonus: 6.20},
    {minLvl: 241, maxLvl: 280, name: "Abyssal Sovereign", tier: "Tier 5: Sovereign", tierBadge: "Tier 5", tierColor: "#a855f7", desc: "Anant patal lok (Abyss) ke amar adhipati.", bonus: 7.50},
    {minLvl: 281, maxLvl: 320, name: "The Fallen Seraph", tier: "Tier 5: Sovereign", tierBadge: "Tier 5", tierColor: "#a855f7", desc: "Devlok se bhrasht hua anant kaali urja ka swami.", bonus: 9.00},
    {minLvl: 321, maxLvl: 350, name: "Cosmic Devourer", tier: "Tier 5: Sovereign", tierBadge: "Tier 5", tierColor: "#a855f7", desc: "Taaron aur roohon ko nigal jane wala maha-asur.", bonus: 11.00},

    // Tier 6: GOD TIER (Lvl 351+)
    {minLvl: 351, maxLvl: 420, name: "Demon God (Mazoku)", tier: "Tier 6: GOD TIER", tierBadge: "Tier 6", tierColor: "#f59e0b", desc: "Demonic simaon ko paar karke cosmic bhagwan bana praani.", bonus: 14.00},
    {minLvl: 421, maxLvl: 500, name: "Primordial Overlord", tier: "Tier 6: GOD TIER", tierBadge: "Tier 6", tierColor: "#f59e0b", desc: "Samay aur shrishti ke nirman se pehle ka amartya shaasak.", bonus: 18.00},
    {minLvl: 501, maxLvl: 650, name: "Lord of Chaos", tier: "Tier 6: GOD TIER", tierBadge: "Tier 6", tierColor: "#f59e0b", desc: "Samast brahmand ki shunya aur pralay ka mul strot.", bonus: 24.00},
    {minLvl: 651, maxLvl: Infinity, name: "The Absolute Void", tier: "Tier 6: GOD TIER", tierBadge: "Tier 6", tierColor: "#f59e0b", desc: "Jahan se saari dark magic aur reality janam leti aur vilin hoti hai.", bonus: 32.00},
]

function isDemonActive() {
    var dt = gameData.taskData["Demon training"]
    var dtLvl = dt ? Math.max(dt.level, dt.maxLevel || 0) : 0
    return (gameData.evil > 0 || gameData.rebirthTwoCount > 0 || dtLvl > 0)
}

function getDemonLevel() {
    if (!isDemonActive()) return 0
    var dt = gameData.taskData["Demon training"]
    var dtLvl = dt ? Math.max(dt.level, dt.maxLevel || 0) : 0
    var evilLvl = Math.floor(Math.sqrt((gameData.evil || 0) * 2))
    var lvl = Math.max(1, dtLvl + evilLvl)
    return lvl
}

function getCurrentDemonRank() {
    if (!isDemonActive()) {
        return {minLvl: 0, maxLvl: 0, name: "Mortal (Manushya)", tier: "Mortal", tierBadge: "Mortal", tierColor: "#94a3b8", desc: "Demonic shakti abhi jagrit nahi hui hai.", bonus: 1.00}
    }
    var lvl = getDemonLevel()
    for (var i = 0; i < demonRanks.length; i++) {
        var r = demonRanks[i]
        if (lvl >= r.minLvl && lvl <= r.maxLvl) {
            return r
        }
    }
    return demonRanks[demonRanks.length - 1]
}

function getCurrentDemonRankIndex() {
    if (!isDemonActive()) return -1
    var lvl = getDemonLevel()
    for (var i = 0; i < demonRanks.length; i++) {
        var r = demonRanks[i]
        if (lvl >= r.minLvl && lvl <= r.maxLvl) {
            return i
        }
    }
    return demonRanks.length - 1
}

function getDemonRankMultiplier() {
    if (!isDemonActive()) return 1
    var rank = getCurrentDemonRank()
    return rank ? rank.bonus : 1
}

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x)
}

function getBindedTaskEffect(taskName) {
    var task = gameData.taskData[taskName]
    if (!task) return function() { return 1 }
    return task.getEffect.bind(task)
}

function getBindedItemEffect(itemName) {
    var item = gameData.itemData[itemName]
    if (!item) return function() { return 1 }
    return item.getEffect.bind(item)
}

function setGameSpeedMultiplier(mult) {
    gameSpeedMultiplier = mult
    var speedBtns = document.getElementsByClassName("speed-btn")
    for (var btn of speedBtns) {
        if (parseInt(btn.getAttribute("data-speed")) === mult) {
            btn.classList.add("active")
        } else {
            btn.classList.remove("active")
        }
    }
}

function getPrestigeMultiplier() {
    return 1 + (gameData.prestigePoints || 0) * 0.10
}

function getTradePrinceEffect() {
    var tp = gameData.taskData["Trade Prince"]
    return (tp && tp.level > 0) ? 2 : 1
}

function getShadowBrokerEffect() {
    var sb = gameData.taskData["Shadow Broker"]
    return (sb && sb.level > 0) ? 1.10 : 1
}

function buyMerchantsBlessing() {
    if (gameData.merchantsBlessing) return
    if ((gameData.prestigePoints || 0) < 5) return
    gameData.prestigePoints -= 5
    gameData.merchantsBlessing = true
    if (gameData.coins < 1000000) {
        gameData.coins = 1000000
    }
    updateUI()
}

function getPrestigePointsGain() {
    var age = daysToYears(gameData.days)
    if (age < 70) return 0
    var points = 1 + Math.floor((age - 70) / 5)
    return Math.max(1, points)
}

function prestige() {
    var gain = getPrestigePointsGain()
    if (gain <= 0) return
    gameData.prestigePoints = (gameData.prestigePoints || 0) + gain
    rebirthReset()
    updateUI()
}

function toggleAutoTask(taskName) {
    var task = gameData.taskData[taskName]
    if (!task) return
    if (task instanceof Job) {
        gameData.autoJob = (gameData.autoJob === taskName) ? null : taskName
        if (gameData.autoJob) {
            gameData.currentJob = task
        }
    } else if (task instanceof Skill) {
        gameData.autoSkill = (gameData.autoSkill === taskName) ? null : taskName
        if (gameData.autoSkill) {
            gameData.currentSkill = task
        }
    }
    updateTaskRows()
}

function checkAutoAssign() {
    if (gameData.autoJob && gameData.taskData[gameData.autoJob]) {
        var autoJobReq = gameData.requirements[gameData.autoJob]
        if (!autoJobReq || autoJobReq.isCompleted()) {
            if (gameData.currentJob.name !== gameData.autoJob) {
                gameData.currentJob = gameData.taskData[gameData.autoJob]
            }
        }
    }
    if (gameData.autoSkill && gameData.taskData[gameData.autoSkill]) {
        var autoSkillReq = gameData.requirements[gameData.autoSkill]
        if (!autoSkillReq || autoSkillReq.isCompleted()) {
            if (gameData.currentSkill.name !== gameData.autoSkill) {
                gameData.currentSkill = gameData.taskData[gameData.autoSkill]
            }
        }
    }
}

function addMultipliers() {
    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]

        task.xpMultipliers = []
        if (task instanceof Job) task.incomeMultipliers = []

        task.xpMultipliers.push(task.getMaxLevelMultiplier.bind(task))
        task.xpMultipliers.push(getHappiness)
        task.xpMultipliers.push(getBindedTaskEffect("Dark influence"))
        task.xpMultipliers.push(getBindedTaskEffect("Demon training"))
        task.xpMultipliers.push(getPrestigeMultiplier)
        task.xpMultipliers.push(getDemonRankMultiplier)

        if (task instanceof Job) {
            task.incomeMultipliers.push(task.getLevelMultiplier.bind(task))
            task.incomeMultipliers.push(getBindedTaskEffect("Demon's wealth"))
            task.incomeMultipliers.push(getPrestigeMultiplier)
            task.incomeMultipliers.push(getTradePrinceEffect)
            task.xpMultipliers.push(getBindedTaskEffect("Productivity"))
            task.xpMultipliers.push(getBindedItemEffect("Personal squire"))    
        } else if (task instanceof Skill) {
            task.xpMultipliers.push(getBindedTaskEffect("Concentration"))
            task.xpMultipliers.push(getBindedItemEffect("Book"))
            task.xpMultipliers.push(getBindedItemEffect("Study desk"))
            task.xpMultipliers.push(getBindedItemEffect("Library"))
            task.xpMultipliers.push(getShadowBrokerEffect)
        }

        if (jobCategories["Military"].includes(task.name)) {
            task.incomeMultipliers.push(getBindedTaskEffect("Strength"))
            task.xpMultipliers.push(getBindedTaskEffect("Battle tactics"))
            task.xpMultipliers.push(getBindedItemEffect("Steel longsword"))
        } else if (jobCategories["Mage"] && jobCategories["Mage"].includes(task.name)) {
            // Mage class scaling heavily off Magic skills
            task.incomeMultipliers.push(getBindedTaskEffect("Mana control"))
            task.incomeMultipliers.push(getBindedTaskEffect("Spellcraft"))
            task.xpMultipliers.push(getBindedTaskEffect("Mana control"))
            task.xpMultipliers.push(getBindedTaskEffect("Spellcraft"))
            // Additional heavy magic resonance
            task.xpMultipliers.push(function() {
                var mc = gameData.taskData["Mana control"]
                return 1 + (mc ? mc.level * 0.05 : 0)
            })
            task.incomeMultipliers.push(function() {
                var mc = gameData.taskData["Mana control"]
                return 1 + (mc ? mc.level * 0.08 : 0)
            })
        } else if (task.name == "Strength") {
            task.xpMultipliers.push(getBindedTaskEffect("Muscle memory"))
            task.xpMultipliers.push(getBindedItemEffect("Dumbbells"))
        } else if (skillCategories["Magic"].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect("Sapphire charm"))
            if (task.name == "Spellcraft") {
                task.xpMultipliers.push(getBindedTaskEffect("Mana control"))
            }
        } else if (jobCategories["The Arcane Association"].includes(task.name)) {
            task.xpMultipliers.push(getBindedTaskEffect("Mana control"))
        } else if (skillCategories["Dark magic"].includes(task.name)) {
            task.xpMultipliers.push(getEvil)
        }
    }

    for (itemName in gameData.itemData) {
        var item = gameData.itemData[itemName]
        item.expenseMultipliers = []
        item.expenseMultipliers.push(getBindedTaskEffect("Bargaining"))
        item.expenseMultipliers.push(getBindedTaskEffect("Intimidation"))
    }
}

function setCustomEffects() {
    var bargaining = gameData.taskData["Bargaining"]
    if (bargaining) {
        bargaining.getEffect = function() {
            var multiplier = 1 - getBaseLog(7, bargaining.level + 1) / 10
            if (multiplier < 0.1) {multiplier = 0.1}
            return multiplier
        }
    }

    var intimidation = gameData.taskData["Intimidation"]
    if (intimidation) {
        intimidation.getEffect = function() {
            var multiplier = 1 - getBaseLog(7, intimidation.level + 1) / 10
            if (multiplier < 0.1) {multiplier = 0.1}
            return multiplier
        }
    }

    var timeWarping = gameData.taskData["Time warping"]
    if (timeWarping) {
        timeWarping.getEffect = function() {
            var multiplier = 1 + getBaseLog(13, timeWarping.level + 1) 
            return multiplier
        }
    }

    var immortality = gameData.taskData["Immortality"]
    if (immortality) {
        immortality.getEffect = function() {
            var multiplier = 1 + getBaseLog(33, immortality.level + 1) 
            return multiplier
        }
    }
}

function getHappiness() {
    var meditationEffect = getBindedTaskEffect("Meditation")
    var butlerEffect = getBindedItemEffect("Butler")
    var propEffect = gameData.currentProperty ? gameData.currentProperty.getEffect() : 1
    var happiness = meditationEffect() * butlerEffect() * propEffect
    return happiness
}

function getEvil() {
    return gameData.evil
}

function applyMultipliers(value, multipliers) {
    var finalMultiplier = 1
    multipliers.forEach(function(multiplierFunction) {
        var multiplier = multiplierFunction()
        finalMultiplier *= multiplier
    })
    var finalValue = Math.round(value * finalMultiplier)
    return finalValue
}

function applySpeed(value) {
    var finalValue = value * getGameSpeed() / updateSpeed
    return finalValue
}

function getEvilGain() {
    var evilControl = gameData.taskData["Evil control"]
    var bloodMeditation = gameData.taskData["Blood meditation"]
    var evil = (evilControl ? evilControl.getEffect() : 1) * (bloodMeditation ? bloodMeditation.getEffect() : 1) * getDemonRankMultiplier()
    return evil
}

function getGameSpeed() {
    var timeWarping = gameData.taskData["Time warping"]
    var timeWarpingSpeed = (timeWarping && gameData.timeWarpingEnabled) ? timeWarping.getEffect() : 1
    var gameSpeed = baseGameSpeed * +!gameData.paused * +isAlive() * timeWarpingSpeed * gameSpeedMultiplier
    return gameSpeed
}

function applyExpenses() {
    var coins = applySpeed(getExpense())
    gameData.coins -= coins
    if (gameData.coins < 0) {    
        goBankrupt()
    }
}

function getExpense() {
    var midas = gameData.taskData["Midas"]
    if (midas && midas.level > 0) return 0
    var expense = 0
    if (gameData.currentProperty) {
        expense += gameData.currentProperty.getExpense()
    }
    if (gameData.currentMisc) {
        for (misc of gameData.currentMisc) {
            expense += misc.getExpense()
        }
    }
    return expense
}

function goBankrupt() {
    gameData.coins = 0
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []
}

function setTab(element, selectedTab) {
    var tabs = Array.prototype.slice.call(document.getElementsByClassName("tab"))
    tabs.forEach(function(tab) {
        tab.style.display = "none"
    })
    var targetTab = document.getElementById(selectedTab)
    if (targetTab) targetTab.style.display = "block"

    var tabButtons = document.getElementsByClassName("tabButton")
    for (tabButton of tabButtons) {
        tabButton.classList.remove("w3-blue-gray")
    }
    if (element) element.classList.add("w3-blue-gray")
}

function setPause() {
    gameData.paused = !gameData.paused
}

function setTimeWarping() {
    gameData.timeWarpingEnabled = !gameData.timeWarpingEnabled
}

function setTask(taskName) {
    var task = gameData.taskData[taskName]
    if (!task) return
    task instanceof Job ? gameData.currentJob = task : gameData.currentSkill = task
}

function setProperty(propertyName) {
    var property = gameData.itemData[propertyName]
    if (property) gameData.currentProperty = property
}

function setMisc(miscName) {
    var misc = gameData.itemData[miscName]
    if (!misc) return
    if (gameData.currentMisc.includes(misc)) {
        for (var i = 0; i < gameData.currentMisc.length; i++) {
            if (gameData.currentMisc[i] == misc) {
                gameData.currentMisc.splice(i, 1)
            }
        }
    } else {
        gameData.currentMisc.push(misc)
    }
}

function createData(data, baseData) {
    for (key in baseData) {
        var entity = baseData[key]
        createEntity(data, entity)
    }
}

function createEntity(data, entity) {
    if ("income" in entity) {data[entity.name] = new Job(entity)}
    else if ("maxXp" in entity) {data[entity.name] = new Skill(entity)}
    else {data[entity.name] = new Item(entity)}
    data[entity.name].id = "row " + entity.name
}

function createRequiredRow(categoryName) {
    var requiredRow = document.getElementsByClassName("requiredRowTemplate")[0].content.firstElementChild.cloneNode(true)
    requiredRow.classList.add("requiredRow")
    requiredRow.classList.add(removeSpaces(categoryName))
    requiredRow.id = categoryName
    return requiredRow
}

function createHeaderRow(templates, categoryType, categoryName) {
    var headerRow = templates.headerRow.content.firstElementChild.cloneNode(true)
    headerRow.getElementsByClassName("category")[0].textContent = categoryName
    if (categoryType != itemCategories) {
        headerRow.getElementsByClassName("valueType")[0].textContent = categoryType == jobCategories ? "Income/day" : "Effect"
    }

    var accent = categoryAccentColors[categoryName] || "#3b82f6"
    headerRow.style.background = "linear-gradient(90deg, " + accent + "33 0%, rgba(24, 29, 42, 0.95) 100%)"
    headerRow.style.borderLeft = "4px solid " + accent
    headerRow.style.color = "#f8fafc"
    headerRow.classList.add(removeSpaces(categoryName))
    headerRow.classList.add("headerRow")
    
    return headerRow
}

function createRow(templates, name, categoryName, categoryType) {
    var row = templates.row.content.firstElementChild.cloneNode(true)
    row.getElementsByClassName("name")[0].textContent = name
    row.getElementsByClassName("tooltipText")[0].textContent = tooltips[name] || ""
    row.id = "row " + name
    if (categoryType != itemCategories) {
        row.getElementsByClassName("progressBar")[0].onclick = function() {setTask(name)}
        var autoBtn = row.getElementsByClassName("autoButton")[0]
        if (autoBtn) {
            autoBtn.onclick = function(e) {
                e.stopPropagation()
                toggleAutoTask(name)
            }
        }
    } else {
        row.getElementsByClassName("button")[0].onclick = categoryName == "Properties" ? function() {setProperty(name)} : function() {setMisc(name)}
    }

    return row
}

function createAllRows(categoryType, tableId) {
    var templates = {
        headerRow: document.getElementsByClassName(categoryType == itemCategories ? "headerRowItemTemplate" : "headerRowTaskTemplate")[0],
        row: document.getElementsByClassName(categoryType == itemCategories ? "rowItemTemplate" : "rowTaskTemplate")[0],
    }

    var table = document.getElementById(tableId)

    for (categoryName in categoryType) {
        var headerRow = createHeaderRow(templates, categoryType, categoryName)
        table.appendChild(headerRow)
        
        var category = categoryType[categoryName]
        category.forEach(function(name) {
            var row = createRow(templates, name, categoryName, categoryType)
            table.appendChild(row)       
        })

        var requiredRow = createRequiredRow(categoryName)
        table.append(requiredRow)
    }
}

function updateQuickTaskDisplay(taskType) {
    var currentTask = taskType == "job" ? gameData.currentJob : gameData.currentSkill
    if (!currentTask) return
    var quickTaskDisplayElement = document.getElementById("quickTaskDisplay")
    var progressBar = quickTaskDisplayElement.getElementsByClassName(taskType)[0]
    progressBar.getElementsByClassName("name")[0].textContent = currentTask.name + " lvl " + currentTask.level
    progressBar.getElementsByClassName("progressFill")[0].style.width = currentTask.xp / currentTask.getMaxXp() * 100 + "%"
}

function updateRequiredRows(data, categoryType) {
    var requiredRows = document.getElementsByClassName("requiredRow")
    for (requiredRow of requiredRows) {
        var nextEntity = null
        var category = categoryType[requiredRow.id] 
        if (category == null) {continue}
        for (var i = 0; i < category.length; i++) {
            var entityName = category[i]
            if (i >= category.length - 1) break
            var requirements = gameData.requirements[entityName]
            if (requirements && i == 0) {
                if (!requirements.isCompleted()) {
                    nextEntity = data[entityName]
                    break
                }
            }

            var nextIndex = i + 1
            if (nextIndex >= category.length) {break}
            var nextEntityName = category[nextIndex]
            var nextEntityRequirements = gameData.requirements[nextEntityName]

            if (nextEntityRequirements && !nextEntityRequirements.isCompleted()) {
                nextEntity = data[nextEntityName]
                break
            }       
        }

        if (nextEntity == null) {
            requiredRow.classList.add("hiddenTask")           
        } else {
            requiredRow.classList.remove("hiddenTask")
            var requirementObject = gameData.requirements[nextEntity.name]
            if (!requirementObject) continue
            var requirements = requirementObject.requirements

            var coinElement = requiredRow.getElementsByClassName("coins")[0]
            var levelElement = requiredRow.getElementsByClassName("levels")[0]
            var evilElement = requiredRow.getElementsByClassName("evil")[0]

            coinElement.classList.add("hiddenTask")
            levelElement.classList.add("hiddenTask")
            evilElement.classList.add("hiddenTask")

            var finalText = ""
            if (data == gameData.taskData) {
                if (requirementObject instanceof EvilRequirement) {
                    evilElement.classList.remove("hiddenTask")
                    evilElement.textContent = format(requirements[0].requirement) + " evil"
                } else {
                    levelElement.classList.remove("hiddenTask")
                    for (requirement of requirements) {
                        if (requirement.task) {
                            var task = gameData.taskData[requirement.task]
                            if (!task || task.level >= requirement.requirement) continue
                            var text = " " + requirement.task + " level " + format(task.level) + "/" + format(requirement.requirement) + ","
                            finalText += text
                        } else if (requirement.coins !== undefined) {
                            if (gameData.coins >= requirement.coins) continue
                            var text = " " + format(requirement.coins) + " coins,"
                            finalText += text
                        }
                    }
                    finalText = finalText.substring(0, finalText.length - 1)
                    levelElement.textContent = finalText
                }
            } else if (data == gameData.itemData) {
                coinElement.classList.remove("hiddenTask")
                formatCoins(requirements[0].requirement, coinElement)
            }
        }   
    }
}

function updateTaskRows() {
    for (key in gameData.taskData) {
        var task = gameData.taskData[key]
        var row = document.getElementById("row " + task.name)
        if (!row) continue
        row.getElementsByClassName("level")[0].textContent = task.level
        row.getElementsByClassName("xpGain")[0].textContent = format(task.getXpGain())
        row.getElementsByClassName("xpLeft")[0].textContent = format(task.getXpLeft())

        var maxLevel = row.getElementsByClassName("maxLevel")[0]
        maxLevel.textContent = task.maxLevel
        gameData.rebirthOneCount > 0 ? maxLevel.classList.remove("hidden") : maxLevel.classList.add("hidden")

        var progressFill = row.getElementsByClassName("progressFill")[0]
        progressFill.style.width = task.xp / task.getMaxXp() * 100 + "%"
        var isCurrent = (task == gameData.currentJob || task == gameData.currentSkill)
        if (isCurrent) {
            progressFill.classList.add("current")
            row.classList.add("active-task-row")
        } else {
            progressFill.classList.remove("current")
            row.classList.remove("active-task-row")
        }

        var valueElement = row.getElementsByClassName("value")[0]
        valueElement.getElementsByClassName("income")[0].style.display = task instanceof Job ? "block" : "none"
        valueElement.getElementsByClassName("effect")[0].style.display = task instanceof Skill ? "block" : "none"

        var skipSkillElement = row.getElementsByClassName("skipSkill")[0]
        if (skipSkillElement) {
            skipSkillElement.style.display = (task instanceof Skill && autoLearnElement && autoLearnElement.checked) ? "block" : "none"
        }

        // Auto Assign Button update
        var autoBtn = row.getElementsByClassName("autoButton")[0]
        if (autoBtn) {
            var isAuto = (task instanceof Job && gameData.autoJob === task.name) || (task instanceof Skill && gameData.autoSkill === task.name)
            if (isAuto) {
                autoBtn.textContent = "Auto: ON"
                autoBtn.classList.add("auto-active")
            } else {
                autoBtn.textContent = "Auto: OFF"
                autoBtn.classList.remove("auto-active")
            }
        }

        if (task instanceof Job) {
            formatCoins(task.getIncome(), valueElement.getElementsByClassName("income")[0])
        } else {
            valueElement.getElementsByClassName("effect")[0].textContent = task.getEffectDescription()
        }
    }
}

function updateItemRows() {
    for (key in gameData.itemData) {
        var item = gameData.itemData[key]
        var row = document.getElementById("row " + item.name)
        if (!row) continue
        var button = row.getElementsByClassName("button")[0]
        button.disabled = gameData.coins < item.getExpense()
        var active = row.getElementsByClassName("active")[0]
        var color = itemCategories["Properties"].includes(item.name) ? categoryAccentColors["Properties"] : categoryAccentColors["Misc"]
        var isBought = (gameData.currentMisc.includes(item) || item == gameData.currentProperty)
        active.style.backgroundColor = isBought ? color : "transparent"
        active.style.boxShadow = isBought ? "0 0 8px " + color : "none"
        row.getElementsByClassName("effect")[0].textContent = item.getEffectDescription()
        formatCoins(item.getExpense(), row.getElementsByClassName("expense")[0])
    }
}

function updateHeaderRows(categories) {
    for (categoryName in categories) {
        var className = removeSpaces(categoryName)
        var headerRow = document.getElementsByClassName(className)[0]
        if (!headerRow) continue
        var maxLevelElement = headerRow.getElementsByClassName("maxLevel")[0]
        if (maxLevelElement) {
            gameData.rebirthOneCount > 0 ? maxLevelElement.classList.remove("hidden") : maxLevelElement.classList.add("hidden")
        }
        var skipSkillElement = headerRow.getElementsByClassName("skipSkill")[0]
        if (skipSkillElement) {
            skipSkillElement.style.display = (categories == skillCategories && autoLearnElement && autoLearnElement.checked) ? "block" : "none"
        }
    }
}

function updateText() {
    // Sidebar text
    document.getElementById("ageDisplay").textContent = daysToYears(gameData.days)
    document.getElementById("dayDisplay").textContent = getDay()
    document.getElementById("lifespanDisplay").textContent = daysToYears(getLifespan())
    document.getElementById("pauseButton").textContent = gameData.paused ? "Play" : "Pause"

    formatCoins(gameData.coins, document.getElementById("coinDisplay"))
    setSignDisplay()
    formatCoins(getNet(), document.getElementById("netDisplay"))
    formatCoins(getIncome(), document.getElementById("incomeDisplay"))
    formatCoins(getExpense(), document.getElementById("expenseDisplay"))

    document.getElementById("happinessDisplay").textContent = getHappiness().toFixed(1)

    document.getElementById("evilDisplay").textContent = gameData.evil.toFixed(1)
    document.getElementById("evilGainDisplay").textContent = getEvilGain().toFixed(1)

    var timeWarpTask = gameData.taskData["Time warping"]
    if (timeWarpTask) {
        document.getElementById("timeWarpingDisplay").textContent = "x" + timeWarpTask.getEffect().toFixed(2)
    }
    document.getElementById("timeWarpingButton").textContent = gameData.timeWarpingEnabled ? "Disable warp" : "Enable warp"

    // Prestige UI Display
    var prestigePointsElem = document.getElementById("prestigePointsDisplay")
    if (prestigePointsElem) {
        prestigePointsElem.textContent = format(gameData.prestigePoints || 0)
    }
    var prestigeMultElem = document.getElementById("prestigeMultiplierDisplay")
    if (prestigeMultElem) {
        var bonusPercent = Math.round((getPrestigeMultiplier() - 1) * 100)
        prestigeMultElem.textContent = "+" + bonusPercent + "% (x" + getPrestigeMultiplier().toFixed(2) + ")"
    }
    var prestigeBtn = document.getElementById("prestigeButton")
    var prestigeGainElem = document.getElementById("prestigeGainDisplay")
    if (prestigeBtn) {
        var gain = getPrestigePointsGain()
        var age = daysToYears(gameData.days)
        if (age >= 70 || !isAlive()) {
            prestigeBtn.style.display = "block"
            if (prestigeGainElem) prestigeGainElem.textContent = format(gain)
        } else {
            prestigeBtn.style.display = "none"
        }
    }

    var blessingBtn = document.getElementById("merchantsBlessingBtn")
    if (blessingBtn) {
        if (gameData.merchantsBlessing) {
            blessingBtn.textContent = "✓ Active"
            blessingBtn.disabled = true
            blessingBtn.style.background = "#059669"
            blessingBtn.style.borderColor = "#10b981"
            blessingBtn.style.color = "#ffffff"
        } else {
            blessingBtn.textContent = "Buy (5 Pts)"
            blessingBtn.disabled = (gameData.prestigePoints || 0) < 5
            blessingBtn.style.background = ""
            blessingBtn.style.borderColor = ""
            blessingBtn.style.color = ""
        }
    }

    // Demon Hierarchy Section Display
    var demonCard = document.getElementById("demonHierarchySection")
    if (demonCard) {
        if (isDemonActive()) {
            demonCard.style.display = "block"
            var currentRank = getCurrentDemonRank()
            var rankIndex = getCurrentDemonRankIndex()
            var currentLvl = getDemonLevel()

            var badgeElem = document.getElementById("demonTierBadge")
            if (badgeElem) {
                badgeElem.textContent = currentRank.tierBadge || "Tier 1"
                if (currentRank.tierColor) {
                    badgeElem.style.borderColor = currentRank.tierColor
                    badgeElem.style.color = "#ffffff"
                    badgeElem.style.backgroundColor = currentRank.tierColor + "33"
                }
            }

            var titleElem = document.getElementById("demonRankTitle")
            if (titleElem) titleElem.textContent = currentRank.name

            var lvlElem = document.getElementById("demonLevelDisplay")
            if (lvlElem) lvlElem.textContent = "Lvl " + currentLvl

            var descElem = document.getElementById("demonRankDesc")
            if (descElem) descElem.textContent = currentRank.desc

            var bonusElem = document.getElementById("demonRankBonus")
            if (bonusElem) {
                var bonusPct = Math.round((currentRank.bonus - 1) * 100)
                bonusElem.textContent = "+" + bonusPct + "% All XP & Evil (x" + currentRank.bonus.toFixed(2) + ")"
            }

            // Next Rank Progress
            var nextRank = (rankIndex >= 0 && rankIndex < demonRanks.length - 1) ? demonRanks[rankIndex + 1] : null
            var nextLabel = document.getElementById("demonNextRankLabel")
            var nextReq = document.getElementById("demonNextRankReq")
            var pBar = document.getElementById("demonProgressBar")

            if (nextRank) {
                if (nextLabel) nextLabel.textContent = "Next: " + nextRank.name.split(" (")[0]
                var neededLvl = nextRank.minLvl
                var prevLvl = currentRank.minLvl
                var progressInSpan = currentLvl - prevLvl
                var totalSpan = neededLvl - prevLvl
                var pct = Math.min(100, Math.max(5, Math.round((progressInSpan / totalSpan) * 100)))

                if (nextReq) nextReq.textContent = "Lvl " + currentLvl + " / " + neededLvl
                if (pBar) pBar.style.width = pct + "%"
            } else {
                if (nextLabel) nextLabel.textContent = "MAX RANK REACHED"
                if (nextReq) nextReq.textContent = "Lvl " + currentLvl
                if (pBar) pBar.style.width = "100%"
            }
        } else {
            demonCard.style.display = "none"
        }
    }
}

function setSignDisplay() {
    var signDisplay = document.getElementById("signDisplay")
    if (getIncome() > getExpense()) {
        signDisplay.textContent = "+"
        signDisplay.style.color = "green"
    } else if (getExpense() > getIncome()) {
        signDisplay.textContent = "-"
        signDisplay.style.color = "red"
    } else {
        signDisplay.textContent = ""
        signDisplay.style.color = "gray"
    }
}

function getNet() {
    var net = Math.abs(getIncome() - getExpense())
    return net
}

function hideEntities() {
    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        var completed = requirement.isCompleted()
        for (element of requirement.elements) {
            if (completed) {
                element.classList.remove("hidden")
            } else {
                element.classList.add("hidden")
            }
        }
    }
}

function doCurrentTask(task) {
    if (!task) return
    task.increaseXp()
    if (task instanceof Job) {
        increaseCoins()
    }
}

function getIncome() {
    var income = 0
    if (gameData.currentJob) {
        income += gameData.currentJob.getIncome()
    }
    return income
}

function increaseCoins() {
    var coins = applySpeed(getIncome())
    gameData.coins += coins
}

function daysToYears(days) {
    var years = Math.floor(days / 365)
    return years
}

function getCategoryFromEntityName(categoryType, entityName) {
    for (categoryName in categoryType) {
        var category = categoryType[categoryName]
        if (category.includes(entityName)) {
            return category
        }
    }
}

function getNextEntity(data, categoryType, entityName) {
    var category = getCategoryFromEntityName(categoryType, entityName)
    if (!category) return null
    var nextIndex = category.indexOf(entityName) + 1
    if (nextIndex > category.length - 1) return null
    var nextEntityName = category[nextIndex]
    var nextEntity = data[nextEntityName]
    return nextEntity
}

function autoPromote() {
    if (!autoPromoteElement || !autoPromoteElement.checked || !gameData.currentJob) return
    var nextEntity = getNextEntity(gameData.taskData, jobCategories, gameData.currentJob.name)
    if (nextEntity == null) return
    var requirement = gameData.requirements[nextEntity.name]
    if (requirement && requirement.isCompleted()) gameData.currentJob = nextEntity
}

function checkSkillSkipped(skill) {
    var row = document.getElementById("row " + skill.name)
    if (!row) return false
    var isSkillSkipped = row.getElementsByClassName("checkbox")[0].checked
    return isSkillSkipped
}

function setSkillWithLowestMaxXp() {
    var xpDict = {}

    for (skillName in gameData.taskData) {
        var skill = gameData.taskData[skillName]
        var requirement = gameData.requirements[skillName]
        if (skill instanceof Skill && requirement && requirement.isCompleted() && !checkSkillSkipped(skill)) {
            xpDict[skill.name] = skill.level
        }
    }

    if (Object.keys(xpDict).length === 0) {
        skillWithLowestMaxXp = gameData.taskData["Concentration"]
        return
    }

    var lowestSkillName = getKeyOfLowestValueFromDict(xpDict)
    skillWithLowestMaxXp = gameData.taskData[lowestSkillName]
}

function getKeyOfLowestValueFromDict(dict) {
    var values = []
    for (key in dict) {
        var value = dict[key]
        values.push(value)
    }

    values.sort(function(a, b){return a - b})

    for (key in dict) {
        var value = dict[key]
        if (value == values[0]) {
            return key
        }
    }
}

function autoLearn() {
    if (!autoLearnElement || !autoLearnElement.checked || !skillWithLowestMaxXp) return
    gameData.currentSkill = skillWithLowestMaxXp
}

function yearsToDays(years) {
    var days = years * 365
    return days
}
 
function getDay() {
    var day = Math.floor(gameData.days - daysToYears(gameData.days) * 365)
    return day
}

function increaseDays() {
    var increase = applySpeed(1)
    gameData.days += increase
}

function format(number) {
    if (number === 0) return 0
    var tier = Math.log10(number) / 3 | 0
    if (tier == 0) return number

    var suffix = units[tier] || ""
    var scale = Math.pow(10, tier * 3)
    var scaled = number / scale

    return scaled.toFixed(1) + suffix
}

function formatCoins(coins, element) {
    if (!element) return
    var tiers = ["p", "g", "s"]
    var colors = {
        "p": "#79b9c7",
        "g": "#E5C100",
        "s": "#a8a8a8",
        "c": "#a15c2f"
    }
    var leftOver = coins
    var i = 0
    for (tier of tiers) {
        var x = Math.floor(leftOver / Math.pow(10, (tiers.length - i) * 2))
        var leftOver = Math.floor(leftOver - x * Math.pow(10, (tiers.length - i) * 2))
        var text = format(String(x)) + tier + " "
        element.children[i].textContent = x > 0 ? text : ""
        element.children[i].style.color = colors[tier]
        i += 1
    }
    if (leftOver == 0 && coins > 0) {element.children[3].textContent = ""; return}
    var text = String(Math.floor(leftOver)) + "c"
    element.children[3].textContent = text
    element.children[3].style.color = colors["c"]
}

function getTaskElement(taskName) {
    var task = gameData.taskData[taskName]
    if (!task) return null
    var element = document.getElementById(task.id)
    return element
}

function getItemElement(itemName) {
    var item = gameData.itemData[itemName]
    if (!item) return null
    var element = document.getElementById(item.id)
    return element
}

function getElementsByClass(className) {
    var elements = document.getElementsByClassName(removeSpaces(className))
    return elements
}

function setLightDarkMode() {
    var body = document.getElementById("body")
    body.classList.contains("dark") ? body.classList.remove("dark") : body.classList.add("dark")
}

function removeSpaces(string) {
    var string = string.replace(/[ /]/g, "")
    return string
}

function rebirthOne() {
    gameData.rebirthOneCount += 1
    rebirthReset()
}

function rebirthTwo() {
    gameData.rebirthTwoCount += 1
    gameData.evil += getEvilGain()

    rebirthReset()
}

function rebirthReset() {
    setTab(jobTabButton, "jobs")

    gameData.coins = gameData.merchantsBlessing ? 1000000 : 0
    gameData.days = 365 * 14
    gameData.currentJob = gameData.taskData["Beggar"]
    gameData.currentSkill = gameData.taskData["Concentration"]
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []
    gameData.autoJob = null
    gameData.autoSkill = null

    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]
        if (task.level > task.maxLevel) task.maxLevel = task.level
        task.level = 0
        task.xp = 0
    }

    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        if (requirement.completed && permanentUnlocks.includes(key)) continue
        requirement.completed = false
    }
}

function getLifespan() {
    var immortality = gameData.taskData["Immortality"]
    var superImmortality = gameData.taskData["Super immortality"]
    var lifespan = baseLifespan * (immortality ? immortality.getEffect() : 1) * (superImmortality ? superImmortality.getEffect() : 1)
    return lifespan
}

function isAlive() {
    var condition = gameData.days < getLifespan()
    var deathText = document.getElementById("deathText")
    if (!condition) {
        gameData.days = getLifespan()
        deathText.classList.remove("hidden")
    }
    else {
        deathText.classList.add("hidden")
    }
    return condition
}

function assignMethods() {
    for (key in gameData.taskData) {
        var task = gameData.taskData[key]
        if (jobBaseData[task.name]) {
            task.baseData = jobBaseData[task.name]
            task = Object.assign(new Job(jobBaseData[task.name]), task)
        } else if (skillBaseData[task.name]) {
            task.baseData = skillBaseData[task.name]
            task = Object.assign(new Skill(skillBaseData[task.name]), task)
        } 
        gameData.taskData[key] = task
    }

    for (key in gameData.itemData) {
        var item = gameData.itemData[key]
        if (itemBaseData[item.name]) {
            item.baseData = itemBaseData[item.name]
            item = Object.assign(new Item(itemBaseData[item.name]), item)
            gameData.itemData[key] = item
        }
    }

    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        if (!requirement) continue
        if (requirement.type == "task") {
            requirement = Object.assign(new TaskRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "coins") {
            requirement = Object.assign(new CoinRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "age") {
            requirement = Object.assign(new AgeRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "evil") {
            requirement = Object.assign(new EvilRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "compound") {
            requirement = Object.assign(new CompoundRequirement(requirement.elements, requirement.requirements), requirement)
        }

        var tempRequirement = tempData["requirements"][key]
        if (tempRequirement) {
            requirement.elements = tempRequirement.elements
            requirement.requirements = tempRequirement.requirements
        }
        gameData.requirements[key] = requirement
    }

    if (gameData.currentJob && gameData.taskData[gameData.currentJob.name]) {
        gameData.currentJob = gameData.taskData[gameData.currentJob.name]
    } else {
        gameData.currentJob = gameData.taskData["Beggar"]
    }

    if (gameData.currentSkill && gameData.taskData[gameData.currentSkill.name]) {
        gameData.currentSkill = gameData.taskData[gameData.currentSkill.name]
    } else {
        gameData.currentSkill = gameData.taskData["Concentration"]
    }

    if (gameData.currentProperty && gameData.itemData[gameData.currentProperty.name]) {
        gameData.currentProperty = gameData.itemData[gameData.currentProperty.name]
    } else {
        gameData.currentProperty = gameData.itemData["Homeless"]
    }

    var newArray = []
    if (gameData.currentMisc) {
        for (misc of gameData.currentMisc) {
            if (misc && gameData.itemData[misc.name]) {
                newArray.push(gameData.itemData[misc.name])
            }
        }
    }
    gameData.currentMisc = newArray
}

function replaceSaveDict(dict, saveDict) {
    for (key in dict) {
        if (!(key in saveDict)) {
            saveDict[key] = dict[key]
        } else if (dict == gameData.requirements) {
            if (saveDict[key].type != tempData["requirements"][key].type) {
                saveDict[key] = tempData["requirements"][key]
            }
        }
    }

    for (key in saveDict) {
        if (!(key in dict)) {
            delete saveDict[key]
        }
    }
}

function saveGameData() {
    localStorage.setItem("gameDataSave", JSON.stringify(gameData))
}

function loadGameData() {
    var gameDataSave = JSON.parse(localStorage.getItem("gameDataSave"))

    if (gameDataSave !== null) {
        replaceSaveDict(gameData, gameDataSave)
        replaceSaveDict(gameData.requirements, gameDataSave.requirements)
        replaceSaveDict(gameData.taskData, gameDataSave.taskData)
        replaceSaveDict(gameData.itemData, gameDataSave.itemData)

        gameData = gameDataSave
    }

    if (gameData.prestigePoints === undefined) gameData.prestigePoints = 0
    if (gameData.merchantsBlessing === undefined) gameData.merchantsBlessing = false
    if (gameData.autoJob === undefined) gameData.autoJob = null
    if (gameData.autoSkill === undefined) gameData.autoSkill = null

    assignMethods()
}

function updateUI() {
    updateTaskRows()
    updateItemRows()
    updateRequiredRows(gameData.taskData, jobCategories)
    updateRequiredRows(gameData.taskData, skillCategories)
    updateRequiredRows(gameData.itemData, itemCategories)
    updateHeaderRows(jobCategories)
    updateHeaderRows(skillCategories)
    updateQuickTaskDisplay("job")
    updateQuickTaskDisplay("skill")
    hideEntities()
    updateText()  
}

function update() {
    increaseDays()
    autoPromote()
    autoLearn()
    checkAutoAssign()
    doCurrentTask(gameData.currentJob)
    doCurrentTask(gameData.currentSkill)
    applyExpenses()
    updateUI()
}

function resetGameData() {
    localStorage.clear()
    location.reload()
}

function importGameData() {
    var importExportBox = document.getElementById("importExportBox")
    var data = JSON.parse(window.atob(importExportBox.value))
    gameData = data
    saveGameData()
    location.reload()
}

function exportGameData() {
    var importExportBox = document.getElementById("importExportBox")
    importExportBox.value = window.btoa(JSON.stringify(gameData))
}

// Init Game Data and Rows

createAllRows(jobCategories, "jobTable")
createAllRows(skillCategories, "skillTable")
createAllRows(itemCategories, "itemTable") 

createData(gameData.taskData, jobBaseData)
createData(gameData.taskData, skillBaseData)
createData(gameData.itemData, itemBaseData) 

gameData.currentJob = gameData.taskData["Beggar"]
gameData.currentSkill = gameData.taskData["Concentration"]
gameData.currentProperty = gameData.itemData["Homeless"]
gameData.currentMisc = []

gameData.requirements = {
    // Categories and tabs
    "Mythical / Overlord": new TaskRequirement(getElementsByClass("Mythical / Overlord"), [{task: "Merchant", requirement: 50}]),
    "Mage class": new TaskRequirement(getElementsByClass("Mage"), [{task: "Concentration", requirement: 15}, {task: "Meditation", requirement: 15}]),
    "Magic skilltree": new TaskRequirement(getElementsByClass("Magic"), [{task: "Concentration", requirement: 15}, {task: "Meditation", requirement: 15}]),
    "The Arcane Association": new TaskRequirement(getElementsByClass("The Arcane Association"), [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
    "Dark magic": new EvilRequirement(getElementsByClass("Dark magic"), [{requirement: 1}]),
    "Shop": new CoinRequirement([document.getElementById("shopTabButton")], [{requirement: gameData.itemData["Tent"].getExpense() * 50}]),
    "Rebirth tab": new AgeRequirement([document.getElementById("rebirthTabButton")], [{requirement: 25}]),
    "Rebirth note 1": new AgeRequirement([document.getElementById("rebirthNote1")], [{requirement: 45}]),
    "Rebirth note 2": new AgeRequirement([document.getElementById("rebirthNote2")], [{requirement: 65}]),
    "Rebirth note 3": new AgeRequirement([document.getElementById("rebirthNote3")], [{requirement: 200}]),
    "Evil info": new EvilRequirement([document.getElementById("evilInfo")], [{requirement: 1}]),
    "Time warping info": new TaskRequirement([document.getElementById("timeWarping")], [{task: "Mage", requirement: 10}]),
    "Automation": new AgeRequirement([document.getElementById("automation")], [{requirement: 20}]),
    "Quick task display": new AgeRequirement([document.getElementById("quickTaskDisplay")], [{requirement: 20}]),

    // Common work
    "Beggar": new TaskRequirement([getTaskElement("Beggar")], []),
    "Farmer": new TaskRequirement([getTaskElement("Farmer")], [{task: "Beggar", requirement: 10}]),
    "Fisherman": new TaskRequirement([getTaskElement("Fisherman")], [{task: "Farmer", requirement: 10}]),
    "Miner": new TaskRequirement([getTaskElement("Miner")], [{task: "Strength", requirement: 10}, {task: "Fisherman", requirement: 10}]),
    "Blacksmith": new TaskRequirement([getTaskElement("Blacksmith")], [{task: "Strength", requirement: 30}, {task: "Miner", requirement: 10}]),
    "Merchant": new TaskRequirement([getTaskElement("Merchant")], [{task: "Bargaining", requirement: 50}, {task: "Blacksmith", requirement: 10}]),

    // Mythical / Overlord Jobs
    "Trade Prince": new CompoundRequirement([getTaskElement("Trade Prince")], [{task: "Merchant", requirement: 50}, {coins: 100000}]),
    "Shadow Broker": new CompoundRequirement([getTaskElement("Shadow Broker")], [{task: "Merchant", requirement: 100}, {coins: 500000}]),
    "Midas": new TaskRequirement([getTaskElement("Midas")], [{task: "Trade Prince", requirement: 50}]),

    // Military 
    "Squire": new TaskRequirement([getTaskElement("Squire")], [{task: "Strength", requirement: 5}]),
    "Footman": new TaskRequirement([getTaskElement("Footman")], [{task: "Strength", requirement: 20}, {task: "Squire", requirement: 10}]),
    "Veteran footman": new TaskRequirement([getTaskElement("Veteran footman")], [{task: "Battle tactics", requirement: 40}, {task: "Footman", requirement: 10}]),
    "Knight": new TaskRequirement([getTaskElement("Knight")], [{task: "Strength", requirement: 100}, {task: "Veteran footman", requirement: 10}]),
    "Veteran knight": new TaskRequirement([getTaskElement("Veteran knight")], [{task: "Battle tactics", requirement: 150}, {task: "Knight", requirement: 10}]),
    "Elite knight": new TaskRequirement([getTaskElement("Elite knight")], [{task: "Strength", requirement: 300}, {task: "Veteran knight", requirement: 10}]),
    "Holy knight": new TaskRequirement([getTaskElement("Holy knight")], [{task: "Mana control", requirement: 500}, {task: "Elite knight", requirement: 10}]),
    "Legendary knight": new TaskRequirement([getTaskElement("Legendary knight")], [{task: "Mana control", requirement: 1000}, {task: "Battle tactics", requirement: 1000}, {task: "Holy knight", requirement: 10}]),

    // Mage Class Jobs
    "Apprentice": new TaskRequirement([getTaskElement("Apprentice")], [{task: "Concentration", requirement: 15}, {task: "Meditation", requirement: 15}]),
    "Wizard": new TaskRequirement([getTaskElement("Wizard")], [{task: "Mana control", requirement: 15}, {task: "Apprentice", requirement: 10}]),
    "Archmage": new TaskRequirement([getTaskElement("Archmage")], [{task: "Spellcraft", requirement: 20}, {task: "Wizard", requirement: 15}]),

    // The Arcane Association Jobs
    "Student": new TaskRequirement([getTaskElement("Student")], [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
    "Apprentice mage": new TaskRequirement([getTaskElement("Apprentice mage")], [{task: "Mana control", requirement: 400}, {task: "Student", requirement: 10}]),
    "Mage": new TaskRequirement([getTaskElement("Mage")], [{task: "Mana control", requirement: 700}, {task: "Apprentice mage", requirement: 10}]),
    "Grand wizard": new TaskRequirement([getTaskElement("Grand wizard")], [{task: "Mana control", requirement: 1000}, {task: "Mage", requirement: 10}]),
    "Master wizard": new TaskRequirement([getTaskElement("Master wizard")], [{task: "Mana control", requirement: 1500}, {task: "Grand wizard", requirement: 10}]),
    "Chairman": new TaskRequirement([getTaskElement("Chairman")], [{task: "Mana control", requirement: 2000}, {task: "Master wizard", requirement: 10}]),

    // Fundamentals
    "Concentration": new TaskRequirement([getTaskElement("Concentration")], []),
    "Productivity": new TaskRequirement([getTaskElement("Productivity")], [{task: "Concentration", requirement: 5}]),
    "Bargaining": new TaskRequirement([getTaskElement("Bargaining")], [{task: "Concentration", requirement: 20}]),
    "Meditation": new TaskRequirement([getTaskElement("Meditation")], [{task: "Concentration", requirement: 30}, {task: "Productivity", requirement: 20}]),

    // Combat
    "Strength": new TaskRequirement([getTaskElement("Strength")], []),
    "Battle tactics": new TaskRequirement([getTaskElement("Battle tactics")], [{task: "Concentration", requirement: 20}]),
    "Muscle memory": new TaskRequirement([getTaskElement("Muscle memory")], [{task: "Concentration", requirement: 30}, {task: "Strength", requirement: 30}]),

    // Magic Skills
    "Mana control": new TaskRequirement([getTaskElement("Mana control")], [{task: "Concentration", requirement: 15}, {task: "Meditation", requirement: 15}]),
    "Spellcraft": new TaskRequirement([getTaskElement("Spellcraft")], [{task: "Mana control", requirement: 10}]),
    "Immortality": new TaskRequirement([getTaskElement("Immortality")], [{task: "Apprentice", requirement: 10}]),
    "Time warping": new TaskRequirement([getTaskElement("Time warping")], [{task: "Wizard", requirement: 10}]),
    "Super immortality": new TaskRequirement([getTaskElement("Super immortality")], [{task: "Archmage", requirement: 25}]),

    // Dark magic
    "Dark influence": new EvilRequirement([getTaskElement("Dark influence")], [{requirement: 1}]),
    "Evil control": new EvilRequirement([getTaskElement("Evil control")], [{requirement: 1}]),
    "Intimidation": new EvilRequirement([getTaskElement("Intimidation")], [{requirement: 1}]),
    "Demon training": new EvilRequirement([getTaskElement("Demon training")], [{requirement: 25}]),
    "Blood meditation": new EvilRequirement([getTaskElement("Blood meditation")], [{requirement: 75}]),
    "Demon's wealth": new EvilRequirement([getTaskElement("Demon's wealth")], [{requirement: 500}]),

    // Properties
    "Homeless": new CoinRequirement([getItemElement("Homeless")], [{requirement: 0}]),
    "Tent": new CoinRequirement([getItemElement("Tent")], [{requirement: 0}]),
    "Wooden hut": new CoinRequirement([getItemElement("Wooden hut")], [{requirement: gameData.itemData["Wooden hut"].getExpense() * 100}]),
    "Cottage": new CoinRequirement([getItemElement("Cottage")], [{requirement: gameData.itemData["Cottage"].getExpense() * 100}]),
    "House": new CoinRequirement([getItemElement("House")], [{requirement: gameData.itemData["House"].getExpense() * 100}]),
    "Large house": new CoinRequirement([getItemElement("Large house")], [{requirement: gameData.itemData["Large house"].getExpense() * 100}]),
    "Small palace": new CoinRequirement([getItemElement("Small palace")], [{requirement: gameData.itemData["Small palace"].getExpense() * 100}]),
    "Grand palace": new CoinRequirement([getItemElement("Grand palace")], [{requirement: gameData.itemData["Grand palace"].getExpense() * 100}]),

    // Misc
    "Book": new CoinRequirement([getItemElement("Book")], [{requirement: 0}]),
    "Dumbbells": new CoinRequirement([getItemElement("Dumbbells")], [{requirement: gameData.itemData["Dumbbells"].getExpense() * 100}]),
    "Personal squire": new CoinRequirement([getItemElement("Personal squire")], [{requirement: gameData.itemData["Personal squire"].getExpense() * 100}]),
    "Steel longsword": new CoinRequirement([getItemElement("Steel longsword")], [{requirement: gameData.itemData["Steel longsword"].getExpense() * 100}]),
    "Butler": new CoinRequirement([getItemElement("Butler")], [{requirement: gameData.itemData["Butler"].getExpense() * 100}]),
    "Sapphire charm": new CoinRequirement([getItemElement("Sapphire charm")], [{requirement: gameData.itemData["Sapphire charm"].getExpense() * 100}]),
    "Study desk": new CoinRequirement([getItemElement("Study desk")], [{requirement: gameData.itemData["Study desk"].getExpense() * 100}]),
    "Library": new CoinRequirement([getItemElement("Library")], [{requirement: gameData.itemData["Library"].getExpense() * 100}]), 
}

tempData["requirements"] = {}
for (key in gameData.requirements) {
    var requirement = gameData.requirements[key]
    tempData["requirements"][key] = requirement
}

loadGameData()

setCustomEffects()
addMultipliers()

setTab(jobTabButton, "jobs")

update()
setInterval(update, 1000 / updateSpeed)
setInterval(saveGameData, 3000)
setInterval(setSkillWithLowestMaxXp, 1000)
