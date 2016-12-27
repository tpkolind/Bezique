import { Component, Input } from '@angular/core';

import { DeckPage } from '../deck-page/deck-page';
import { PlayerPage } from '../player-page/player-page';
import { TablePage } from '../table/table';
import { BeziqueCardGame } from '../../card-services/game';

@Component({
  templateUrl: 'game-page.html'
})
export class GamePage {
  // this tells the tabs component which Pages
  // should be each tab's root Page

  constructor (public beziqueCardGame : BeziqueCardGame) {}

  deckTab : any  = DeckPage;
  playerTab: any = PlayerPage;
  tableTab: any = TablePage;

}
