import { CardStack, PlayingCard } from './deck';
import { CardGame } from './game';

export class CardPlayer {
    public hand : CardStack = new CardStack();
    public selectedCards: CardStack = new CardStack();
    public playedCard : PlayingCard;

    constructor (public name : string, public game: CardGame) {

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

    public playCards() {
        var card = this.selectedCards.stack[0];
        this.selectedCards.remove(card);
        this.hand.remove(card);
        this.playedCard = card;
    }
}