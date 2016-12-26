import { Injectable } from '@angular/core'
import { Deck, PlayingCard, beziqueDeckConfiguration } from './deck';

export class CardPlayer {
    public hand : PlayingCard[] = [];
    
    constructor (public name : string) {

    }

    public draw(numberOfCards : Number, deck : Deck) {
        for (var cardNumber = 0; cardNumber < numberOfCards; cardNumber++) {
            this.hand.push(deck.draw());
        }
    }
}

export class CardGame {
    public deck : Deck;
    public player : CardPlayer[] = [];

    constructor () { }

    public createPlayer(name : string) {
        this.player.push(new CardPlayer(name));
    }

    public deal() { }
}

@Injectable()
export class BeziqueCardGame extends CardGame {
    constructor () {
        super();
        this.deck = new Deck(beziqueDeckConfiguration);

        this.createPlayer('Player One');
        this.createPlayer('Player Two');
    }

    public deal()  {
        this.player[0].draw(3, this.deck);
        this.player[1].draw(3, this.deck);
        this.player[0].draw(2, this.deck);
        this.player[1].draw(2, this.deck);
        this.player[0].draw(3, this.deck);
        this.player[1].draw(3, this.deck);
    }
}