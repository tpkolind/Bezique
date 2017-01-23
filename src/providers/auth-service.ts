import { Injectable } from '@angular/core';
import { 
  AuthProviders, 
  // FirebaseAuth, 
  // FirebaseAuthState, 
  AuthMethods 
} from 'angularfire2';
import { Events } from 'ionic-angular';


@Injectable()
export class AuthService {
  // private authState: FirebaseAuthState;

  constructor(
    // public auth$: FirebaseAuth, 
    // public events : Events
    ) {
    // this.auth$.subscribe((state: FirebaseAuthState) => {
    //   this.authState = state;
    //   let eventName : string = this.authenticated() ? 'authService:login' : 'authService:logout';
    //   this.events.publish(eventName);
    // });

  }

  public authenticated(): boolean {
    return true;
    // return this.authState !== undefined && this.authState !== null;
  }

  public signInWithFacebook(): Promise<any>
    // firebase.Promise<FirebaseAuthState> 
  {
    // return this.auth$.login({
    //   provider: AuthProviders.Facebook,
    //   method: AuthMethods.Popup
    // });
    return Promise.resolve(true);
  }

  public signInWithGoogle(): Promise<any>
  // firebase.Promise<FirebaseAuthState> 
  {
    // return this.auth$.login({
    //   provider: AuthProviders.Google,
    //   method: AuthMethods.Popup
    // });
    return Promise.resolve(true);
  }

  public signOut(): void {
    // this.auth$.logout();
  }

  public displayName(): string {
    return 'Jens';
    // if (this.authState) {
    //   return this.authState.auth.displayName;
    // } else {
    //   return '';
    // }
  }
}