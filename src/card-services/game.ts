import { Deck, PlayingCard, beziqueDeckConfiguration } from './deck';

class CardPlayer {
    public hand : PlayingCard[] = [];
    
    constructor (public name) {

    }
}

export class CardGame {
    public deck : Deck;
    public player : CardPlayer[] = [];

    constructor () { }

    public createPlayer(name) {
        this.player.push(new CardPlayer(name));
    }
}

export class BeziqueCardGame extends CardGame {
    constructor (playerOneName : string, playerTwoName : string) {
        super();
        this.deck = new Deck(beziqueDeckConfiguration);

        this.createPlayer(playerOneName);
        this.createPlayer(playerTwoName);
    }
}