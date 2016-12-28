
import { CardStack, PlayingCard } from './deck';
import { CardGame, GAME_STATES } from './game';

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
	public availableMelds: CardStack[] = [];

  /** The cards that have been selected for a meld or to play (not visible) */
	public selectedCards: CardStack = new CardStack();

	constructor (public name : string, public game: CardGame, private playerConfig) {
	}

  /** Returns true if it is legal to draw on the next turn */
	public canDraw() {
		return this.hand.stack.length + this.melds.stack.length < this.playerConfig.maxHandLength &&
			this.game.dealt && 
			this.game.deck.playingCards.stack.length > 0;
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
		//this.calculateMelds();
		//return 0; 
		return this.game.inTurn === this && 
			this.selectedCards.stack.length >= this.playerConfig.minMeldableCards &&
			this.selectedCards.stack.length <= this.playerConfig.maxMeldableCards &&
			this.game.state === GAME_STATES.DRAW;
	}

  /** Meld the selected cards */
	public meld() {
		this.selectedCards.stack.forEach((card) => {
			card.selected = false;
			card.moveToStack(this.melds);
		});
		this.selectedCards.clear();        
	}

	public canDece() {
		return this.selectedCards.stack.length === 1 &&
			!this.game.deck.playingCards.isEmpty() &&
			this.selectedCards.stack[0].toString() === this.game.validDece().toString();
	}

	public dece() {
		this.game.deck.swapUpCard(this.selectedCards.stack[0]);
		this.selectedCards.clear();
	}
	
	/** Calculate the melds available in the player's current hand */
	public calculateMelds() {
		var bezique : CardStack = new CardStack();
		var doubleBezique : CardStack = new CardStack();
		var commonMarraige : CardStack = new CardStack();
		var royalMarraige : CardStack = new CardStack();
		var aces : CardStack = new CardStack();
		var kings : CardStack = new CardStack();
		var queens : CardStack = new CardStack();
		var jacks : CardStack = new CardStack();
		var flush : CardStack = new CardStack();
		this.hand.stack.forEach((card) => {
			switch(card.rank) {
				// Ace cases (4As, Flush)
				case 'A':
					bezique.add(card);
					if (card.suit === this.game.trumpSuit) {
						flush.add(card);				
					}
					break;
				// 10 cases (Flush)
				case '10':
					if (card.suit === this.game.trumpSuit) {
						flush.add(card);
					}
					break;
				// King cases (4Ks, RM, CM, Flush)
				case 'K':
					kings.add(card);
					if (card.suit === this.game.trumpSuit) {
						royalMarraige.add(card);
						flush.add(card);
					} else {
						commonMarraige.add(card);
					}		
					break;
				// Queen cases (4Qs, RM, CM, Flush, Bz, DBz)
				case 'Q':
					queens.add(card);
					if (card.suit === this.game.trumpSuit) {
						royalMarraige.add(card);
						flush.add(card);
					} else {
						commonMarraige.add(card);
					}	
					if (card.suit === "S") {
						bezique.add(card);
						doubleBezique.add(card);
					}
					break;
				// Jack cases (4Js, Flush, Bz, DBz)
				case 'J':
					jacks.add(card);
					if (card.suit === this.game.trumpSuit) {
						flush.add(card);
					}
					if (card.suit === "D") {
						bezique.add(card);
						doubleBezique.add(card);
					}
					break;
				default:
					break;
			}
		});
	}

	/** Check functions for each of the melds. Organizational purposes (may reconfigure) */
	private checkMeld(type : string, possibleMeld : CardStack) {
		var hasMeld = false;
		var tempSuit = possibleMeld.stack[0].suit;
		switch(type) {
			case 'b':
			case 'db':
				var numJacks = 0;
				var numQueens = 0;
				for (var i=0; i < possibleMeld.stack.length; i++) {
					if (possibleMeld.stack[i].rank === "J") {	numJacks++; }
					else if (possibleMeld.stack[i].rank === "Q") { numQueens++; }
				}
				if (type === 'b') { hasMeld = (numJacks == 1 && numQueens == 1 ? true : false); }
				else { hasMeld = (numJacks == 2 && numQueens == 2 ? true : false); }
				break;
			case 'cm':
				break;
			case 'rm':
				break;
			case 'a':
			case 'k':
			case 'q':
			case 'j':
				hasMeld = (possibleMeld.stack.length > 4);
				break;
			case 'f':
				break;
		}
		return hasMeld
	}
  /** Select / unselect a playing card */
	public toggleSelect(playingCard : PlayingCard) {
		if (playingCard.selected) {
			this.selectedCards.remove(playingCard, false);
		} else {
			this.selectedCards.add(playingCard, false);
		}
	}

}