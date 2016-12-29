import { Component } from '@angular/core';
import { BeziqueCardGame } from '../../services/game';
import { CardPlayer } from '../../services/player';

import { FabContainer } from 'ionic-angular'

@Component({
  selector: 'page-table',
  templateUrl: 'table.html'
})
export class TablePage {

  constructor(public beziqueCardGame : BeziqueCardGame) {}

  public doReset(fab : FabContainer) {
    fab.close();
    this.beziqueCardGame.reset();
  }
}
