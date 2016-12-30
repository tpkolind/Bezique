import { Injectable } from '@angular/core'
import { Deck, PlayingCard, beziqueDeckConfiguration, Suits } from './deck';
import { CardPlayer, defaultPlayerConfiguration } from './player';
import { Meld } from './Meld';

export const EVALUATION_DELAY = 1000;

export const GAME_STATES = {
  INITIAL: {
    name: 'INITIAL',
    canDeal: false,
    canDraw: false,
    canMeld: false,
    canPlay: false,
    multiselect: false,
    action: function(game) {}
  },
  DEAL: {
    name: 'DEAL',
    canDeal: true,
    canDraw: false,
    canMeld: false,
    canPlay: false,
    multiselect: false,
    action: function(game) {}
  },
  PLAY: {
    name: 'PLAY',
    canDeal: false,
    canDraw: false,
    canMeld: false,
    canPlay: true,
    multiselect: false,
    action: function(game) {}
  },
  PLAY_STAGE_2: {
    name: 'PLAY_STAGE_2',
    canDeal: false,
    canDraw: false,
    canMeld: false,
    canPlay: true,
    multiselect: false,
    action: function(game) {}
  },
  EVALUATE: {
    name: 'EVALUATE',
    canDeal: false,
    canDraw: false,
    canMeld: false,
    canPlay: false,
    multiselect: false,
    action: (game) => {
      setTimeout(() => {
        game.completeRound();
      }, EVALUATION_DELAY);
    }
  },
  EVALUATE_STAGE_2: {
    name: 'EVALUATE_STAGE_2',
    canDeal: false,
    canDraw: false,
    canMeld: false,
    canPlay: false,
    multiselect: false,
    action: (game) => {
      setTimeout(() => {
        game.completeRound();
      }, EVALUATION_DELAY);
    }
  },
  DRAW: {
    name: 'DRAW',
    canDeal: false,
    canDraw: true,
    canMeld: true,
    canPlay: false,
    multiselect: true,
    action: function(game) {}
  },
  DRAW_STAGE_2: {
    name: 'DRAW_STAGE_2',
    canDeal: false,
    canDraw: true,
    canMeld: false,
    canPlay: false,
    multiselect: false,
    action: function(game) {}
  }
}

export const GAME_STATE_TRANSITIONS = {
  'INITIAL': 'DEAL',
  'DEAL': 'PLAY',
  'PLAY': 'EVALUATE',
  'EVALUATE': (game) => {
    return game.deck.playingCards.stack.length <= 2 ? 'DRAW_STAGE_2' : 'DRAW'
  },
  'DRAW': 'PLAY',
  'DRAW_STAGE_2': 'PLAY_STAGE_2',
  'PLAY_STAGE_2': 'EVALUATE_STAGE_2',
  'EVALUATE_STAGE_2': (game : CardGame) => {
    return game.roundWinner.hand.isEmpty() ? 'DEAL' : 'PLAY_STAGE_2'
  }
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
   * Stage of the card game
   */
  public state = GAME_STATES.DEAL;

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

  constructor() {}

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
    var nextStateFunction = GAME_STATE_TRANSITIONS[this.state.name];
    var nextStateName = typeof nextStateFunction === 'string' ? nextStateFunction : nextStateFunction(this);
    this.state = GAME_STATES[nextStateName];
    this.state.action(this);
  }

  /**
   * Determine the winner of the round. Give that player the played cards. Setup the order of play for the next round 
   * and move to the next stage
   */
  public completeRound() {
    this.determineRoundWinner();
    this.collectPlayedCards();
    this.determinePlayOrder();
    this.nextState();
  }

  /**
   * Determine the winner of the round
   */
  public determineRoundWinner() {
    var playerOneCard = this.playerOrder[0].playedCards.stack[0];
    var playerTwoCard = this.playerOrder[1].playedCards.stack[0];

    this.roundWinner = this.deck.compareCards(playerOneCard, playerTwoCard) === -1 ? this.playerOrder[0] : this.playerOrder[1];
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

  public inTurnCanDraw() {
    return this.inTurn ? this.inTurn.canDraw() : false;
  }

  public inTurnCanDece() {
    return this.inTurn ? this.inTurn.canDece() : false;
  }

  public inTurnCanPlay() {
    return this.inTurn ? this.inTurn.canPlay() : false;
  }

  /**
   * In the play order draw a card for each player in the game
   */
  public draw() {
    this.playerOrder.forEach((player) => {
      player.draw();
      player.orderHand();
    });
    this.nextState();
  }

  /**
   * Setup the play order for the next round
   */
  public determinePlayOrder() {
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

    this.deck.drawUpCard();
    this.players[0].orderHand();
    this.players[1].orderHand();
    super.deal();
    // this.simulateRound(22);
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