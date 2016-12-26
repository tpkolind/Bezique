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

export class PlayingCard {
    constructor (public rank : string, public suit : string) {
    }

    public shortName() {
        return this.rank + this.suit;
    }

    public longName() {
        return Ranks[this.rank] + ' of ' + Suits[this.suit];
    }
}

export class Deck {
    public playingCards: PlayingCard[] = [];
    constructor (private config) {
        this.resetDeck();
        this.shuffle();
    }

    public resetDeck() {
        this.playingCards = [];
        // For each deck
        for (var deck = 0; deck < this.config.decks; deck++) {
            // For each rank
            for (var rank in this.config.ranks) {
                // For each suit
                for (var suit in this.config.suits) {
                    // Create a playing card and put it in the deck
                    this.playingCards.push(new PlayingCard(this.config.ranks[rank], this.config.suits[suit]));
                }
            }

            // For each joker
            for (var joker = 0; joker < this.config.jokers; joker++) {
                this.playingCards.push(new PlayingCard('N', undefined));
            }
        }
    }

    public shuffle(numberOfTimes = 5) {
        var randomPosition = 0;
        var oldCard;
        for (var shuffleRound = 0; shuffleRound < numberOfTimes; shuffleRound++) {
            for (var cardNumber = 0; cardNumber < this.playingCards.length; cardNumber++) {
                randomPosition = Math.floor(Math.random() * this.playingCards.length);
                oldCard = this.playingCards[cardNumber];
                this.playingCards[cardNumber] = this.playingCards[randomPosition];
                this.playingCards[randomPosition] = oldCard;
            }
        }
    }

    public draw() : PlayingCard {
        return this.playingCards.shift();
    }
}