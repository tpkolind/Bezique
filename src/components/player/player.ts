import { Component, Input } from '@angular/core';

import { CardPlayer } from '../../services/player';

@Component({
  selector: 'player',
  templateUrl: 'player.html'
})
export class PlayerComponent {

  @Input()
  public player : CardPlayer;
  
  public doDraw(player : CardPlayer) {
    player.game.draw();
  }

  public doPlay(player : CardPlayer) {
    player.play();
  }

  public doMeld(player : CardPlayer) {
    player.meld();
  }

  public doDece(player : CardPlayer) {
    player.dece();
  }

}
