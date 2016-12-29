import { Component } from '@angular/core';

import { BeziqueCardGame } from '../../services/game';
import { CardPlayer } from '../../services/player'

@Component({
  selector: 'playing-table',
  templateUrl: 'playing-table.html'
})
export class PlayingTableComponent {

  constructor(public beziqueCardGame : BeziqueCardGame) {
  }

  public doDeal() {
    this.beziqueCardGame.deal();
  }

  public doStackAction() {
    if (!this.beziqueCardGame.dealt) {
      this.beziqueCardGame.deal();
    } else {
      if (this.beziqueCardGame.inTurnCanDraw()) {
        this.beziqueCardGame.draw();
      }
    }
  }

  public doDece() {
    if (this.beziqueCardGame.inTurnCanDece()) {
      this.beziqueCardGame.inTurn.dece();
    }
  }

  public doPlay(player : CardPlayer) {
    if (player.canPlay() && player.inTurn()) {
      player.play();
    }
  }

  public doMeld(player : CardPlayer) {
    if (player.canMeld() && player.inTurn()) {
      player.meld();
    }
  }
}