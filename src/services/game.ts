import { Injectable } from '@angular/core'
import { Deck, PlayingCard, beziqueDeckConfiguration } from './deck';
import { CardPlayer, defaultPlayerConfiguration } from './player';

export const GAME_STATES = {
  INITIAL: 'INITIAL',
  DEAL: 'DEAL',
  PLAY: 'PLAY',
  EVALUATE: 'EVALUATE',
  DRAW: 'DRAW'
}

export const GAME_STATE_TRANSITIONS = {
  'INITIAL': 'DEAL',
  'DEAL': 'PLAY',
  'PLAY': 'EVALUATE',
  'EVALUATE': 'DRAW',
  'DRAW': 'PLAY'
}

/**
 * Abstract card game
 */
export class CardGame {
  /**
   * The deck that cards are drawn from
   */
  public deck: Deck;

  /**
   * True when players hands have been dealt
   */
  public dealt: Boolean = false;

  /**
   * Card facing up after the deal
   */
  public upcard: PlayingCard;

  /**
   * Stage of the card game
   */
  public state: string = GAME_STATES.DEAL;

  /**
   * Array of players participating in the game
   */
  public players: CardPlayer[] = [];

  /**
   * The order the players take turns in the next round
   */
  public playerOrder: CardPlayer[] = [];

  /**
   * The player who has the current turn
   */
  public inTurn: CardPlayer;

  /**
   * The winner of the last round
   */
  public roundWinner: CardPlayer;

  constructor() { 
    this.reset();
  }

  /**
   * Create a player in the game
   * @param {string} name - The name of the player
   */
  public createPlayer(name: string) {
    this.players.push(new CardPlayer(name, this, defaultPlayerConfiguration));
  }

  /**
   * Deal the cards to each player
   */
  public deal() {
    this.dealt = true;
    this.nextState();
    this.nextTurn();
  }

  /**
   * Reset the game back to the initial state
   */
  public reset() {
    this.dealt = false;
    this.players = [];
    this.playerOrder = [];
    this.upcard = undefined;
    this.inTurn = undefined;
    this.state = GAME_STATES.DEAL;
  }

  /**
   * Proceed to the next player. If there are no more players proceed to the next game stage
   */
  public nextTurn() {
    var nextPlayerIndex = this.playerOrder.indexOf(this.inTurn);
    if (nextPlayerIndex == -1) {
      this.inTurn = this.players[0];  // Need to modify to a random player
    } else if (nextPlayerIndex == this.playerOrder.length - 1) {
      this.nextState();
    } else {
      this.inTurn = this.playerOrder[nextPlayerIndex + 1];
    }
  }

  /**
   * Move to the next game stage. If we are evaluating, complete the round
   */
  public nextState() {
    this.state = GAME_STATE_TRANSITIONS[this.state];
    if (this.state === GAME_STATES.EVALUATE) {
      this.completeRound();
    }
  }

  /**
   * Determine the winner of the round. Give that player the played cards. Setup the order of play for the next round 
   * and move to the next stage
   */
  public completeRound() {
    this.determineWinner();
    this.collectPlayedCards();
    this.nextState();
    this.nextRound();
  }

  /**
   * Determine the winner of the round
   */
  public determineWinner() {
    this.roundWinner = this.players[0];
  }

  /**
   * Collect played cards and give to the winning player
   */
  public collectPlayedCards() {
    this.players.forEach((player) => {
      player.playedCards.stack.forEach((card) => {
        card.moveToStack(this.roundWinner.wonCards);
      })
    })
  }

  /**
   * In the play order draw a card for each player in the game
   */
  public draw() {
    this.playerOrder.forEach((player) => {
      player.draw();
    });
    this.nextState();
  }

  /**
   * Setup the play order for the next round
   */
  public nextRound() {
    this.playerOrder[0] = this.roundWinner;
    this.playerOrder[1] = this.players[1 - this.players.indexOf(this.roundWinner)];
    this.inTurn = this.playerOrder[0];
  }

}

/**
 * Bezique Card game
 * @extends CardGame
 */
@Injectable()
export class BeziqueCardGame extends CardGame {
  constructor() {
    super();
  }

  /**
   * Deal using bezique rules 3, 2, 3 and draw a face up card to determine trump
   */
  public deal() {
    this.players[0].draw(3);
    this.players[1].draw(3);
    this.players[0].draw(2);
    this.players[1].draw(2);
    this.players[0].draw(3);
    this.players[1].draw(3);

    this.upcard = this.deck.draw();
    super.deal();
    this.simulateRound(22);
  }

  /**
   * Reset the game
   */
  public reset() {
    super.reset();
    this.deck = new Deck(beziqueDeckConfiguration);
    this.createPlayer('Player One');
    this.createPlayer('Player Two');
    this.playerOrder[0] = this.players[0];  // Ask dad whether this.playerOrder = this.players is OK?
    this.playerOrder[1] = this.players[1];
  }

  /**
   * Determine a bezique round winner. A player wins if he played a higher rank with the same suit, 
   * a trump card when the other player didn't, or he played first and opponent did not match suit 
   */
  public determineWinner() {
    var winner : CardPlayer;
    var playerOneCard = this.playerOrder[0].playedCards.stack[0];
    var playerTwoCard = this.playerOrder[1].playedCards.stack[0];

    // If suits match
    if (playerOneCard.suit === playerTwoCard.suit) {

      // Winner is the one with the highest ranked card
      winner = (beziqueDeckConfiguration.ranks.indexOf(playerOneCard.rank) >= beziqueDeckConfiguration.ranks.indexOf(playerTwoCard.rank)) ?      
        this.playerOrder[0] : this.playerOrder[1];
    // Else if Player One has a trump suit
    } else if (playerOneCard.suit === this.upcard.suit) {
      // player 1 is the winner
      winner = this.playerOrder[0];
    // Else if player two has a trump suit
    } else if (playerTwoCard.suit === this.upcard.suit) {
      // player two is a winner
      winner = this.playerOrder[1];
    // Else player one is the winner
    } else {
      winner = this.playerOrder[0];
    }
    this.roundWinner = winner;
  }

  public simulateRound(numberOfRounds: number) {
    for (var roundIx = 0; roundIx < numberOfRounds; roundIx++) {
      this.playerOrder.forEach((player) => {
        player.hand.stack[0].moveToStack(player.selectedCards);
        player.play();
      });
      this.draw();
    }
  }
}