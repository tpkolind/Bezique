import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-authenticate',
  templateUrl: 'authenticate.html',
})
export class AuthenticatePage {

  constructor(
    public navCtrl: NavController,
    public authService : AuthService) {}

  public doLoginWithGoogle() {
    this.authService.signInWithGoogle()
      .then(() => {
        this.navCtrl.pop();
      });
  }

  public doLoginWithFacebook() {
    this.authService.signInWithFacebook()
      .then(() => {
        this.navCtrl.pop();
      });
  }
}