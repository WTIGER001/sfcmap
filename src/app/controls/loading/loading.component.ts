import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  constructor() { }

  @Input() tolerance = 30
  loading = false
  running = false
  time = 0
  timer 

  start() {
    this.time = 0
    this.running = true;
    this.timer = setInterval(() => {
      this.time += 5

      if (this.running && this.time > this.tolerance) {
        this.loading = true
        clearInterval(this.timer)
      } else if (!this.running){
         this.loading = false
        clearInterval(this.timer)
      } 
    }, 5) 
  }

  stop() {
    this.running = false
    this.loading = false
  }

  ngOnInit() {
  }

}
