import { Monster } from "./monster";
import { Character, Attribute, Roll } from "../models";

export class MonsterToCharacter {
  public static convert(m : Monster) : Character {
    const c = new Character()
    c.id = "__MONSTER__CONVERT__" + c.id
    c.name = m.name
    c.alignment = m.alignment;

    MonsterToCharacter.addAtttributes(c,m)
    MonsterToCharacter.addAbilityScores(c,m)
    MonsterToCharacter.addRolls(c,m)

    return c
  }


  private static  addAtttributes(c: Character, m : Monster) {
    MonsterToCharacter.addAttr(c, 'HP', m.hp, m.hp)
    MonsterToCharacter.addAttr(c, 'AC', m.ac, m.ac)
    MonsterToCharacter.addAttr(c, 'Touch AC', m.acTouch, m.acTouch)
    MonsterToCharacter.addAttr(c, 'Flatfooted AC', m.acFlat, m.acFlat)
    MonsterToCharacter.addAttr(c, 'Initiative', parseInt(m.init), parseInt(m.init))
 
    MonsterToCharacter.addAttr(c, 'Fort', m.fort, m.fort)
    MonsterToCharacter.addAttr(c, 'Ref', m.ref, m.ref)
    MonsterToCharacter.addAttr(c, 'Will', m.will, m.will)
  }

  private static addAbilityScores(c: Character, mon: Monster) {
    const regex = /[A-z][a-z][a-z] [0-9]*/gm;
    const str = mon.abilityScores
    let m;

    const items : string[] = []
    while ((m = regex.exec(str)) !== null) {
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

    MonsterToCharacter.addAttr(c, 'Strength', MonsterToCharacter.extract('str', items))
    MonsterToCharacter.addAttr(c, 'Dexterity', MonsterToCharacter.extract('dex', items))
    MonsterToCharacter.addAttr(c, 'Constitution', MonsterToCharacter.extract('con', items))
    MonsterToCharacter.addAttr(c, 'Intelligence', MonsterToCharacter.extract('int', items))
    MonsterToCharacter.addAttr(c, 'Wisdom', MonsterToCharacter.extract('wis', items))
    MonsterToCharacter.addAttr(c, 'Charisma', MonsterToCharacter.extract('cha', items))
  }

  private static extract(name: string, items: string[]) : number  {
    const found = items.find(i => i.toLowerCase().startsWith(name))
    if (found) {
      const vals = found.split(' ')
      if (vals.length == 2) {
        return parseInt(vals[1])
      }
    }
    return 0
  }

  private static addRolls(c: Character, m : Monster) {
    MonsterToCharacter.addRoll(c, 'Initiative', "d20" + MonsterToCharacter.plus(m.init))
  }

  private static plus(val : string) {
    const v = parseInt(val)
    if(v >=0 ) {
      return "+" + v
    } else {
      return "" + v
    }
  }
  private static addAttr(c : Character, attr: string, current: number, max ?: number) {
    const a = new Attribute ()
    a.attr = attr
    a.current = current
    a.max = max ? max : current
    c.attributes.push(a)
  }

  private static addRoll(c : Character, rollName : string, expression : string) {
    const a = new Roll()
    a.name = rollName
    a.expression = expression
    c.rolls.push(a)
  }
}