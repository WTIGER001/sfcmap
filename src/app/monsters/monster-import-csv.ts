import { CsvImporter } from "../util/csv-importer";
import { Monster, KeyValue } from "./monster";

const toInt = CsvImporter.toInt
const toBool = CsvImporter.toBoolean

let counter = 0
export class MonsterImportCsv extends CsvImporter<Monster> {
  hasPictures: boolean;

  convertToObject(json: any) {
    counter +=1
    console.log("ON MONSTER ", counter);
    
    if (!this.isValid(json)) {
      console.log("Skipping... invalid");
      return undefined;
    }

    // console.log("RAW", json);
    
    const i = new Monster()

    if (json.AC) {
      const acArr = CsvImporter.multiNumber(json.AC)
      i.ac = acArr[0]
      i.acFlat = acArr[2]
      i.acTouch = acArr[1]
    }
    
    i.name = json.Name
    i.cr = json.CR
    i.xp = json.XP
    i.race = json.Race
    i.class = json.Class
    i.monstersource = json.MonsterSource
    i.alignment = json.Alignment
    i.size = json.Size
    i.type = json.Type
    i.subtype = json.SubType
    i.init = json.Init
    i.senses = json.Senses
    i.aura = json.Aura
    i.ac_mods = json.AC_Mods
    i.hp = toInt(json.HP)
    i.hd = json.HD
    i.hp_mods = json.HP_Mods
    i.fort = toInt(json.Fort)
    i.ref = toInt(json.Ref)
    i.will = toInt(json.Will)
    i.save_mods = json.Save_Mods
    i.defensiveabilities = json.DefensiveAbilities
    i.dr = json.DR
    i.immune = json.Immune
    i.resist = json.Resist
    i.sr = json.SR
    i.weaknesses = json.Weaknesses
    i.speed = json.Speed
    i.speed_mod = json.Speed_Mod
    i.melee = json.Melee
    i.ranged = json.Ranged
    i.space = json.Space
    i.reach = json.Reach
    i.specialAttacks = json.SpecialAttacks
    i.spellLikeAbilities = MonsterImportCsv.trimText(json.SpellLikeAbilities, 'Spell-Like Abilities ')
    i.spellsKnown = MonsterImportCsv.trimText(json.SpellsKnown, 'Spells Known ')
    i.spellsPrepared = MonsterImportCsv.trimText(json.SpellsPrepared, 'Spells Prepared ')
    i.spellDomains = json.SpellDomains
    i.abilityScores = json.AbilityScores
    i.abilityScore_mods = json.AbilityScore_Mods
    i.baseAtk = json.BaseAtk
    i.cmb = json.CMB
    i.cmd = json.CMD
    i.feats = json.Feats
    i.skills = json.Skills
    i.racialMods = json.RacialMods
    i.languages = json.Languages
    i.sq = json.SQ
    i.environment = json.Environment
    i.organization = json.Organization
    i.treasure = json.Treasure
    i.description_visual = json.Description_Visual
    i.group = json.Group
    i.source = json.Source
    i.isTemplate = toBool(json.IsTemplate)
    i.specialAbilities = MonsterImportCsv.extractSA(json.FullText)
    i.description = MonsterImportCsv.extractDescription(json.FullText)
    i.gender = json.Gender
    i.bloodline = json.Bloodline
    i.prohibitedSchools = json.ProhibitedSchools
    i.beforeCombat = json.BeforeCombat
    i.duringCombat = json.DuringCombat
    i.morale = json.Morale
    i.gear = json.Gear
    i.otherGear = json.OtherGear
    i.vulnerability = json.Vulnerability
    i.note = json.Note
    i.characterflag = toBool(json.CharacterFlag)
    i.companionflag = toBool(json.CompanionFlag)
    i.fly = toBool(json.Fly)
    i.climb = toBool(json.Climb)
    i.burrow = toBool(json.Burrow)
    i.swim = toBool(json.Swim)
    i.land = toBool(json.Land)
    i.templatesapplied = json.TemplatesApplied
    i.offensenote = json.OffenseNote
    i.basestatistics = json.BaseStatistics
    i.extractsprepared = json.ExtractsPrepared
    i.agecategory = json.AgeCategory
    i.mystery = json.Mystery
    i.classarchetypes = json.ClassArchetypes
    i.patron = json.Patron
    i.alternatenameform = json.AlternateNameForm
    i.id = json.id
    i.uniquemonster = toBool(json.UniqueMonster)
    i.mr = json.MR
    i.mythic = json.Mythic

    return i
  }


  isValid(json) : boolean  {
    if (json.id && json.id.length > 0 && json.Name && json.Name.length > 0) {
      return true
    }
    return false
  }

  static extractSA(fullText: string): KeyValue[] {
    const rtn : KeyValue[] = []
    const segments = this.extractTag(fullText)
    const saIndex = segments.indexOf('<b>SPECIAL ABILITIES</b>')
    if (saIndex > 0 && segments.length > saIndex) {
      for (let i=saIndex+1; i<segments.length; i++) {
        let txt  = segments[i]

        txt = this.trimText(txt, "<h5>")
        txt = this.trimText(txt, "</h5>")
        let iOpen = txt.indexOf("<b>")
        let iClose = txt.indexOf("</b>")

        if (iOpen >= 0 && iClose > iOpen) {
          let key  = txt.substring(iOpen + 3, iClose)
          let contents = txt.substr(iClose + 4)
          rtn.push(new KeyValue(key, contents))
        }
      }
    }
    return rtn;
  }

  static getBContents(txt : string): string {
    let iOpen = txt.indexOf("<b>")
    let iClose= txt.indexOf("</b>")
    if (iOpen > 0 && iClose> iOpen) {
      return txt.substring(iOpen +3, iClose)
    }
    return txt
  }


  static trimText(text: string, remove: string) : string {
    if (!text) {return text}
    let txt = text.toLowerCase().trim()
    let rem = remove.toLowerCase()
    let result = text.trim()
    if (txt.startsWith(rem)) {
      result = result.substr(rem.length)
    }
    if (txt.endsWith(rem)) {
      result = result.substr(0, txt.length - rem.length)
    }
    return result
  }

  static extractTag(fullText : string) : string[] {
    let segments : string[] = []
    let iOpenH5 = fullText.indexOf("<h5>")
    let iCloseH5 = fullText.indexOf("</h5>", iOpenH5+1)
    let text = fullText.substring(iOpenH5, iCloseH5)
    segments.push(text)
    
    while (iOpenH5 > 0) {
      iOpenH5 = fullText.indexOf("<h5>", iOpenH5+1)
      if (iOpenH5 > 0) {
        iCloseH5 = fullText.indexOf("</h5>", iOpenH5 + 1)
        text = fullText.substring(iOpenH5+4, iCloseH5)
        segments.push(text)
      }
    }

    return segments
  }
  static extractTags(fullText: string, tag: string): string[] {
    let tOpen = "<" + tag + ">"
    let tClose = "</" + tag + ">"
    let segments: string[] = []
    let iOpen = fullText.indexOf(tOpen)
    let iClose = fullText.indexOf(tClose, iOpen + 1)
    let text = fullText.substring(iOpen + tOpen.length, iClose)
    segments.push(text)

    while (iOpen > 0) {
      iOpen = fullText.indexOf(tOpen, iOpen + 1)
      if (iOpen > 0) {
        iClose = fullText.indexOf(tClose, iOpen + 1)
        text = fullText.substring(iOpen + tOpen.length, iClose)
        segments.push(text)
      }
    }

    return segments
  }

  static extractDescription(fullText: string): string {
    const segments = this.extractTags(fullText, 'h4')
    if (segments.length == 0) {
      return ""
    }
    let txt = segments[0].trim()
    return txt


    // const regex = /<h4><p><p>.*<\/h4>/
    // const found = this.pieces(regex, fullText)
    // let text = found && found.length > 0 ? found[0] : ""
    // const h4 = text.indexOf('<h4>')
    // const h4c = text.indexOf('</h4>')
    // if (h4 >= 0 && h4c > h4) {
    //   text = text.substring(h4+4, h4c).trim()
    // }
    // return text
  }

  static pieces(regex: RegExp, str: string): string[] {
    const items: string[] = []
    let m: RegExpExecArray;
    let count = 0
    while ((m = regex.exec(str)) !== null && count < 10) {
      count++
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        // console.log(`Found match, group ${groupIndex}: ${match}`);
        items.push(match)
      });
    }
    return items
  }

}