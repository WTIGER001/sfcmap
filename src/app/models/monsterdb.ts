import { Character } from "./character";
import { parse } from "papaparse";
import { ObjectType } from "./core";
import { GoogleImageSearch, ImageSearchResult } from "../util/GoogleImageSearch";

export class MonsterText extends ObjectType {
  public static readonly TYPE = 'db.MonsterText'
  public static readonly FOLDER = 'monster-text'
  readonly objType: string = MonsterText.TYPE

  // TypeScript guard
  static is(obj: any): obj is MonsterText {
    return obj.objType !== undefined && obj.objType === MonsterText.TYPE
  }

  static to(obj: any): MonsterText {
    return obj
  }

  id: string
  name: string
  fulltext: string
  size: string
  cr: string
  alignment: string
  classes: string
  type: string
  subtype: string
  init: number
  ac: number
  acFlat: number
  acTouch: number
  hp: number
  speed: string
  image: string
  thumb: string
}

export class MonsterIndex extends ObjectType {
  public static readonly TYPE = 'db.monsterIndex'
  public static readonly FOLDER = 'monster-index'
  readonly objType: string = MonsterIndex.TYPE

  // TypeScript guard
  static is(obj: any): obj is MonsterIndex {
    return obj.objType !== undefined && obj.objType === MonsterIndex.TYPE
  }

  static to(obj: any): MonsterIndex {
    return obj
  }

  id: string
  name: string
  size: string
  cr: string
  alignment: string
  classes: string
  type: string
  subtype: string
  init: number
  ac: number
  acFlat: number
  acTouch: number
  hp: number
  speed: string
  image: string
  thumb: string
}

export class MonsterDB {
  public static toCharacter(monsterJson): Character {
    return undefined
  }

  public static toIndex(monsterJson): MonsterIndex {
    const i = new MonsterIndex()

    i.name = monsterJson.Name
    i.id = monsterJson.id
    i.size = monsterJson.Size
    i.cr = monsterJson.CR
    i.alignment = monsterJson.Alignment
    i.type = monsterJson.Type
    i.subtype = monsterJson.SubType
    i.init = this.toInt(monsterJson.Init)

    const acArr = this.multiNumber(monsterJson.AC)
    i.ac = acArr[0]
    i.acFlat = acArr[2]
    i.acTouch = acArr[1]
    i.hp = this.toInt(monsterJson.HP)
    i.speed = monsterJson.Speed

    return i
  }

  public static toText(monsterJson): MonsterText {
    const i = new MonsterText()

    i.name = monsterJson.Name
    i.id = monsterJson.id
    i.size = monsterJson.Size
    i.cr = monsterJson.CR
    i.alignment = monsterJson.Alignment
    i.type = monsterJson.Type
    i.subtype = monsterJson.SubType
    i.init = this.toInt(monsterJson.Init)

    const acArr = this.multiNumber(monsterJson.AC)
    i.ac = acArr[0]
    i.acFlat = acArr[2]
    i.acTouch = acArr[1]
    i.hp = this.toInt(monsterJson.HP)
    i.speed = monsterJson.Speed

    i.fulltext = monsterJson.FullText

    return i
  }

  static toInt(input: string): number {
    let a = parseInt(input)
    if (isNaN) {
      a = 0
    }
    return a
  }

  static multiNumber(input: string): number[] {
    const exp = /[\d-]*/g
    const matches = input.match(exp)
    const arr: number[] = []
    matches.forEach(m => {
      if (m.length > 0 && m != "-") {
        arr.push(parseInt(m))
      }
    })

    return arr
  }


  public static async getRandomPictures(index: MonsterIndex[], text: MonsterText[]) {
    for (let ind = 0; ind < index.length; ind++) {
      const i = index[ind]
      const term = i.name + " fantasy art"
      const r: ImageSearchResult[] = await GoogleImageSearch.searchImage(term)

      i.image = r[0].url
      i.thumb = r[0].thumb
      text[ind].image = i.image
      text[ind].thumb = i.thumb
    }
  }

  public static async loadme(csvFile: File): Promise<{ index: MonsterIndex[], text: MonsterText[] }> {
    const obj = await this.parse2(csvFile)

    const index: MonsterIndex[] = []
    const text: MonsterText[] = []
    const result = {
      index: index,
      text: text
    }
    obj.data.forEach(d => {
      if (d.id && d.FullText) {
        result.index.push(MonsterDB.toIndex(d))
        result.text.push(MonsterDB.toText(d))
      }
    })

    console.log("RECORDS : ", result.text.length);

    result.text = result.text.slice(3000)
    result.index = result.index.slice(3000)

    await this.getRandomPictures(result.index, result.text)
    return result
  }



  static parse2(csvFile: File): Promise<any> {
    return new Promise((resolve, reject) => {
      parse(csvFile, {
        header: true,
        complete: resolve
      });
    })
  }

  static filterMonsters(items: MonsterIndex[], filter: string): MonsterIndex[] {
    return items.filter(a => this.matchesFilter(a, filter))
  }

  static matchesFilter(a: MonsterIndex, filter: string): boolean {

    const regex = /CR([<>=]*)([\d])([\/]?)([\d*])/i

    let realFilter = filter.replace(regex, '').trim()
    let cr = "CR" + a.cr
    let realMatch = false
    let hasCR = filter.match(regex) != undefined
    let crMatch = this.matchCR(a, filter)
    if (realFilter.length > 0) {
      if (a.name.toLowerCase().includes(realFilter.toLowerCase())) {
        realMatch = true
      }
      if (a.type.toLowerCase().includes(realFilter.toLowerCase())) {
        realMatch = true
      }
    }

    // console.log("MATCHING ", filter, hasCR, crMatch, realFilter);

    if (crMatch && realFilter.length == 0) {
      return crMatch
    }
    if (realFilter.length > 0 && !hasCR) {
      return realMatch
    }
    if (realFilter.length > 0 && hasCR) {
      return realMatch && crMatch
    }

    return false
  }

  static matchCR(a: MonsterIndex, filter: string): boolean {
    const regex = /CR([<>=]*)([\d])([\/]?)([\d]*)/i
    let match;

    while ((match = regex.exec(filter)) !== null) {

      // This is necessary to avoid infinite loops with zero-width matches
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      let all = match[0]

      // Group 1 is <, >, <=, >=, <>
      let cmp = match[1]

      // Group 2 is the number in front of the dice
      let digit1 = match[2]

      // Group 3 is the 'd' indicator, which signifies a die
      let divide = match[3]

      // Group 4 is the modifier or dice classifier
      let digit2 = match[4]

      // Convert our CR to a real number
      let cr: number = this.crToNumber(a.cr)
      if (isNaN(cr)) {
        return false
      }

      let crCompare = 0
      if (divide == "/") {
        crCompare = parseInt(digit1) / parseInt(digit2)
      } else {
        crCompare = parseInt(digit1 + digit2)
      }

      if (cmp == '' || cmp == '=') {
        return crCompare == cr
      }
      if (cmp == '<') {
        return cr < crCompare
      }
      if (cmp == '<=') {
        return cr <= crCompare
      }
      if (cmp == '>') {
        return cr > crCompare
      }
      if (cmp == '>=') {
        return cr >= crCompare
      }
      if (cmp == '<>') {
        return cr != crCompare
      }
      return false
    }
  }

  static compare(a: MonsterIndex, b: MonsterIndex, compare: string) {
    if (compare == 'name') {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    } else if (compare = 'cr') {
      return this.crToNumber(b.cr) - this.crToNumber(a.cr)
    } else if (compare = 'type') {
      if (a.type < b.type) return -1;
      if (a.type > b.type) return 1;
      return 0;
    }
  }

  static crToNumber(cr: string): number {
    let crNum = parseInt(cr)
    if (cr.includes("/")) {
      let parts = cr.split("/")
      if (parts.length == 2) {
        crNum = parseInt(parts[0]) / parseInt(parts[1])
      }
    }
    return crNum
  }

}


  // "Name": "",
  // "CR": "27",
  // "XP": "3276800",
  // "Race": "",
  // "Class": "",
  // "MonsterSource": "",
  // "Alignment": "LE",
  // "Size": "Huge",
  // "Type": "outsider",
  // "SubType": "(devil, evil, extraplanar, lawful)",
  // "Init": "7",
  // "Senses": "darkvision 60 ft., detect chaos, detect good, see in darkness, true seeing; Perception +45",
  // "Aura": "frightful presence (120 ft., DC 35), unholy aura (30 ft., DC 28, 10 rounds)",
  // "AC": "46, touch 33, flat-footed 39",
  // "AC_Mods": "(+4 deflection, +7 Dex, +13 natural, +14 profane, -2 size)",
  // "HP": "635",
  // "HD": "(31d10+465)",
  // "HP_Mods": "regeneration (epic and good, good and mythic, or deific)",
  // "Saves": "Fort +36, Ref +28, Will +27",
  // "Fort": "36",
  // "Ref": "28",
  // "Will": "27",
  // "Save_Mods": "",
  // "DefensiveAbilities": "armor of thorns, freedom of movement, hellish resurrection, immovable",
  // "DR": "20/good, epic, and silver",
  // "Immune": "ability damage, ability drain, charm effects, compulsion effects, death effects, energy drain, fire, petrification, poison",
  // "Resist": "acid 30, cold 30",
  // "SR": "38",
  // "Weaknesses": "",
  // "Speed": "50 ft.",
  // "Speed_Mod": " air walk",
  // "Melee": "Avernus Claw +48/+43/+38/+33 (2d6+19/19-20 plus 1d6 fire), 2 hooves +44 (1d8+15 plus disease), slam +44 (1d8+15 plus swat)",
  // "Ranged": "poison barb +36 (1d4+15/19-20 plus poison)",
  // "Space": "15 ft.",
  // "Reach": "15 ft. (25 ft. with trident)",
  // "SpecialAttacks": "crown of laurels, disease, poison, poison barb, powerful hooves, swat, trample (4d8+22, DC 40)",
  // "SpellLikeAbilities": "Spell-Like Abilities (CL 27th; concentration +37)  Constant-air walk, detect chaos, detect good, freedom of movement, true seeing, unholy aura (DC 28)   At Will-blasphemy (DC 27), desecrate, diminish plants, greater dispel magic, greater teleport, plant growth, shapechange, telekinesis (DC 25), thorny entanglementACG (DC 23), unhallow, unholy blight, wall of stone   3/day-overwhelming presenceUM (DC 29), quickened fire seeds (DC 26), reverse gravity, summon devils   1/day-imprisonment (DC 29), meteor swarm (DC 29), time stop",
  // "SpellsKnown": "",
  // "SpellsPrepared": "",
  // "SpellDomains": "",
  // "AbilityScores": "Str 40, Dex 24, Con 40, Int 29, Wis 33, Cha 31",
  // "AbilityScore_Mods": "",
  // "BaseAtk": "31",
  // "CMB": "+48 (+52 bull rush, +52 disarm)",
  // "CMD": "83 (immovable 85 vs. bull rush, 85 vs. disarm, 87 vs. trip)",
  // "Feats": "Awesome Blow, Blind-Fight, Combat Expertise, Combat Reflexes, Craft Magic Arms and Armor, Critical Focus, Greater Bull Rush, Greater Disarm, Improved Bull Rush, Improved Critical (trident), Improved Disarm, Iron Will, Multiattack, Power Attack, Quicken Spell-Like Ability (fire seeds), Staggering Critical",
  // "Skills": "Bluff +44, Diplomacy +44, Handle Animal +44, Heal +42, Intimidate +44, Knowledge (arcana) +40, Knowledge (engineering) +40, Knowledge (nature) +43, Knowledge (planes) +43, Perception +45, Profession (herbalist) +42, Sense Motive +45, Spellcraft +40, Stealth +33, Use Magic Device +41",
  // "RacialMods": "",
  // "Languages": "Abyssal, Celestial, Common, Draconic, Dwarven, Elven, Infernal, Sylvan; telepathy 300 ft.",
  // "SQ": "infernal duke traits (see page 43), irresistible force",
  // "Environment": " any (Hell)",
  // "Organization": "solitary (unique)",
  // "Treasure": "triple standard (Avernus Claw, other treasure)",
  // "Description_Visual": "This giant, centaurlike creature's body is made of hardened, thorny vines. A crown of laurels graces its brow.",
  // "Group": "Infernal Duke",
  // "Source": "Hell Unleashed",
  // "IsTemplate": "0",
  // "SpecialAbilities": "Armor of Thorns (Ex) A network of thorny vines armors and invades Furcas's body. Any creature that strikes Furcas with a non-reach melee weapon, unarmed strike, or natural weapon takes 1d8+7 points of piercing damage from the barbs studding the infernal duke's body and must succeed at a DC 40 Fortitude saving throw or be poisoned (potentially in addition to the effects of unholy aura). This living, toxic armor also feeds off of all manner of corruption. Any attempt to poison Furcas or magically control his vine armor heals him for 4d6 points of damage. Furcas can also use his poison barbs to heal himself in this way.  Crown of Laurels (Su) Once per day as a move action, Furcas can bestow his laurel crown upon an adjacent creature. For the next 24 hours, the creature is affected as per the spells greater heroism and unholy aura. At the end of this period, these benefits cease and the creature is infected with a particularly resilient form of devil chills (see below). This  version requires six consecutive successful saving throws to cure, and can be magically cured only by a lawful evil spellcaster. Creatures immune to disease suffer no negative effects. The crown always returns to Furcas after 24 hours.  Disease (Su) Devil chills: hooves-injury; save Fort DC 40; onset immediate; frequency 1/day; effect 1d3 Str damage; cure 3 consecutive saves. The save DC is Constitution-based.  Immovable (Ex) While conscious, Furcas cannot be moved, tripped, or knocked prone by any attack, combat maneuver, spell, or similar effect generated by any creature lesser than a deity or object of less than artifact-level power.  Irresistible Force (Su) Anytime Furcas's attack moves a foe-whether through the use of a combat maneuver, Awesome Blow, telekinesis, or a similar effect-that creature is moved double the normal distance.  Poison (Ex) Poison barb-injury; save Fort DC 20; frequency 1/round for 10 rounds; effect fatigued; cure 3 consecutive saves. The save DC is Constitution-based.  Poison Barb (Su) As a standard action, Furcas can grow and fire a toxic barb from his body. This is a ranged attack with a range increment of 60 feet. Any creature struck by the barb must succeed at a DC 40 Fortitude saving throw or be poisoned. Furcas can decide what type of poison the barb bears, whether his own fatiguing toxin or any poison conveyed through injury that appears on the chart on page 559 of the Pathfinder RPG Core Rulebook. After using this ability, Furcas cannot grow another barb for 1d4 rounds.  Powerful Hooves (Ex) Furcas's hoof attacks are considered primary attacks. He always adds his full Strength bonus to the amount of damage dealt by his hooves.  Swat (Ex) As a free action, Furcas can use the Awesome Blow feat with his slam attack. Because of his irresistible force ability, any creature affected by this attack is hurled 20 feet.",
  // "Description": "Called the Knight of the Laurels and the Sentinel of Dis, Furcas is the infernal duke of duty, flames, and herbalism. His disparate concerns model him as a true knight of Hell, a sentry armed with fire and girded by thorns. His patience and wisdom make him one of the multiverse's greatest military commanders, but also a sage of all things green and growing. It might take eons, but Furcas knows that a relentless will can forge even the most delicate petal into a weapon deadlier than any spear.  While laurels do crown Furcas's brown, his title stems from the tangle of parasitic, cassytha-like growths that riddle the remains of his stern, once-angelic form. These vines constitute a mighty, tauric body-one that serves as armor for the infernal duke and as a bed for innumerable toxic plants. Furcas is rarely seen without the Avernus Claw, a trident gifted to him by Typhon, the deceased former archdevil of Avernus. The burning trident holds  the power to block any escape from the first layer of Hell, and serves as Furcas's divine symbol.  As Furcas's demesne-the Hanging Marches-lies on Avernus, the infernal duke is the subject of the layer's ruler, Barbatos. However, Furcas also maintains strong ties with Dis, the second layer of Hell, and its imperious ruler, the archdevil Dispater. These dual loyalties stem from the ancient hellmouth Voulgaz, which yawns at the center of Furcas's realm. The infernal duke's fortress, the Forked Pyre, guards the hellmouth and serves as the stronghold from which Furcas oversees his legions as they conduct travelers and damned souls into the plane-city beyond. Furcas has overseen this post for countless eons, and despite numerous sieges by celestials and proteans alike, the gate to Dis has never fallen.  Whether seeking to reclaim a damned soul (rightfully or otherwise), to gain some wisdom of the natural world, or to secure passage to Dis, characters with business in Hell are likely to travel through the Hanging Marches. This is made all the easier from Golarion by a permanent portal that connects a forested valley within Brevoy's Icerime Peaks with Olikscourt, a toppled outpost on the shore of the Crawling Sea. Few who trespass in the Hanging Marches escape the notice of the Knight of the Laurels.",
  // "FullText": "<link rel=\"stylesheet\"href=\"PF.css\"><div><h2>Infernal Duke, Furcas</h2><h3><i>This giant, centaurlike creature's body is made of hardened, thorny vines. A crown of laurels graces its brow.</i></h3><br></div><div class=\"heading\"><p class=\"alignleft\">Furcas</p><p class=\"alignright\">CR 27</p><div style=\"clear: both;\"></div></div><div><h5><b>XP </b>3,276,800</h5><h5>LE Huge outsider (devil, evil, extraplanar, lawful)</h5><h5><b>Init </b>+7; <b>Senses </b>darkvision 60 ft., <i>detect chaos</i>, <i>detect good</i>, see in darkness, <i>true seeing</i>; Perception +45</h5><h5><b>Aura </b>frightful presence (120 ft., DC 35), <i><i>unholy</i> aura</i> (30 ft., DC 28, 10 rounds)</h5></div><hr/><div><h5><b>DEFENSE</b></h5></div><hr/><div><h5><b>AC </b>46, touch 33, flat-footed 39 (+4 deflection, +7 Dex, +13 natural, +14 profane, -2 size)</h5><h5><b>hp </b>635 (31d10+465); regeneration (epic and good, good and mythic, or deific)</h5><h5><b>Fort </b>+36, <b>Ref </b>+28, <b>Will </b>+27</h5><h5><b>Defensive Abilities </b>armor of thorns, freedom of movement, hellish resurrection, immovable; <b>DR </b>20/good, epic, and silver; <b>Immune </b>ability damage, ability drain, charm effects, compulsion effects, death effects, energy drain, fire, petrification, poison; <b>Resist </b>acid 30, cold 30; <b>SR </b>38</h5></div><hr/><div><h5><b>OFFENSE</b></h5></div><hr/><div><h5><b>Spd </b>50 ft.;  <i>air walk</i></h5><h5><b>Melee </b><i>Avernus Claw</i> +48/+43/+38/+33 (2d6+19/19-20 plus 1d6 <i>fire</i>), 2 hooves +44 (1d8+15 plus disease), slam +44 (1d8+15 plus swat)</h5><h5><b>Ranged </b>poison barb +36 (1d4+15/19-20 plus poison)</h5><h5><b>Space </b>15 ft.; <b>Reach </b>15 ft. (25 ft. with trident)</h5><h5><b>Special Attacks </b>crown of laurels, disease, poison, poison barb, powerful hooves, swat, trample (4d8+22, DC 40)</h5><h5><b>Spell-Like Abilities</b> (CL 27th; concentration +37)  </br>Constant&mdash;<i>air walk</i>, <i>detect chaos</i>, <i>detect good</i>, <i>freedom of movement</i>, <i>true seeing</i>, <i><i>unholy</i> aura</i> (DC 28) </br>At Will&mdash;<i>blasphemy</i> (DC 27), <i>desecrate</i>, <i>diminish plants</i>, <i>greater dispel magic</i>, <i>greater teleport</i>, <i>plant growth</i>, <i>shapechange</i>, <i>telekinesis</i> (DC 25), <i>thorny entanglement</i><sup>ACG</sup> (DC 23), <i>unhallow</i>, <i><i>unholy</i> blight</i>, <i>wall of stone</i> </br>3/day&mdash;<i>overwhelming presence</i><sup>UM</sup> (DC 29), quickened <i><i>fire</i> seeds</i> (DC 26), <i>reverse gravity</i>, summon devils </br>1/day&mdash;<i>imprisonment</i> (DC 29), <i>meteor swarm</i> (DC 29), <i>time stop</i></h5></h5></div><hr/><div><h5><b>STATISTICS</b></h5></div><hr/><div><h5><b>Str </b>40, <b>Dex </b>24, <b>Con </b>40, <b>Int </b> 29, <b>Wis </b>33, <b>Cha </b>31</h5><h5><b>Base Atk </b>+31; <b>CMB </b>+48 (+52 bull rush, +52 disarm); <b>CMD </b>83 (immovable 85 vs. bull rush, 85 vs. disarm, 87 vs. trip)</h5><h5><b>Feats </b>Awesome Blow, Blind-Fight, Combat Expertise, Combat Reflexes, Craft Magic Arms and Armor, Critical Focus, Greater Bull Rush, Greater Disarm, Improved Bull Rush, Improved Critical (trident), Improved Disarm, Iron Will, Multiattack, Power Attack, Quicken Spell-Like Ability (<i><i>fire</i> seeds</i>), Staggering Critical</h5><h5><b>Skills </b>Bluff +44, Diplomacy +44, Handle Animal +44, Heal +42, Intimidate +44, Knowledge (arcana) +40, Knowledge (engineering) +40, Knowledge (nature) +43, Knowledge (planes) +43, Perception +45, Profession (herbalist) +42, Sense Motive +45, Spellcraft +40, Stealth +33, Use Magic Device +41</h5><h5><b>Languages </b>Abyssal, Celestial, Common, Draconic, Dwarven, Elven, Infernal, Sylvan; telepathy 300 ft.</h5><h5><b>SQ </b>infernal duke traits (see page 43), irresistible force</h5></div><hr/><div><h5><b>ECOLOGY</b></h5></div><hr/><div><h5><b>Environment </b> any (Hell)</h5><h5><b>Organization </b>solitary (unique)</h5><h5><b>Treasure </b>triple standard (<i>Avernus Claw</i>, other treasure)</h5></div><hr/><div><h5><b>SPECIAL ABILITIES</b></h5></div><hr/><div></h5><h5><b>Armor of Thorns (Ex)</b> A network of thorny vines armors and invades Furcas's body. Any creature that strikes Furcas with a non-reach melee weapon, unarmed strike, or natural weapon takes 1d8+7 points of piercing damage from the barbs studding the infernal duke's body and must succeed at a DC 40 Fortitude saving throw or be poisoned (potentially in addition to the effects of <i><i>unholy</i> aura</i>). This living, toxic armor also feeds off of all manner of corruption. Any attempt to poison Furcas or magically control his vine armor heals him for 4d6 points of damage. Furcas can also use his poison barbs to heal himself in this way.  </h5><h5><b>Crown of Laurels (Su)</b> Once per day as a move action, Furcas can bestow his laurel crown upon an adjacent creature. For the next 24 hours, the creature is affected as per the spells <i>greater heroism</i> and <i><i>unholy</i> aura</i>. At the end of this period, these benefits cease and the creature is infected with a particularly resilient form of devil chills (see below). This  version requires six consecutive successful saving throws to cure, and can be magically cured only by a lawful evil spellcaster. Creatures immune to disease suffer no negative effects. The crown always returns to Furcas after 24 hours.  </h5><h5><b>Disease (Su)</b> <i>Devil chills</i>: hooves-injury; save Fort DC 40; <i>onset</i> immediate; frequency 1/day; effect 1d3 Str damage; cure 3 consecutive saves. The save DC is Constitution-based.  </h5><h5><b>Immovable (Ex)</b> While conscious, Furcas cannot be moved, tripped, or knocked prone by any attack, combat maneuver, spell, or similar effect generated by any creature lesser than a deity or object of less than artifact-level power.  </h5><h5><b>Irresistible Force (Su)</b> Anytime Furcas's attack moves a foe-whether through the use of a combat maneuver, Awesome Blow, <i>telekinesis</i>, or a similar effect-that creature is moved double the normal distance.  </h5><h5><b>Poison (Ex)</b> Poison barb-injury; <i>save</i> Fort DC 20; <i>frequency</i> 1/round for 10 rounds; <i>effect</i> fatigued; <i>cure</i> 3 consecutive <i>save</i>s. The save DC is Constitution-based.  </h5><h5><b>Poison Barb (Su)</b> As a standard action, Furcas can grow and <i>fire</i> a toxic barb from his body. This is a ranged attack with a range increment of 60 feet. Any creature struck by the barb must succeed at a DC 40 Fortitude saving throw or be poisoned. Furcas can decide what type of poison the barb bears, whether his own fatiguing toxin or any poison conveyed through injury that appears on the chart on page 559 of the <i>Pathfinder RPG Core Rulebook</i>. After using this ability, Furcas cannot grow another barb for 1d4 rounds.  </h5><h5><b>Powerful Hooves (Ex)</b> Furcas's hoof attacks are considered primary attacks. He always adds his full Strength bonus to the amount of damage dealt by his hooves.  </h5><h5><b>Swat (Ex)</b> As a free action, Furcas can use the Awesome Blow feat with his slam attack. Because of his irresistible force ability, any creature affected by this attack is hurled 20 feet.</h5></div><br><div><h4><p><p>Called the Knight of the Laurels and the Sentinel of Dis, Furcas is the infernal duke of duty, flames, and herbalism. His disparate concerns model him as a true knight of Hell, a sentry armed with <i>fire</i> and girded by thorns. His patience and wisdom make him one of the multiverse's greatest military commanders, but also a sage of all things green and growing. It might take eons, but Furcas knows that a relentless will can forge even the most delicate petal into a weapon deadlier than any spear.  While laurels do crown Furcas's brown, his title stems from the tangle of parasitic, cassytha-like growths that riddle the remains of his stern, once-angelic form. These vines constitute a mighty, tauric body-one that serves as armor for the infernal duke and as a bed for innumerable toxic plants. Furcas is rarely seen without the <i>Avernus Claw</i>, a trident gifted to him by Typhon, the deceased former archdevil of Avernus. The burning trident holds  the power to block any escape from the first layer of Hell, and serves as Furcas's divine symbol.  As Furcas's demesne-the Hanging Marches-lies on Avernus, the infernal duke is the subject of the layer's ruler, Barbatos. However, Furcas also maintains strong ties with Dis, the second layer of Hell, and its imperious ruler, the archdevil Dispater. These dual loyalties stem from the ancient hellmouth Voulgaz, which yawns at the center of Furcas's realm. The infernal duke's fortress, the Forked Pyre, guards the hellmouth and serves as the stronghold from which Furcas oversees his legions as they conduct travelers and damned souls into the plane-city beyond. Furcas has overseen this post for countless eons, and despite numerous sieges by celestials and proteans alike, the gate to Dis has never fallen.  Whether seeking to reclaim a damned soul (rightfully or otherwise), to gain some wisdom of the natural world, or to secure passage to Dis, characters with business in Hell are likely to travel through the Hanging Marches. This is made all the easier from Golarion by a permanent portal that connects a forested valley within Brevoy's Icerime Peaks with Olikscourt, a toppled outpost on the shore of the Crawling Sea. Few who trespass in the Hanging Marches escape the notice of the Knight of the Laurels.</p></h4></div>",
  // "Gender": "",
  // "Bloodline": "",
  // "ProhibitedSchools": "",
  // "BeforeCombat": "",
  // "DuringCombat": "",
  // "Morale": "",
  // "Gear": "",
  // "OtherGear": "",
  // "Vulnerability": "",
  // "Note": "",
  // "CharacterFlag": "0",
  // "CompanionFlag": "0",
  // "Fly": "0",
  // "Climb": "0",
  // "Burrow": "0",
  // "Swim": "0",
  // "Land": "1",
  // "TemplatesApplied": "",
  // "OffenseNote": "",
  // "BaseStatistics": "",
  // "ExtractsPrepared": "",
  // "AgeCategory": "NULL",
  // "DontUseRacialHD": "0",
  // "VariantParent": "NULL",
  // "Mystery": "",
  // "ClassArchetypes": "",
  // "Patron": "",
  // "CompanionFamiliarLink": "NULL",
  // "FocusedSchool": "NULL",
  // "Traits": "",
  // "AlternateNameForm": "",
  // "StatisticsNote": "",
  // "LinkText": "",
  // "id": "7065",
  // "UniqueMonster": "0",
  // "MR": "0",
  // "Mythic": "0",
  // "MT": "0"