import { Injectable } from '@angular/core'
import { Deck, PlayingCard, beziqueDeckConfiguration } from './deck';
import { CardPlayer } from './player';

export class CardGame {
    public deck : Deck;
    public player : CardPlayer[] = [];
    public dealt : Boolean = false;
    public visibleCard : PlayingCard;

    constructor () { }

    public createPlayer(name : string) {
        this.player.push(new CardPlayer(name, this));
    }

    public deal() { }

    public reset() { 
        this.dealt = false;
        this.player = [];
        this.visibleCard = undefined;
    }
}

@Injectable()
export class BeziqueCardGame extends CardGame {
    constructor () {
        super();
        this.reset();
    }

    public deal()  {
        this.player[0].draw(3);
        this.player[1].draw(3);
        this.player[0].draw(2);
        this.player[1].draw(2);
        this.player[0].draw(3);
        this.player[1].draw(3);

        this.visibleCard = this.deck.draw();

        this.dealt = true;
    }

    public reset() {
        super.reset();
        this.deck = new Deck(beziqueDeckConfiguration);
        this.createPlayer('Player One');
        this.createPlayer('Player Two');
    }
}