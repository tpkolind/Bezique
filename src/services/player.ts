
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

export class CardPlayer {
    public hand : CardStack = new CardStack();
    public selectedCards: CardStack = new CardStack();
    public playedCards : CardStack = new CardStack();
    public wonCards: CardStack = new CardStack();
    public melds: CardStack = new CardStack();

    constructor (public name : string, public game: CardGame, private playerConfig) {
    }

    public canDraw() {
        return this.hand.stack.length + this.melds.stack.length < this.playerConfig.maxHandLength &&
            this.game.deck.playingCards.stack.length > 0;
    }

    public draw(numberOfCards : Number = 1) {
        for (var cardNumber = 0; cardNumber < numberOfCards; cardNumber++) {
            this.hand.add(this.game.deck.draw());
        }
    }

    public toggleSelect(playingCard : PlayingCard) {
        if (playingCard.selected) {
            this.selectedCards.remove(playingCard, false);
        } else {
            this.selectedCards.add(playingCard, false);
        }
    }

    public canPlay() {
        return this.selectedCards.stack.length >= this.playerConfig.minPlayableCards &&
            this.selectedCards.stack.length <= this.playerConfig.maxPlayableCards &&
            this.game.inTurn === this && !this.canDraw();
    }

    public play() {
        this.selectedCards.stack.forEach((card) => {
            card.selected = false;
            card.moveToStack(this.playedCards);
        });
        this.selectedCards.clear();
        this.game.nextTurn()
    }

    public canMeld() {
        return this.game.inTurn === this && 
            this.selectedCards.stack.length >= this.playerConfig.minMeldableCards &&
            this.selectedCards.stack.length <= this.playerConfig.maxMeldableCards;
    }

    public meld() {
        this.selectedCards.stack.forEach((card) => {
            card.selected = false;
            card.moveToStack(this.melds);
        });
        this.selectedCards.clear();        
    }
}