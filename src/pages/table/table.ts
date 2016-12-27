import { Component } from '@angular/core';
import { BeziqueCardGame } from '../../card-services/game';

@Component({
  selector: 'page-table',
  templateUrl: 'table.html'
})
export class TablePage {

  constructor(public beziqueCardGame : BeziqueCardGame) {}
}
