import { Component, Input } from '@angular/core';

import { PlayingCard } from '../../services/deck';

@Component({
  selector: 'playing-card',
  templateUrl: 'playing-card.html'
})
export class PlayingCardComponent {

  @Input()
  public card : PlayingCard;

  @Input()
  public size : string = '100px';

  @Input()
  public showFace : boolean = false;

  constructor() {
  }

}
