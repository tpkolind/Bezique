import { Component, Input } from '@angular/core';
import { PlayingCard } from '../../services/playing-card'
import { CardStack } from '../../services/deck';

/*
  Generated class for the Cards component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'cards',
  templateUrl: 'cards.html'
})
export class CardsComponent {

  @Input()
  public cardStack : CardStack;

  @Input()
  public selectedStack : CardStack;

  @Input()
  public multiSelect : boolean;

  @Input()
  public size : string = '75px';

  public doToggleSelect(card : PlayingCard) {
    card.toggleSelect(this.selectedStack, this.multiSelect);
  }
}
