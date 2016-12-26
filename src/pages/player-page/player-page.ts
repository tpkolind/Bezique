import { Component, Input } from '@angular/core';
import { CardPlayer, BeziqueCardGame } from '../../card-services/game'

import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'player-page',
  templateUrl: 'player-page.html'
})
export class PlayerPage {

  @Input()
  public game : BeziqueCardGame;

  constructor(public navCtrl: NavController, private navParams : NavParams, private beziqueCardGame : BeziqueCardGame) {
    this.game = beziqueCardGame;
  }

}
