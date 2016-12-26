import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { PlayerPage } from '../pages/player-page/player-page';
import { DeckPage } from '../pages/deck-page/deck-page';
import { GamePage } from '../pages/game-page/game-page';
import { CardCollection } from '../pages/card-collection/card-collection'

@NgModule({
  declarations: [
    MyApp,
    PlayerPage,
    DeckPage,
    GamePage,
    CardCollection,
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
