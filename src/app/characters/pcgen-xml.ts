import * as xml2js from 'xml2js'
import { Character, Attribute, Roll } from '../models';
import { Subject, Observable, ReplaySubject } from 'rxjs';
import { $ } from 'protractor';


export class PCGenXml {

  public static importData(data: string): Observable<Character[]> {
    const rtn = new ReplaySubject<Character[]>()
    console.log("DATA, ", data);

    const opts = {
      normalize: true,
      // explicitArray: false,
      ignoreAttrs: true
    }
    xml2js.parseString(data, opts, (err, result) => {
      console.log("JSON PARSED");
      console.log(result);

      const items: Character[] = []

      // result.character.forEach(c => {
      let chr = PCGenXml.readCharacter(result.character)
      console.log("DONE WITH CHAR: ", chr);
      items.push(chr)
      // })
      rtn.next(items)
      rtn.complete()
      console.log("DONE SENDING");
    })

    return rtn
  }

  private static readCharacter(hero: any): Character {
    console.log("HERO PARSED", hero);

    const chr = new Character()

    chr.name = hero.basics[0].name
    chr.alignment = hero.basics[0].alignment[0].long
    chr.classes = PCGenXml.classes(hero)

    chr.size = hero.basics[0].size[0].long[0]
    chr.speed = hero.basics[0].move[0].all[0]
    chr.race = hero.basics[0].race[0]
    chr.reach = hero.basics[0].reach[0].reach[0]
    chr.vision = hero.basics[0].vision[0].vision[0]

    chr.attributes.push(Attribute.from("HP", hero.hit_points[0].points[0]))
    chr.attributes.push(Attribute.from("AC", hero.armor_class[0].total[0]))
    chr.attributes.push(Attribute.from("Touch AC", hero.armor_class[0].touch[0]))
    chr.attributes.push(Attribute.from("Flatfooted AC", hero.armor_class[0].flat[0]))
    chr.attributes.push(Attribute.from("Initiative", hero.initiative[0].total[0]))


    chr.attributes.push(...this.stats(hero))

    chr.rolls.push(...PCGenXml.saves(hero))
    chr.rolls.push(...PCGenXml.skills(hero))
    chr.rolls.push(...PCGenXml.attacks(hero))

    return chr
  }

  private static attacks(hero: any): Roll[] {
    const rtn: Roll[] = []
    hero.weapons[0].weapon.forEach(a => {
      const name = a.common[0].name[0].output[0]
      const dmg = a.common[0].damage[0]
      const tohit = a.common[0].to_hit[0].total_hit[0]

      rtn.push(Roll.from(name + " Attack", this.posNeg(tohit)))
      rtn.push(Roll.from(name + " DMG", this.posNeg(dmg)))

    })
    return rtn
  }

  private static posNeg(invalue: string): string {
    const value = PCGenXml.toInt(invalue, 0)
    if (value >= 0) {
      return " +" + value
    } else {
      return " " + value
    }
  }

  private static saves(hero: any): Roll[] {
    const rtn: Roll[] = []
    hero.saving_throws[0].saving_throw.forEach(a => {
      const value = PCGenXml.toInt(a.total[0], 0)
      if (value >= 0) {
        rtn.push(Roll.from(a.name[0].short[0], "d20 +" + value))
      } else {
        rtn.push(Roll.from(a.name[0].short[0], "d20 " + value))
      }
    })
    return rtn
  }

  private static skills(hero: any): Roll[] {
    const rtn: Roll[] = []
    hero.skills[0].skill.forEach(a => {
      if (PCGenXml.toInt(a.ranks[0], 0) > 0) {
        const value = this.toInt(a.skill_mod[0], 0)
        if (value >= 0) {
          rtn.push(Roll.from(a.name[0], "d20 +" + value))
        } else {
          rtn.push(Roll.from(a.name[0], "d20 " + value))
        }
      }
    })
    return rtn
  }

  private static stats(hero: any): Attribute[] {
    const rtn: Attribute[] = []
    hero.abilities[0].ability.forEach(a => {
      rtn.push(Attribute.from(a.name[0].short[0], this.toInt(a.score[0], 0)))
    })
    return rtn
  }

  private static toInt(v: string, def: number): number {
    try {
      return parseInt(v)
    } catch {

    }
    return def
  }
  private static classes(hero: any): string {
    let rtn = ''
    hero.basics[0].classes[0].class.forEach(cl => {
      rtn += cl.name + " (" + cl.level + ") "
    })
    return rtn.trim()
  }
}