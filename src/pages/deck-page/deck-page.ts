import { Component, Input } from '@angular/core';
import { Deck } from '../../card-services/deck';
import { BeziqueCardGame } from '../../card-services/game'

import { NavController } from 'ionic-angular';

@Component({
  selector: 'deck-page',
  templateUrl: 'deck-page.html',
  providers: [ BeziqueCardGame ]
})
export class DeckPage {

  @Input()
  public deck : Deck;

  constructor(public navCtrl: NavController, private beziqueCardGame : BeziqueCardGame) {
    this.deck = beziqueCardGame.deck;
  }

}
