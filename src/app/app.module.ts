import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { PlayerPage } from '../pages/player/player';
import { DeckPage } from '../pages/deck/deck';
import { GamePage } from '../pages/game/game';

@NgModule({
  declarations: [
    MyApp,
    PlayerPage,
    DeckPage,
    GamePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PlayerPage,
    DeckPage,
    GamePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
