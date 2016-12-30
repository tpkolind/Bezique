
import { CardStack, PlayingCard } from './deck';
import { CardGame } from './game';

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
		this.availableMelds = [];
		this.calculateMelds();
		return (this.availableMelds.length > 0) && this.game.state.canMeld && this.inTurn();
		/*
		return this.game.inTurn === this && 
			this.selectedCards.stack.length >= this.playerConfig.minMeldableCards &&
			this.selectedCards.stack.length <= this.playerConfig.maxMeldableCards &&
			this.game.state.canMeld;
			*/
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
		var bezique : CardStack = new CardStack(false);
		var doubleBezique : CardStack = new CardStack(false);
		var commonMarraige : CardStack = new CardStack(false);
		var royalMarraige : CardStack = new CardStack(false);
		var aces : CardStack = new CardStack(false);
		var kings : CardStack = new CardStack(false);
		var queens : CardStack = new CardStack(false);
		var jacks : CardStack = new CardStack(false);
		var flush : CardStack = new CardStack(false);
		this.hand.stack.forEach((card) => {
			switch(card.rank) {
				// Ace cases (4As, Flush)
				case 'A':
					aces.add(card);
					if (card.suit === this.game.deck.trumpSuit) {
						flush.add(card);				
					}
					break;
				// 10 cases (Flush)
				case '10':
					if (card.suit === this.game.deck.trumpSuit) {
						flush.add(card);
					}
					break;
				// King cases (4Ks, RM, CM, Flush)
				case 'K':
					kings.add(card);
					if (card.suit === this.game.deck.trumpSuit) {
						royalMarraige.add(card);
						flush.add(card);
					}
					commonMarraige.add(card);	
					break;
				// Queen cases (4Qs, RM, CM, Flush, Bz, DBz)
				case 'Q':
					queens.add(card);
					if (card.suit === this.game.deck.trumpSuit) {
						royalMarraige.add(card);
						flush.add(card);
					} 
					commonMarraige.add(card);
					if (card.suit === "S") {
						bezique.add(card);
						doubleBezique.add(card);
					}
					break;
				// Jack cases (4Js, Flush, Bz, DBz)
				case 'J':
					jacks.add(card);
					if (card.suit === this.game.deck.trumpSuit) {
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
		// Push available melds onto the array
		if (this.checkMeld('b', bezique)) { this.availableMelds.push(bezique); }
		if (this.checkMeld('db', doubleBezique)) { this.availableMelds.push(doubleBezique); }
		if (this.checkMeld('cm', commonMarraige)) { this.availableMelds.push(commonMarraige); }
		if (this.checkMeld('rm', royalMarraige)) { this.availableMelds.push(royalMarraige); }
		if (this.checkMeld('a', aces)) { this.availableMelds.push(aces); }
		if (this.checkMeld('k', kings)) { this.availableMelds.push(kings); }
		if (this.checkMeld('q', queens)) { this.availableMelds.push(queens); }
		if (this.checkMeld('j', jacks)) { this.availableMelds.push(jacks); }
		if (this.checkMeld('f', flush)) { this.availableMelds.push(flush); }
	}

	/** Check functions for each of the melds. Organizational purposes (may reconfigure) */
	private checkMeld(type : string, possibleMeld : CardStack) {
		var hasMeld = false;
		//var tempSuit = possibleMeld.stack[0].suit;
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
				if (type === 'b') { hasMeld = (numJacks == 1 && numQueens == 1); }
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