import { Component } from '@angular/core';

import { DeckPage } from '../deck/deck';
import { PlayerPage } from '../player/player';

@Component({
  templateUrl: 'game.html'
})
export class GamePage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  deckTab: any = DeckPage;
  playerOneTab: any = PlayerPage;
}
