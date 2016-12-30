import { Injectable } from '@angular/core';
import { AuthProviders, FirebaseAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';
import { Events } from 'ionic-angular';

@Injectable()
export class AuthService {
  private authState: FirebaseAuthState;

  constructor(public auth$: FirebaseAuth, public events : Events) {
    this.auth$.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
      let eventName : string = this.authenticated() ? 'authService:login' : 'authService:logout';
      this.events.publish(eventName);
    });

  }

  public authenticated(): boolean {
    return this.authState !== undefined && this.authState !== null;
  }

  public signInWithFacebook(): firebase.Promise<FirebaseAuthState> {
    return this.auth$.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup
    });
  }

  public signInWithGoogle(): firebase.Promise<FirebaseAuthState> {
    return this.auth$.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    });
  }

  public signOut(): void {
    this.auth$.logout();
  }

  public displayName(): string {
    if (this.authState) {
      return this.authState.auth.displayName;
    } else {
      return '';
    }
  }
}