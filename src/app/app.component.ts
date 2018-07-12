import { Component } from '@angular/core'
import { DataService } from './data.service';
import { User } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: User
  constructor(private data: DataService) {
    this.data.user.subscribe(u => this.user = u)
  }
}
