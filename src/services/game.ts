import { Injectable } from '@angular/core'
import { Deck, PlayingCard, beziqueDeckConfiguration } from './deck';
import { CardPlayer } from './player';

export class CardGame {
    public deck : Deck;
    public dealt : Boolean = false;
    public upcard : PlayingCard;

    public players : CardPlayer[] = [];
    public inTurn: CardPlayer;

    constructor () { }

    public createPlayer(name : string) {
        this.players.push(new CardPlayer(name, this));
    }

    public deal() { }

    public reset() { 
        this.dealt = false;
        this.players = [];
        this.upcard = undefined;
    }

    public nextTurn() {
        var nextTurnIndex = this.players.indexOf(this.inTurn);
        nextTurnIndex++;
        nextTurnIndex = nextTurnIndex === this.players.length ? 0 : nextTurnIndex;
        this.inTurn = this.players[nextTurnIndex];
    }

}

@Injectable()
export class BeziqueCardGame extends CardGame {
    constructor () {
        super();
        this.reset();
    }

    public deal()  {
        this.players[0].draw(3);
        this.players[1].draw(3);
        this.players[0].draw(2);
        this.players[1].draw(2);
        this.players[0].draw(3);
        this.players[1].draw(3);

        this.upcard = this.deck.draw();
        this.dealt = true;
        this.nextTurn();
    }

    public reset() {
        super.reset();
        this.deck = new Deck(beziqueDeckConfiguration);
        this.createPlayer('Player One');
        this.createPlayer('Player Two');
    }
}