import { Component } from '@angular/core';
import { BeziqueCardGame } from '../../services/game';
import { CardPlayer } from '../../services/player';

@Component({
  selector: 'page-table',
  templateUrl: 'table.html'
})
export class TablePage {

  constructor(public beziqueCardGame : BeziqueCardGame) {}

  public doDeal() {
    this.beziqueCardGame.deal();
  }

  public doStackAction() {
    if (!this.beziqueCardGame.dealt) {
      this.beziqueCardGame.deal();
    } else {
      this.beziqueCardGame.draw();
    }
  }

  public doDece() {
    this.beziqueCardGame.inTurn.dece();
  }

  public doPlay(player : CardPlayer) {
    if (player.canPlay() && this.beziqueCardGame.inTurn === player) {
      player.play();
    }
  }

  public doReset() {
    this.beziqueCardGame.reset();
  }
}
