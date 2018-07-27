import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { User } from './models';

/**
 * Sounds available
 */
export enum Sounds {
  DiceRoll = 'dice.mp3',
  Beep = 'beep.mp3'
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private user: User
  private audioMap: Map<string, HTMLAudioElement> = new Map()

  constructor(data: DataService) {
    data.user.subscribe(u => this.user = u)
    for (let key in Sounds) {
      this.audioMap.set(Sounds[key], new Audio('./assets/audio/' + Sounds[key]))
    }
  }

  play(sound: Sounds) {
    try {
      if (this.user.prefs.sounds) {
        this.audioMap.get(sound).play()
      }
    } catch (e) {
      console.error(e)
    }
  }
}
