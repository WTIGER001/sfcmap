import * as xml2js from 'xml2js'
import { Character, Attribute, Roll } from '../models';
import { Subject, Observable, ReplaySubject } from 'rxjs';
import { $ } from 'protractor';


export class HeroLabCharacter {

  public static importData(data: string): Observable<Character[]> {
    const rtn = new ReplaySubject<Character[]>()
    console.log("DATA, ", data);

    xml2js.parseString(data, (err, result) => {
      console.log("JSON PARSED");
      console.log(result);

      const items: Character[] = []
      result.document.public[0].character.forEach(c => {
        let chr = HeroLabCharacter.readCharacter(c)
        console.log("DONE WITH CHAR: ", chr);

        items.push(chr)
      })
      rtn.next(items)
      rtn.complete()
      console.log("DONE SENDING");
    })

    return rtn
  }


  private static readCharacter(hero: any): Character {
    console.log("HERO PARSED", hero);

    const chr = new Character()

    chr.name = hero.$.name
    chr.alignment = hero.alignment[0].$.name
    chr.size = hero.size[0].$.name
    chr.reach = hero.size[0].reach[0].$.value
    chr.classes = hero.classes[0].$.summary
    chr.attributes.push(Attribute.from("HP", hero.health[0].$.hitpoints, hero.health[0].$.currenthp))

    hero.attributes[0].attribute.forEach(a => {
      chr.attributes.push(Attribute.from(a.$.name, a.attrvalue[0].$.modified))
    })
    hero.saves[0].save.forEach(a => {
      chr.attributes.push(Attribute.from(a.$.abbr, a.$.save))
    })
    chr.attributes.push(Attribute.from("AC", hero.armorclass[0].$.ac))
    chr.attributes.push(Attribute.from("Touch AC", hero.armorclass[0].$.touch))
    chr.attributes.push(Attribute.from("Flatfooted AC", hero.armorclass[0].$.flatfooted))
    chr.attributes.push(Attribute.from("Initiative", hero.initiative[0].$.total))

    chr.speed = hero.movement[0].speed[0].$.value

    if (hero.melee && hero.melee[0].weapon) {
      hero.melee[0].weapon.forEach(w => {
        HeroLabCharacter.addIfNeeded(chr.rolls, (Roll.from(w.$.name + " Attack", w.$.attack)))
        HeroLabCharacter.addIfNeeded(chr.rolls, (Roll.from(w.$.name + " Dmg", w.$.damage)))
      })
    }

    if (hero.ranged && hero.ranged[0].weapon) {
      hero.ranged[0].weapon.forEach(w => {
        HeroLabCharacter.addIfNeeded(chr.rolls, Roll.from(w.$.name + " Attack", w.$.attack))
        HeroLabCharacter.addIfNeeded(chr.rolls, (Roll.from(w.$.name + " Dmg", w.$.damage)))
      })
    }

    // Add popular Rolls
    HeroLabCharacter.addIfNeeded(chr.rolls, Roll.from("Initiative", "d20 +Initiative"))
    HeroLabCharacter.addSkills(chr.rolls, hero)
    return chr
  }

  private static addSkills(rolls: Roll[], hero: any) {
    hero.skills[0].skill.forEach(sk => {
      const ranks = parseInt(sk.$.ranks)
      if (ranks > 0) {
        const value = parseInt(sk.$.value)
        if (value >= 0) {
          rolls.push(Roll.from(sk.$.name, "d20 +" + value))
        } else {
          rolls.push(Roll.from(sk.$.name, "d20 " + value))
        }
      }
    })
  }

  private static addSkillRoll(rolls: Roll[], hero: any, skill: string) {
    const sk = hero.skills[0].skill.find(s => s.$.name.toLowerCase() == skill.toLowerCase())
    if (sk) {
      const value = parseInt(sk.$.value)
      if (value >= 0) {
        rolls.push(Roll.from(skill, "d20 +" + value))
      } else {
        rolls.push(Roll.from(skill, "d20 " + value))
      }
    }
  }


  private static addIfNeeded(rolls: Roll[], r: Roll) {
    let indx = rolls.findIndex(r1 => r1.name == r.name)
    if (indx < 0) {
      rolls.push(r)
    }
  }
}