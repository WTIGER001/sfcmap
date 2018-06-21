import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  success(message: any): any {
    console.log(message);
  }
  constructor() { }

  showError(error : string, operation? : string, code? : number) {
    console.log("ERRORS: " + error);
  }
}
