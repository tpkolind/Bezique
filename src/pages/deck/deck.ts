import { Component } from '@angular/core';
import { BeziqueCardGame } from '../../services/game'

import { NavController } from 'ionic-angular';

@Component({
  selector: 'deck-page',
  templateUrl: 'deck.html',
  providers: []
})
export class DeckPage {

  constructor(public navCtrl: NavController, public beziqueCardGame : BeziqueCardGame) {
  }

  public doDeal() {
    this.beziqueCardGame.deal();
  }

  public doReset() {
    this.beziqueCardGame.reset();
  }

}
