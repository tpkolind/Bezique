
import { CardStack, PlayingCard } from './deck';
import { CardGame } from './game';

export const defaultPlayerConfiguration = {
    minHandLength : 0,
    maxHandLength : 8,
    minPlayableCards: 1,
    maxPlayableCards: 1
}

export class CardPlayer {
    public hand : CardStack = new CardStack();
    public selectedCards: CardStack = new CardStack();
    public playedCards : CardStack = new CardStack();
    public wonCards: CardStack = new CardStack();

    constructor (public name : string, public game: CardGame, private playerConfig) {
    }

    public canDraw() {
        return this.hand.stack.length < this.playerConfig.maxHandLength &&
            this.game.deck.playingCards.stack.length > 0;
    }

    public draw(numberOfCards : Number = 1) {
        for (var cardNumber = 0; cardNumber < numberOfCards; cardNumber++) {
            this.hand.add(this.game.deck.draw());
        }
    }

    public toggleSelect(playingCard : PlayingCard) {
        if (playingCard.selected) {
            this.selectedCards.remove(playingCard);
        } else {
            this.selectedCards.add(playingCard);
        }
    }

    public canPlay() {
        return this.selectedCards.stack.length >= this.playerConfig.minPlayableCards &&
            this.selectedCards.stack.length <= this.playerConfig.maxPlayableCards &&
            this.game.inTurn === this && !this.canDraw();
    }

    public play() {
        this.selectedCards.stack.forEach((card) => {
            this.hand.moveToStack(card, this.playedCards);
        });
        this.selectedCards.clear();
        this.game.nextTurn()
    }
}