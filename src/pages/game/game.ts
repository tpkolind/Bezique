import { Component } from '@angular/core';

import { DeckPage } from '../deck/deck';
import { PlayerPage } from '../player/player';
import { TablePage } from '../table/table';
import { BeziqueCardGame } from '../../card-services/game';

@Component({
  templateUrl: 'game.html'
})
export class GamePage {
  // this tells the tabs component which Pages
  // should be each tab's root Page

  constructor (public beziqueCardGame : BeziqueCardGame) {}

  deckTab : any  = DeckPage;
  playerTab: any = PlayerPage;
  tableTab: any = TablePage;

}
