import { PlayingCard, CardDefinition } from './playing-card'

export const defaultDeckConfiguration = {
	decks: 1,
	jokers: 2,
	ranks: [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A' ],
	suits: [ 'S', 'D', 'C', 'H' ],
	meldFunctions: {},
	trump: false
}

export const beziqueDeckConfiguration = {
	decks: 2,
	jokers: 0,
	ranks: [ '7', '8', '9', 'J', 'Q', 'K', '10', 'A' ],
	suits: [ 'S', 'D', 'C', 'H' ],
	meldFunctions: {
		aces: (cards : CardStack, trumpSuit : string) => {
			return cards.stack.length === 4 && cards.contains({ rank: 'A', suit: undefined} ) === 4;
		},
		kings: (cards : CardStack, trumpSuit : string) => {
			return cards.stack.length === 4 && cards.contains({ rank: 'K', suit: undefined} ) === 4;
		},
		queens: (cards : CardStack, trumpSuit : string) => {
			return cards.stack.length === 4 && cards.contains({ rank: 'Q', suit: undefined} ) === 4;
		},
		jacks: (cards : CardStack, trumpSuit : string) => {
			return cards.stack.length === 4 && cards.contains({ rank: 'J', suit: undefined} ) === 4;
		},
		bezique: (cards: CardStack, trumpSuit: string) => {
			return cards.stack.length === 2 && 
				cards.containsSeries([
					{ rank: 'Q', suit: 'S'}, 
					{ rank: 'J', suit: 'D'}
				]);
		},
		doubleBezique: (cards: CardStack, trumpSuit: string) => {
			return cards.stack.length === 4 && 
				cards.containsSeries([
					{ rank: 'Q', suit: 'S'},
					{ rank: 'Q', suit: 'S'},
					{ rank: 'J', suit: 'D'},
					{ rank: 'J', suit: 'D'}
				]);
		},
		marriage: (cards: CardStack, trumpSuit: string) => {
			return cards.stack.length === 2 && 
				(cards.containsSeries([{ rank: 'K', suit: 'S'}, { rank: 'Q', suit: 'S'}]) && trumpSuit !== 'S') ||
				(cards.containsSeries([{ rank: 'K', suit: 'D'}, { rank: 'Q', suit: 'D'}]) && trumpSuit !== 'D') ||
				(cards.containsSeries([{ rank: 'K', suit: 'C'}, { rank: 'Q', suit: 'C'}]) && trumpSuit !== 'C') ||
				(cards.containsSeries([{ rank: 'K', suit: 'H'}, { rank: 'Q', suit: 'H'}]) && trumpSuit !== 'H');
		},
		royalMarriage: (cards: CardStack, trumpSuit: string) => {
			return cards.stack.length === 2 && 
				cards.containsSeries([{ rank: 'K', suit: trumpSuit}, { rank: 'Q', suit: trumpSuit}]);
		},
		flush: (cards: CardStack, trumpSuit: string) => {
			return cards.stack.length === 5 &&
				cards.containsSeries([
					{ rank: 'A', suit: trumpSuit}, 
					{ rank: '10', suit: trumpSuit}, 
					{ rank: 'K', suit: trumpSuit}, 
					{ rank: 'Q', suit: trumpSuit},
					{ rank: 'J', suit: trumpSuit}
				]);
		}
	},
	optimizedMeldEvaluation: (cards: CardStack, trumpSuit: string) : Array<string> => {
		let availableMelds : Array<string> = [];
		let counters = {
			aces: 0,
			kings: 0,
			queens: 0,
			jacks: 0,
			jackDiamonds: 0,
			queenSpades: 0,
			// [A, 10, K, Q, J]
			flush: [0,0,0,0,0],
			marriages: {
				S: [0, 0],
				D: [0, 0],
				C: [0, 0],
				H: [0, 0]
			}
		}

		cards.stack.forEach((card) => {
			counters.aces += card.equals({ rank: 'A', suit: undefined }) ? 1 : 0;
			counters.kings += card.equals({ rank: 'K', suit: undefined }) ? 1 : 0;
			counters.queens += card.equals({ rank: 'Q', suit: undefined }) ? 1 : 0;
			counters.queenSpades += card.equals({ rank: 'Q', suit: 'S'}) ? 1 : 0;
			counters.jacks += card.equals({ rank: 'J', suit: undefined }) ? 1 : 0;
			counters.jackDiamonds += card.equals({ rank: 'J', suit: 'D'}) ? 1 : 0;
			counters.flush[0] += card.equals({ rank: 'A', suit: trumpSuit}) ? 1 : 0;
			counters.flush[1] += card.equals({ rank: '10', suit: trumpSuit}) ? 1 : 0;
			counters.flush[2] += card.equals({ rank: 'K', suit: trumpSuit}) ? 1 : 0;
			counters.flush[3] += card.equals({ rank: 'Q', suit: trumpSuit}) ? 1 : 0;
			counters.flush[4] += card.equals({ rank: 'J', suit: trumpSuit}) ? 1 : 0;
			counters.marriages[card.suit][0] += card.equals({ rank: 'K', suit: undefined}) ? 1 : 0;
			counters.marriages[card.suit][1] += card.equals({ rank: 'Q', suit: undefined}) ? 1 : 0;
		});

		switch(cards.stack.length) {
			case 5:
				let flush = counters.flush.reduce((flushFound, numberOfCards) => { return flushFound && numberOfCards === 1; }, true);
				if (flush) availableMelds.push('flush');
				break;
			case 4:
				if (counters.aces === 4) availableMelds.push('aces');
				if (counters.kings === 4) availableMelds.push('kings');
				if (counters.queens === 4) availableMelds.push('queens');
				if (counters.jacks === 4) availableMelds.push('jacks');
				if (counters.jackDiamonds === 2 && counters.queenSpades === 2) availableMelds.push('doubleBezique');
				break;
			case 2:
				if (counters.jackDiamonds === 1 && counters.queenSpades === 1) availableMelds.push('bezique');
				let marriageSuits = Object.keys(counters.marriages);
				let marriages = marriageSuits.reduce((marriagesFound, suit) => { 
					marriagesFound[suit] = counters.marriages[suit][0] === 1 && counters.marriages[suit][1] === 1;
					return marriagesFound;
				}, { S: false, D: false, C: false, H: false});

				let anyMarriage = marriageSuits.reduce((marriageFound, suit) => { return marriageFound || marriages[suit] }, false);

				if (marriages[trumpSuit]) {
					availableMelds.push('royalMarriage');
				} else if (anyMarriage) {
					availableMelds.push('marriage');	
				}
				break;
		}
		return availableMelds;
	},
	meldScores: {
		aces: 100,
		kings: 80,
		queens: 60,
		jacks: 40,
		marriage: 50,
		royalMarriage: 100,
		bezique: 50,
		doubleBezique: 250,
		flush: 500,
	},
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

	public contains(soughtCard: CardDefinition) : number {
		return this.stack.reduce((count, card) => {
			count += card.equals(soughtCard) ? 1 : 0;
			return count;
		}, 0);
	}

	public containsSeries(soughtSeries: CardDefinition[]) : boolean {
		let foundSeries = soughtSeries.map(() => { return false } );
		this.stack.forEach((card) => {
			soughtSeries.forEach((soughtCard, index) => {
				foundSeries[index] = foundSeries[index] || (card.equals(soughtCard));
			});
		});
		return foundSeries.reduce((previousValue, value) => {
			return previousValue && value
		}, true);
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
	public dece : PlayingCard;

  /** Create the deck
   * @param config - the configuration to use for the deck
   */
	constructor (private config) {
		this.resetDeck();
		this.shuffle();
	}

  /** Create the deck according to the configuration */
	public resetDeck() {;
		this.trumpSuit = undefined;
		this.dece = undefined;
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
			};
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

	public canMeld(selectedCards : CardStack) : boolean {
		return this.availableMelds(selectedCards).length > 0;
	}

	public meldScore(selectedCards : CardStack) : number {
		return this.availableMelds(selectedCards).reduce((newScore, meldName) => {
			newScore += this.config.meldScores[meldName];
			return newScore;
		}, 0);
	}


	public availableMelds(selectedCards : CardStack) : Array<string> {
		if (selectedCards.stack.length > 1) {
			// let meldFunctionTypes = Object.keys(this.config.meldFunctions);

			// return meldFunctionTypes.filter((meldName) => {
			// 	return this.config.meldFunctions[meldName](selectedCards, this.trumpSuit);
			// });
			return this.config.optimizedMeldEvaluation(selectedCards, this.trumpSuit);
		} else {
			return [];
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
		if (this.config.trump) {
			this.trumpSuit = this.upcard.suit;
			this.dece = new PlayingCard(this.config.ranks[0], this.trumpSuit);
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