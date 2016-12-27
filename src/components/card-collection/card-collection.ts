import { Component, Input } from '@angular/core';
import { PlayingCard, CardStack } from '../../card-services/deck';

@Component({
  selector: 'card-collection',
  template: `
    <ion-list>
        <ion-item *ngFor="let card of cardStack.stack">
            <ion-label>{{ card.longName() }}</ion-label>
            <ion-checkbox [ngModel]="card.selected" (ngModelChange)="doToggleSelect(card)"></ion-checkbox>
        </ion-item>
    </ion-list>
  `
})
export class CardCollection {

  @Input()
  public cardStack : CardStack;

  @Input()
  public selectedStack : CardStack;

  public doToggleSelect(card : PlayingCard) {
    card.selected = !card.selected;
    if (this.selectedStack) {
      if (card.selected) {
        this.selectedStack.add(card);
      } else {
        this.selectedStack.remove(card);
      }
    }
  }

}