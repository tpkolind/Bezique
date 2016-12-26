import { Component, Input } from '@angular/core';

import { DeckPage } from '../deck-page/deck-page';
import { PlayerPage } from '../player-page/player-page';
import { CardGame, BeziqueCardGame } from '../../card-services/game';

@Component({
  templateUrl: 'game-page.html',
  providers: [BeziqueCardGame]
})
export class GamePage {
  // this tells the tabs component which Pages
  // should be each tab's root Page

  @Input()
  public game : CardGame;

  constructor (public beziqueCardGame : BeziqueCardGame) {
    this.game = beziqueCardGame;
  }

  deckTab : any  = DeckPage;
  playerTab: any = PlayerPage;

}
