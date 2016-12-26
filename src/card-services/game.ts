import { Injectable } from '@angular/core'
import { Deck, PlayingCard, beziqueDeckConfiguration } from './deck';

export class CardPlayer {
    public hand : PlayingCard[] = [];
    
    constructor (public name : string) {

    }
}

export class CardGame {
    public deck : Deck;
    public player : CardPlayer[] = [];

    constructor () { }

    public createPlayer(name : string) {
        this.player.push(new CardPlayer(name));
    }
}

@Injectable()
export class BeziqueCardGame extends CardGame {
    constructor () {
        super();
        this.deck = new Deck(beziqueDeckConfiguration);

        this.createPlayer('Player One');
        this.createPlayer('Player Two');
    }
}