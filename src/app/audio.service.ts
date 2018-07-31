import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Prefs } from './models';

/**
 * Sounds available
 */
export enum Sounds {
  DiceRoll = 'dice.mp3',
  Beep = 'ping.mp3'
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private prefs: Prefs
  private audioMap: Map<string, HTMLAudioElement> = new Map()

  constructor(data: DataService) {
    data.userPrefs.subscribe(u => this.prefs = u)
    for (let key in Sounds) {
      this.audioMap.set(Sounds[key], new Audio('./assets/audio/' + Sounds[key]))
    }
  }

  play(sound: Sounds) {
    try {
      if (this.prefs.sounds == true) {
        this.audioMap.get(sound).play()
      }
    } catch (e) {
      console.error(e)
    }
  }
}
