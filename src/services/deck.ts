export const Ranks = {
	'2': 'Two',
	'3': 'Three',
	'4': 'Four',
	'5': 'Five',
	'6': 'Six',
	'7': 'Seven',
	'8': 'Eight',
	'9': 'Nine',
	'10': 'Ten',
	'J': 'Jack',
	'Q': 'Queen',
	'K': 'King',
	'A': 'Ace',
	'N': 'Joker'
}

export const Suits = {
	'S': 'Spades',
	'D': 'Diamonds',
	'C': 'Clubs',
	'H': 'Hearts'  
}

export const defaultDeckConfiguration = {
	decks: 1,
	jokers: 2,
	ranks: [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A' ],
	suits: [ 'S', 'D', 'C', 'H' ]
}

export const beziqueDeckConfiguration = {
	decks: 2,
	jokers: 0,
	ranks: [ '7', '8', '9', 'J', 'Q', 'K', '10', 'A' ],
	suits: [ 'S', 'D', 'C', 'H' ]
}

/**
 * Playing card class
 */
export class PlayingCard {
  /** Stack that owns this card */
	public owningStack : CardStack;

  /** Selected card */
	public selected : boolean = false;

	constructor (public rank : string, public suit : string) {
	}

	public moveToStack(newStack) {
		if (this.owningStack) {
			this.owningStack.remove(this);
		}
		newStack.add(this);
	}

  /** Short string (eg 8C) representation of the card */
	public shortName() {
		return this.rank + this.suit;
	}

  /** Long string (eg Eight of Clubs) representation of the card */
	public longName() {
		return Ranks[this.rank] + ' of ' + Suits[this.suit];
	}

  /** Default (short name) string representation */
	public toString() {
		return this.shortName();
	}
}

/**
 * Card stack class - used for decks, hands, melds, winning discarded cards, etc
 */
export class CardStack {

  /** The cards in the stack */
	public stack : PlayingCard[] = [];

  /** Add a card to the stack
   * @param playingCard - the card to ad to the stack
   * @param changeOwner - change the owner of the stack (default true)
   */
	public add(playingCard : PlayingCard, changeOwner : Boolean = true) {
		if (playingCard) {
			this.stack.push(playingCard);
			if (changeOwner) {
				playingCard.owningStack = this;
			}
		}
	}

  /**
   * Remove th card from the stack
   * @param playingCard - The card to remove
   * @param changeOwner - If true change the owner of the card
   * @return PlayingCard - the card that was removed. If the card is not in the stack this returns undefined
   */
	public remove(playingCard : PlayingCard, changeOwner : Boolean = true) {
		var selectedCardIndex = this.stack.indexOf(playingCard);
		if (selectedCardIndex > -1) {
			this.stack.splice(selectedCardIndex, 1);
			if (changeOwner) {
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
		this.playingCards.stack.push(this.upcard);
		this.upcard.owningStack = this.playingCards;
	}
}