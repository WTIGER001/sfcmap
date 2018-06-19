import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor() { }

  showError(error : string, operation? : string, code? : number) {
    console.log("ERRORS: " + error);
  }
}
