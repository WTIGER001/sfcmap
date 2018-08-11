import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Online } from '../../models';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-user-online',
  templateUrl: './user-online.component.html',
  styleUrls: ['./user-online.component.css']
})
export class UserOnlineComponent implements OnInit {
  online: Online[] = []
  constructor(private data: DataService) {
    this.data.online.subscribe(a => this.online = a)
  }

  ngOnInit() {
  }

  getText(u: Online) {
    const d = new Date(u.login)
    return u.name + "\n" + this.formatDate(d)
  }
  getDate(u: Online) {
    const d = new Date(u.login)
    return this.formatDate(d)
  }

  formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
  }
}
