import { Component, Input } from '@angular/core';
import { Deck } from '../../card-services/deck';
import { BeziqueCardGame } from '../../card-services/game'

import { NavController } from 'ionic-angular';

@Component({
  selector: 'deck-page',
  templateUrl: 'deck-page.html',
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
