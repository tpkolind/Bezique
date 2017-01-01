
import { PlayingCard } from './playing-card';
import { CardStack } from './deck';
import { CardGame } from './game';
import { Meld } from './meld';

export const defaultPlayerConfiguration = {
	minHandLength : 0,
	maxHandLength : 8,
	minPlayableCards: 1,
	maxPlayableCards: 1,
	minMeldableCards: 2,
	maxMeldableCards: 8
}

/**
 * A card player
 */
export class CardPlayer {
  /** The cards in the hand (not visible) */
	public hand : CardStack = new CardStack();

  /** The cards played in this round (visible) */
	public playedCards : CardStack = new CardStack();

  /** The melds that have been played (visible) */
	public melds: CardStack = new CardStack();

  /** The cards previously won */
	public wonCards: CardStack = new CardStack();

  /** The cards that can be used in melds */
	public availableMelds: Meld[] = [];

  /** The cards that have been selected for a meld or to play (not visible) */
	public selectedCards: CardStack = new CardStack(false);

	constructor (public name : string, public game: CardGame, private playerConfig) {
	}

  /** Returns true if it is legal to draw on the next turn */
	public canDraw() {
		return this.hand.stack.length + this.melds.stack.length < this.playerConfig.maxHandLength &&
			this.game.dealt && 
			this.game.deck.playingCards.stack.length > 0 &&
			this.game.state.canDraw;
	}

  /** Draw cards from the game deck */
	public draw(numberOfCards : Number = 1) {
		for (var cardNumber = 0; cardNumber < numberOfCards; cardNumber++) {
			this.hand.add(this.game.deck.draw());
		}
	}

  /** Returns true if it is legal to play selected cards on the next turn */
	public canPlay() {
		return this.selectedCards.stack.length >= this.playerConfig.minPlayableCards &&
			this.selectedCards.stack.length <= this.playerConfig.maxPlayableCards &&
			this.game.inTurn === this && !this.canDraw();
	}

  /** Play the cards */
	public play() {
		this.selectedCards.stack.forEach((card) => {
			card.selected = false;
			card.moveToStack(this.playedCards);
		});
		this.selectedCards.clear();
		this.game.nextTurn()
	}

  /** Returns true if it is legal to meld selected cards on the next turn */
	public canMeld() {
		if (this.game.state.canMeld) {
			this.availableMelds = [];
			this.calculateMelds();
			return (this.availableMelds.length > 0) && this.inTurn()
		} else {
			return false;
		}
	}

  /** Meld the selected cards */
	public meld() {
		this.selectedCards.stack.forEach((card) => {
			card.selected = false;
			card.moveToStack(this.melds);
		});
		this.selectedCards.clear();        
	}

	/** Returns true if you can dece the selected card */
	public canDece() {
		return this.selectedCards.stack.length === 1 &&
			!this.game.deck.playingCards.isEmpty() &&
			this.selectedCards.stack[0].toString() === this.game.deck.validDece().toString();
	}

	/** Dece the selected card */
	public dece() {
		this.game.deck.swapUpCard(this.selectedCards.stack[0]);
		this.selectedCards.stack[0].selected = false;
		this.selectedCards.clear();
		this.orderHand();
	}

	public inTurn() {
		return this === this.game.inTurn;
	}

	/** Sort the hand according to the deck configuration */
	public orderHand() {
		this.hand.stack.sort((cardA, cardB) => {
			return this.game.deck.compareCards(cardA, cardB, true);
		});
	}
	
	/** Calculate the melds available in the player's current hand */
	public calculateMelds() {
		// CardStack to hold the 8 possible melds 
		var stacks : CardStack[] = [];
		for (var i = 0; i <= 8; i++) {
			stacks[i] = new CardStack();
		}
		var map = {'b':0, 'db':1, 'cm':2, 'rm':3, 'a':4, 'k':5, 'q':6, 'j':7, 'f':8};
		this.hand.stack.forEach((card) => {
			switch(card.rank) {
				// Ace cases (4As, Flush)
				case 'A':
					stacks[map.a].add(card);
					if (card.suit === this.game.deck.trumpSuit) {
						stacks[map.f].add(card);				
					}
					break;
				// 10 cases (Flush)
				case '10':
					if (card.suit === this.game.deck.trumpSuit) {
						stacks[map.f].add(card);
					}
					break;
				// King cases (4Ks, RM, CM, Flush)
				case 'K':
					stacks[map.k].add(card);
					if (card.suit === this.game.deck.trumpSuit) {
						stacks[map.rm].add(card);
						stacks[map.f].add(card);
					}
					stacks[map.cm].add(card);	
					break;
				// Queen cases (4Qs, RM, CM, Flush, Bz, DBz)
				case 'Q':
					stacks[map.q].add(card);
					if (card.suit === this.game.deck.trumpSuit) {
						stacks[map.rm].add(card);
						stacks[map.f].add(card);
					} 
					stacks[map.cm].add(card);
					if (card.suit === "S") {
						stacks[map.b].add(card);
						stacks[map.db].add(card);
					}
					break;
				// Jack cases (4Js, Flush, Bz, DBz)
				case 'J':
					stacks[map.j].add(card);
					if (card.suit === this.game.deck.trumpSuit) {
						stacks[map.f].add(card);
					}
					if (card.suit === "D") {
						stacks[map.b].add(card);
						stacks[map.db].add(card);
					}
					break;
				default:
					break;
			}
		});
		// Loop through each stack adding all cards to the meld if available
		var types : string[] = ['b', 'db', 'cm', 'rm', 'a', 'k', 'q', 'j', 'f'];
		types.forEach(function(type) {
			if ( this.checkMeld(type, stacks[type]) ) {
				this.availableMelds.push(new Meld(type, stacks[type]));
			}
		});
	}

	/** Check functions for each of the melds. Organizational purposes (may reconfigure) */
	private checkMeld(type : string, possibleMeld : CardStack) {
		var hasMeld = false;
		switch(type) {
			case 'b':
				if (possibleMeld.stack.length < 2) {
					return false;
				}
			case 'db':
				if (type === 'db') { 
					if (possibleMeld.stack.length < 4) {
						return false;
					} 
				}
				var numJacks = 0, numQueens = 0;
				for (var i=0; i < possibleMeld.stack.length; i++) {
					if (possibleMeld.stack[i].rank === "J") {	numJacks++; }
					else if (possibleMeld.stack[i].rank === "Q") { numQueens++; }
				}
				if (type === 'b') { hasMeld = (numJacks >= 1 && numQueens >= 1); }
				else { hasMeld = (numJacks == 2 && numQueens == 2); }
				break;
			case 'cm':
				var numQueens = 0, numKings = 0;
				for (var i=0; i < possibleMeld.stack.length; i++) {
					if (possibleMeld.stack[i].rank === "Q") {	numQueens++; }
					else if (possibleMeld.stack[i].rank === "K") { numKings++; }
				}
				hasMeld = (numQueens >= 1 && numKings >= 1);
				break;
			case 'rm':
				var numQueens = 0, numKings = 0;
				for (var i=0; i < possibleMeld.stack.length; i++) {
					if (possibleMeld.stack[i].rank === "Q") {	numQueens++; }
					else if (possibleMeld.stack[i].rank === "K") { numKings++; }
				}
				hasMeld = (numQueens >= 1 && numKings >= 1);
				break;
			case 'a':
			case 'k':
			case 'q':
			case 'j':
				hasMeld = (possibleMeld.stack.length >= 4);
				break;
			case 'f':
				var ace = false, ten = false, king = false, queen = false, jack = false;
				if (possibleMeld.stack.length < 5) {
					return false;
				}
				for (var i=0; i < possibleMeld.stack.length; i++) {
					if (possibleMeld.stack[i].rank === "J") {	jack = true; }
					else if (possibleMeld.stack[i].rank === "Q") { queen = true }
					else if (possibleMeld.stack[i].rank === "K") { king = true }
					else if (possibleMeld.stack[i].rank === "10") { ten = true }
					else if (possibleMeld.stack[i].rank === "A") { ace = true }
				}
				hasMeld = (ace && ten && king && queen && jack)
				break;
		}
		return hasMeld
	}

  /** Select / unselect a playing card */
	public toggleSelect(playingCard : PlayingCard) {
		if (playingCard.selected) {
			this.selectedCards.remove(playingCard);
		} else {
			this.selectedCards.add(playingCard);
		}
	}

}