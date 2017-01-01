import { PlayingCard } from './playing-card'

export const defaultDeckConfiguration = {
	decks: 1,
	jokers: 2,
	ranks: [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A' ],
	suits: [ 'S', 'D', 'C', 'H' ],
	trump: false
}

export const beziqueDeckConfiguration = {
	decks: 2,
	jokers: 0,
	ranks: [ '7', '8', '9', 'J', 'Q', 'K', '10', 'A' ],
	suits: [ 'S', 'D', 'C', 'H' ],
	trump: true
}

/**
 * Card stack class - used for decks, hands, melds, winning discarded cards, etc
 */
export class CardStack {

  /** The cards in the stack */
	public stack : PlayingCard[] = [];

	constructor (private owningStack : Boolean = true) {
	}

  /** Add a card to the stack
   * @param playingCard - the card to ad to the stack
   * @param changeOwner - change the owner of the stack (default true)
   */
	public add(playingCard : PlayingCard) {
		if (playingCard) {
			this.stack.push(playingCard);
			if (this.owningStack) {
				playingCard.owningStack = this;
			}
		}
	}

  /**
   * Remove the card from the stack
   * @param playingCard - The card to remove
   * @param changeOwner - If true change the owner of the card
   * @return PlayingCard - the card that was removed. If the card is not in the stack this returns undefined
   */
	public remove(playingCard : PlayingCard) {
		var selectedCardIndex = this.stack.indexOf(playingCard);
		if (selectedCardIndex > -1) {
			this.stack.splice(selectedCardIndex, 1);
			if (this.owningStack) {
				playingCard.owningStack = undefined;
			}
			return playingCard;
		} else {
			return undefined;
		}
	}

  /**
   * Draw a card from the stack
   * @return the card drawn (if one was available)
   */
	public draw() {
		var drawnCard = this.stack.shift();
		if (drawnCard) {
			drawnCard.owningStack = undefined;
		}
		return drawnCard;
	}

  /**
   * Swap cards in the stack (used for shuffling)
   */
	public swapCards(oldPosition, newPosition) {
		var oldCard = this.stack[oldPosition];
		this.stack[oldPosition] = this.stack[newPosition];
		this.stack[newPosition] = oldCard;
	}

  /**
   * Empty the stack
   */
	public clear() {
		this.stack = [];
	}

  /**
   * Returns true if the stack is empty
   */
	public isEmpty() {
		return (this.stack.length == 0);
	}

  /**
   * Returns a comma delimited string representation of the stack (eg "AC, KD")
   */
	public toString() {
		return this.stack.join(', ');
	}

}

/**
 * A deck of cards
 */
export class Deck {

  /** The playing cards in the deck */
	public playingCards: CardStack = new CardStack();

	public upcard : PlayingCard;
	public trumpSuit : string;

  /** Create the deck
   * @param config - the configuration to use for the deck
   */
	constructor (private config) {
		this.resetDeck();
		this.shuffle();
	}

  /** Create the deck according to the configuration */
	public resetDeck() {
		this.playingCards = new CardStack();
		// For each deck
		for (var deck = 0; deck < this.config.decks; deck++) {
			// For each rank
			for (var rank in this.config.ranks) {
				// For each suit
				for (var suit in this.config.suits) {
					// Create a playing card and put it in the deck
					this.playingCards.add(new PlayingCard(this.config.ranks[rank], this.config.suits[suit]));
				}
			}

			// For each joker
			for (var joker = 0; joker < this.config.jokers; joker++) {
				this.playingCards.add(new PlayingCard('N', undefined));
			}
		}
	}

  /**
   * Compare two cards for ordering according to the deck configuration
   */
  public compareCards(cardA : PlayingCard, cardB : PlayingCard, useSuitOrder : Boolean = false) : number {
    // If suits match
    if (cardA.suit === cardB.suit) {
      // Winner is the one with the highest ranked card
			return this.comparePip(cardA, cardB);
    // Else if Player One has a trump suit
    } else if (cardA.suit === this.trumpSuit) {
      // player 1 is the winner
      return -1;
    // Else if player two has a trump suit
    } else if (cardB.suit === this.trumpSuit) {
      // player two is a winner
      return 1;
    // Else player one is the winner
    } else {
      return useSuitOrder ? this.compareSuit(cardA, cardB) : -1;
    }
  }

	private comparePip(cardA, cardB) : number {
		return this.config.ranks.indexOf(cardA.rank) === this.config.ranks.indexOf(cardB.rank) ?
			0 :
			this.config.ranks.indexOf(cardA.rank) > this.config.ranks.indexOf(cardB.rank) ?
				-1 : 1;		
	}

	private compareSuit(cardA, cardB) : number {
		return this.config.suits.indexOf(cardA.suit) === this.config.suits.indexOf(cardB.suit) ?
			0 : 
			this.config.suits.indexOf(cardA.suit) > this.config.suits.indexOf(cardB.suit) ?
				-1 : 1;
	}
	
  public validDece() : PlayingCard {
		return new PlayingCard(this.config.ranks[0], this.trumpSuit);
  }	

  /** Shuffle the deck */
	public shuffle(numberOfTimes = 5) {
		var randomPosition = 0;
		for (var shuffleRound = 0; shuffleRound < numberOfTimes; shuffleRound++) {
			for (var cardNumber = 0; cardNumber < this.playingCards.stack.length; cardNumber++) {
				randomPosition = Math.floor(Math.random() * this.playingCards.stack.length);
				this.playingCards.swapCards(cardNumber, randomPosition)
				
			}
		}
	}

  /** Draw a card from the deck */
	public draw() : PlayingCard {
		return this.playingCards.draw();
	}

	/** Draw an upcard from the deck */
	public drawUpCard() {
		this.upcard = this.draw();
		if (this.config.trump) {
			this.trumpSuit = this.upcard.suit;
		}
		this.playingCards.add(this.upcard);
	}

	public swapUpCard(card : PlayingCard) {
		var currentUpCard = this.upcard;
		this.upcard.moveToStack(card.owningStack);
		card.moveToStack(this.playingCards);
		this.upcard = card;
		return currentUpCard;
	}
}