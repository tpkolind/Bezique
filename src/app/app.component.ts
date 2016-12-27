import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { GamePage } from '../pages/game/game';
import { BeziqueCardGame } from '../services/game'; 


@Component({
  templateUrl: 'app.html',
  providers: [BeziqueCardGame]
})
export class MyApp {
  rootPage = GamePage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
