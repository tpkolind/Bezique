import { Component } from '@angular/core';
import { FabContainer } from 'ionic-angular'
import { AuthService } from '../../providers/auth-service';

import { BeziqueCardGame } from '../../services/game';
import { CardPlayer } from '../../services/player';



@Component({
  selector: 'page-table',
  templateUrl: 'table.html'
})
export class TablePage {

  public user = {};

  constructor(public beziqueCardGame : BeziqueCardGame, public authService : AuthService) {
  }

  public doLogin(fab : FabContainer) {
    fab.close();
    this.authService.signInWithGoogle();
  }

  public doLogout(fab : FabContainer) {
    fab.close();
    this.authService.signOut();
  }

  public doCreateGame(fab : FabContainer) {
    fab.close();
    this.beziqueCardGame.reset();
  }
}
