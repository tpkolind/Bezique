import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule, AuthMethods, AuthProviders } from 'angularfire2';


import { MyApp } from './app.component';
import { AuthenticatePage } from '../pages/authenticate/authenticate';
import { PlayerPage } from '../pages/player/player';
import { DeckPage } from '../pages/deck/deck';
import { GamePage } from '../pages/game/game';
import { TablePage } from '../pages/table/table';
import { CardsComponent } from '../components/cards/cards';
import { PlayerComponent } from '../components/player/player';
import { PlayingTableComponent } from '../components/playing-table/playing-table';
import { PlayingCardComponent } from '../components/playing-card/playing-card';


export const firebaseConfig = {
  apiKey: "AIzaSyBfyxvQJpO2vUodmvflT4a3WG1Yyo_aNwc",
  authDomain: "beziquecardapp.firebaseapp.com",
  databaseURL: "https://beziquecardapp.firebaseio.com",
  storageBucket: "beziquecardapp.appspot.com",
  messagingSenderId: "172301089862"
};

@NgModule({
  declarations: [
    MyApp,
    AuthenticatePage,
    PlayerPage,
    DeckPage,
    TablePage,
    GamePage,
    CardsComponent,
    PlayerComponent,
    PlayingCardComponent,
    PlayingTableComponent,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig, {
      provider: AuthProviders.Google,
      method: AuthMethods.Popup 
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AuthenticatePage,
    PlayerPage,
    DeckPage,
    TablePage,
    GamePage,
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
