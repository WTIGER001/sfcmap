import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { Dice, DiceRoller, Roll } from '../../util/dice';
import * as THREE from 'src/scripts/three.min.js'

@Component({
  selector: 'app-rpg-tab',
  templateUrl: './rpg-tab.component.html',
  styleUrls: ['./rpg-tab.component.css']
})
export class RpgTabComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef
  @ViewChild('prev') prev: ElementRef
  @ViewChild('actionBox') actionbox: ElementRef
  expressionHistory: string[] = []
  rolls = []
  box: Dice
  lastindex = -1
  roller: DiceRoller
  result: string
  action: string

  constructor() { }

  ngOnInit() {

  }

  keydown() {
    this.lastindex = this.lastindex > -1 ? this.lastindex - 1 : 0
    // this.actionbox.nativeElement.value = this.expressionHistory[this.lastindex]
    this.action = this.expressionHistory[this.lastindex]
  }

  keyup() {
    this.lastindex = this.lastindex < this.expressionHistory.length ? this.lastindex + 1 : 20
    // this.actionbox.nativeElement.value = this.expressionHistory[this.lastindex]
    this.action = this.expressionHistory[this.lastindex]
  }

  resize(e) {
    console.log("resize: ", e);
    let r = <ClientRect>this.canvas.nativeElement.getBoundingClientRect()
    console.log("resize: ", r);
  }

  ngAfterViewInit() {
    this.roller = new DiceRoller(true, this.canvas.nativeElement)
  }

  enterAction(e) {
    console.log("Action: ", e)
    this.lastindex = -1
    this.rollDice(e)
    // this.actionbox.nativeElement.value = ""
    this.action = ""
  }

  update(e) {
    console.log("Update Action: ", e)

  }

  rollDice(expression: string) {
    let indx = this.expressionHistory.findIndex(item => item.toLowerCase() == expression.toLowerCase())
    if (indx >= 0) {
      this.expressionHistory.splice(indx)
    }
    this.expressionHistory.unshift(expression)
    if (this.expressionHistory.length > 20) {
      this.expressionHistory.splice(20)
    }

    this.roller.rollDice(expression).subscribe(r => {
      this.rolls.push(r)
    })
    // this.inititalize()


    // this.box.start_throw(() => this.box.parse_notation(expression), () => { console.log("BEFORE ROLL") },
    //   (box, notation, result) => {
    //     console.log("AFTER ROLL, ", notation, " ", result)
    //     let roll = new Roll()
    //     roll.values = notation
    //     this.rolls.push(roll)
    //   });
  }

  // inititalize() {
  //   if (this.box == undefined) {
  //     const canvas: HTMLElement = this.canvas.nativeElement
  //     let r = <ClientRect>this.canvas.nativeElement.getBoundingClientRect()
  //     this.box = new Dice(canvas, { w: r.width, h: r.height })
  //   }
  // }


  roll() {
    // this.test()
    // // var box = new $t.dice.dice_box(canvas, { w: 500, h: 300 });
    // // box.animate_selector = false;
    // this.box.animate_selector = false

    // let request = this.box.parse_notation("d6")
    // console.log("REQUEST: ", request);



    // this.box.start_throw(() => this.box.parse_notation("5d6"), () => { console.log("BEFORE ROLL") },
    //   (box, notation, result) => {
    //     console.log("AFTER ROLL, ", notation, " ", result)
    //     let roll = new Roll()
    //     roll.values = notation
    //     this.rolls.push(roll)
    //   });
  }

  setResult(notation, result) {

  }
}

// class Roll {
//   expression: string
//   values: number[]

//   get total(): number {
//     let t = 0;
//     this.values.forEach(v => { t = t + v })
//     return t
//   }

//   get text(): string {
//     let str = this.values.join(" + ")
//     str += " = " + this.total
//     return str
//   }
// }
