import { Component, AfterViewInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DiceRoller } from '../../util/dice';
import { Prefs, DiceRoll } from '../../models';
import { MessageService } from '../../message.service';
import { AudioService, Sounds } from '../../audio.service';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-dice-canvas',
  templateUrl: './dice-canvas.component.html',
  styleUrls: ['./dice-canvas.component.css']
})
export class DiceCanvasComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef
  @Input() clearTime = 10000
  @Output() diceroll = new EventEmitter()
  @Output() dicetotal = new EventEmitter()
  @Output() cleared = new EventEmitter()

  @Input() publish = true
  roller: DiceRoller
  prefs: Prefs
  diceResult: DiceRoll
  timer

  constructor(private data: DataService, private msg: MessageService, private audio: AudioService) {
    this.data.userPrefs.subscribe(u => {
      this.prefs = u
      if (this.roller) {
        console.log("Use 3D Dice", u.use3dDice);
        this.roller.use3d = u.use3dDice
      }
    })
  }

  ngAfterViewInit() {
    this.roller = new DiceRoller(true, this.canvas.nativeElement)
    if (this.prefs) {
      console.log("Use 3D Dice", this.prefs.use3dDice);
      this.roller.use3d = this.prefs.use3dDice
    }
  }

  rollDice(expression: string, rollType?: string, forToken?: string, ) {
    if (expression) {
      this.audio.play(Sounds.DiceRoll)
      this.roller.rollDice(expression).subscribe(r => {
        this.diceResult = r
        this.diceResult.tokenId = forToken
        this.diceResult.rolltype = rollType
        let copy = DiceRoll.copy(r)
        

        this.diceroll.emit(copy)
        this.dicetotal.emit(r.getText())

        if (this.clearTime > 0) {
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            this.cleared.emit(DiceRoll.copy(r))
            this.roller.clear()
            this.diceResult = undefined
            this.timer = undefined
          }, 10000);
        }
        if (this.publish) {
          this.msg.sendMessage(DiceRoll.copy(r))
        }
      })
    }
  }



}
