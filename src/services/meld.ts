import { Injectable } from '@angular/core';
import { PlayingCard, Suits } from './playing-card';
import { CardStack, Deck, beziqueDeckConfiguration } from './deck';
import { CardPlayer, defaultPlayerConfiguration } from './player';

export const MELD_SCORES = {
  'b': 100,
  'db': 500,
  'cm': 50,
  'rm': 50,
  'a': 50,
  'k': 50,
  'q': 50,
  'j': 50,
  'f': 50
}

/** 
 * Class to represent a meld in Bezique
 */
export class Meld {
    
    /** Score of the meld */
    public score : number;

    constructor (public name : string, public cards : CardStack) {
        this.score = MELD_SCORES[name];
    }

    /** Check if a meld is still valid (in progress) */
    public isValid() {
        switch(this.name) {
            case 'b': 
                break;
            case 'db':
                var current, match;
                for (var i=0; i < this.cards.stack.length; i++) {
                    current = this.cards.stack[i];
					if (this.cards.stack[i].rank === "Q") {
						for (var j=i+1; i < this.cards.stack.length; j++) {
							match = this.cards.stack[j];
							if (match.rank === "K") {
								;
							}
						}
					}
					else if (this.cards.stack[i].rank === "K") {

					}
                }
                break;
            default:
                break;
        }
    }

}