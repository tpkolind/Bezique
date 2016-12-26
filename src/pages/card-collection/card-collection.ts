import { Component, Input } from '@angular/core';
import { PlayingCard } from '../../card-services/deck';

@Component({
  selector: 'card-collection',
  template: `
    <ion-list>
        <ion-item *ngFor="let card of cards">
            {{ card.longName() }}
        </ion-item>
    </ion-list>
  `
})
export class CardCollection {

  @Input()
  public cards : PlayingCard[]
}