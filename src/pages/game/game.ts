import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DeckPage } from '../deck/deck';
import { PlayerPage } from '../player/player';
import { TablePage } from '../table/table';
import { BeziqueCardGame } from '../../services/game';

@Component({
  templateUrl: 'game.html'
})
export class GamePage {
  // this tells the tabs component which Pages
  // should be each tab's root Page

  constructor (public beziqueCardGame : BeziqueCardGame, public navCtrl: NavController) {}

  public openPage(page : Component) {
    this.navCtrl.push(page);
  }

  deckPage : any  = DeckPage;
  playerPage: any = PlayerPage;
  tablePage: any = TablePage;

}
