import { Component } from '@angular/core';
import { BeziqueCardGame } from '../../services/game';

@Component({
  selector: 'page-table',
  templateUrl: 'table.html'
})
export class TablePage {

  constructor(public beziqueCardGame : BeziqueCardGame) {}

  public doDeal() {
    this.beziqueCardGame.deal();
  }

  public doReset() {
    this.beziqueCardGame.reset();
  }
}
