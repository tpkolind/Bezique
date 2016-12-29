import { Component } from '@angular/core';
import { BeziqueCardGame } from '../../services/game';
import { CardPlayer } from '../../services/player';

@Component({
  selector: 'page-table',
  templateUrl: 'table.html'
})
export class TablePage {

  constructor(public beziqueCardGame : BeziqueCardGame) {}

  public doReset() {
    this.beziqueCardGame.reset();
  }
}
