import { Component, Input } from '@angular/core';
import { PlayingCard, CardStack } from '../../services/deck';

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

  public doToggleSelect(card : PlayingCard) {
    card.selected = !card.selected;
    if (this.selectedStack) {
      if (card.selected) {
        this.selectedStack.add(card, false);
      } else {
        this.selectedStack.remove(card, false);
      }
    }
  }
}
