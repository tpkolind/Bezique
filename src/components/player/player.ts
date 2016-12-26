import { Component, Input } from '@angular/core';

import { CardPlayer } from '../../card-services/game';

@Component({
  selector: 'player',
  templateUrl: 'player.html'
})
export class PlayerComponent {

  @Input()
  public player : CardPlayer;
  
}
