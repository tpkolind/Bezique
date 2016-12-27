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
    player.draw(1);
  }

  public doPlay(player : CardPlayer) {
    player.play();
  }

}
