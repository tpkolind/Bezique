import { Injectable } from '@angular/core'
import { Deck, PlayingCard, beziqueDeckConfiguration } from './deck';
import { CardPlayer, defaultPlayerConfiguration } from './player';

export class CardGame {
    public deck : Deck;
    public dealt : Boolean = false;
    public upcard : PlayingCard;

    public players : CardPlayer[] = [];
    public playerOrder: CardPlayer[] = [];
    public inTurn: CardPlayer;

    constructor () { }

    public createPlayer(name : string) {
        this.players.push(new CardPlayer(name, this, defaultPlayerConfiguration));
    }

    public deal() { }

    public reset() { 
        this.dealt = false;
        this.players = [];
        this.playerOrder = [];
        this.upcard = undefined;
    }

    public nextTurn() {
        var nextPlayerIndex = this.playerOrder.indexOf(this.inTurn);
        if (nextPlayerIndex == -1) {
            this.inTurn = this.players[0];  // Need to modify to random
        } else if (nextPlayerIndex == this.playerOrder.length) {
            this.completeRound();
        } else {
            this.inTurn = this.playerOrder[nextPlayerIndex++]; 
        }
    }

    public completeRound() {
        this.determineWinner();
        this.nextRound();
    }

    public determineWinner() {
        return this.players[0];
    }

    public nextRound() {
        this.reset();
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
        this.playerOrder[0] = this.players[0];  // Ask dad whether this.playerOrder = this.players is OK?
        this.playerOrder[1] = this.players[1];
    }

    /* A player wins if he played a higher rank with the same suit, a trump card when the other player didn't, 
    or he played first and opponent can't match suit */
    public determineWinner() {
        var winner;
        var player1 = this.playerOrder[0].playedCards.stack[0];
        var player2 = this.playerOrder[1].playedCards.stack[0];
        // Check if suits match or if only one suit is trump
        if (player1.suit === player2.suit) {
            if (beziqueDeckConfiguration.ranks.indexOf(player1.rank) > beziqueDeckConfiguration.ranks.indexOf(player2.rank)) {
                winner = this.playerOrder[0];
            } else {
                winner = this.playerOrder[1];
            }
        } else if (player1.suit === this.upcard.suit) {
            winner = this.playerOrder[0];
        } else if (player2.suit === this.upcard.suit) {
            winner = this.playerOrder[1];
        } else {
            winner = this.playerOrder[0];
        }
        return winner;
    }
}