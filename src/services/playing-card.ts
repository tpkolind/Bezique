import { CardStack } from './deck';

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

export interface CardDefinition {
	rank: string,
	suit: string
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

	public toggleSelect(selectionStack : CardStack, multiSelect : boolean = false) {
		var previouslySelected = this.selected;
		if (selectionStack) {
			if (!multiSelect) {
				selectionStack.stack.forEach((card) => {
					card.selected = false;
					selectionStack.remove(card);
				});
			}
			this.selected = !previouslySelected;
			if (this.selected) {
				selectionStack.add(this);
			} else {
				selectionStack.remove(this);
			}
		}
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

	public equals(card : CardDefinition ) : boolean {
		return (!card.rank || this.rank === card.rank) && (!card.suit || this.suit === card.suit);
	}

	public equalsCard(card : PlayingCard) : boolean {
		return card && card.rank === this.rank && card.suit === this.suit;

	}
 }