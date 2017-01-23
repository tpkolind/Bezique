import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class OnlineGame {

  public availablePlayers = {
    playerId: {
      name: 'Jens',
      completedGames: ['gameId'],
      activeGames: ['gameId'],
    }
  };

  public games = [];

  public decks = [];


  constructor(public http: Http) {

  }

}
