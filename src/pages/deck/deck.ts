import { Component } from '@angular/core';
import { Deck, beziqueDeckConfiguration } from '../../card-services/deck';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-deck',
  templateUrl: 'deck.html'
})
export class DeckPage {

  public deck : Deck;

  constructor(public navCtrl: NavController) {
    this.deck = new Deck(beziqueDeckConfiguration);
  }

}
