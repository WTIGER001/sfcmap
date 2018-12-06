import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-install-pwa',
  templateUrl: './install-pwa.component.html',
  styleUrls: ['./install-pwa.component.css']
})
export class InstallPwaComponent implements OnInit {
  deferredPrompt
  showInstall = false
  constructor() { }

  ngOnInit() {
  }

  beforeInstall(e) {
    e.preventDefault()
    this.deferredPrompt = e;
    this.showInstall = true
  }

  addToHomeScreen() {
    this.deferredPrompt.prompt();  // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then(function (choiceResult) {

        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }

        this.deferredPrompt = null;
      });
  }

  noThanks() {
    this.showInstall = false
  }
}
