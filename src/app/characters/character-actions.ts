import { TokenAnnotation, Character, TokenBar, LightSource } from "../models";
import { Aura } from "../models/aura";

export class CharacterActions {
  public static copyToCharacter(token : TokenAnnotation, char : Character) {
    this.copyTo(token, char)
  }

  public static copyFromCharacter(token: TokenAnnotation, char: Character) {
    this.copyTo(char, token)
  }

  public static copyTo(source: TokenAnnotation | Character, dest: TokenAnnotation | Character) {
    // Copy the bars
    const bars = source.bars || []
    dest.bars = bars.map(bar => {
      const newBar = new TokenBar()
      Object.assign(newBar, bar)
      return newBar
    })

    // copy personal
    // char.alias = token.name
    // char.size = token.sizeX
    // char.speed = token.speed
    // char.reach = token.reach
    // char.vision = token.vision

    // copy auras
    const auras = source.auras || []
    dest.auras = auras.map(aura => {
      const newAura = new Aura()
      Object.assign(newAura, aura)
      return newAura
    })

    // Copy lights
    const lights = source.lights || []
    dest.lights = lights.map(light => {
      const newLight = new LightSource()
      Object.assign(newLight, light)
      return newLight
    })
  }


}