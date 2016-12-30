import { Component, OnInit } from '@angular/core';
import { FabContainer, Events, NavController } from 'ionic-angular'
import { AuthService } from '../../providers/auth-service';

import { BeziqueCardGame } from '../../services/game';
import { AuthenticatePage } from '../authenticate/authenticate'


@Component({
  selector: 'page-table',
  templateUrl: 'table.html',
})
export class TablePage implements OnInit  {

  public user = {};

  constructor(
    public beziqueCardGame : BeziqueCardGame, 
    public authService : AuthService, 
    public navCtrl: NavController,
    public events : Events) {
  }

  ngOnInit() {
    this.events.subscribe('authService:logout', () => {
        this.login();
      });
    if (!this.authService.authenticated()) {
      this.login();
    }
  }

  public doLogin(fab : FabContainer) {
    fab.close();
    this.login();
  }

  public login() {
    this.navCtrl.push(AuthenticatePage);
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
