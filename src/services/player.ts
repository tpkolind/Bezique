
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
	public availableMelds: CardStack = new CardStack();

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
		// this.calculateMelds();
		// return this.availableMelds.isEmpty();
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
	
	public calculateMelds() {
		
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