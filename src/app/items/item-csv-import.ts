import { CsvImporter } from "../util/csv-importer";
import { Item } from "./item";

const toInt = CsvImporter.toInt
const toBool = CsvImporter.toBoolean

export class ItemImport extends CsvImporter<Item> {
  hasPictures = true

  convertToObject(json: any): Item {


    const i = new Item()

    i.name = json.Name

    i.aura = json.Aura
    i.cl = json.CL
    i.slot = json.Slot
    i.price = json.Price
    i.weight = json.Weight
    i.description = json.Description
    i.requirements = json.Requirements
    i.cost = json.Cost
    i.group = json.Group
    i.source = json.Source
    i.alignment = json.AL
    i.int = toInt(json.Int)
    i.wis = toInt(json.Wis)
    i.cha = toInt(json.Cha)
    i.ego = json.Ego
    i.communication = json.Communication
    i.senses = json.Senses
    i.powers = json.Powers
    i.magicItems = json.MagicItems
    i.fulltext = json.FullText
    i.destruction = json.Destruction
    i.minorArtifactFlag = toBool(json.MinorArtifactFlag)
    i.majorArtifactFlag = toBool(json.MajorArtifactFlag)
    i.abjuration = toBool(json.Abjuration)
    i.conjuration = toBool(json.Conjuration)
    i.divination = toBool(json.Divination)
    i.enchantment = toBool(json.Enchantment)
    i.evocation = toBool(json.Evocation)
    i.necromancy = toBool(json.Necromancy)
    i.transmutation = toBool(json.Transmutation)
    i.auraStrength = json.AuraStrength
    i.weightValue = toInt(json.WeightValue)
    i.priceValue = toInt(json.PriceValue)
    i.costValue = toInt(json.CostValue)
    i.languages = json.Languages
    i.baseItem = json.BaseItem
    i.linkText = json.LinkText
    i.id = json.id
    i.mythic = toBool(json.Mythic)
    i.legendaryWeapon = toBool(json.LegendaryWeapon)
    i.illusion = toBool(json.Illusion)
    i.universal = toBool(json.Universal)
    i.scaling = json.Scaling

    if (i.id && i.fulltext) {
      return i
    }
    return undefined
  }






}