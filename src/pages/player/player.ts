import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BeziqueCardGame } from '../../card-services/game';

@Component({
  selector: 'player-page',
  templateUrl: 'player.html',
  providers: []
})
export class PlayerPage {

  constructor(public navCtrl: NavController, public beziqueCardGame : BeziqueCardGame) {
  }

  public doDeal() {
    this.beziqueCardGame.deal();
  }

  public doReset() {
    this.beziqueCardGame.reset();
  }
}
