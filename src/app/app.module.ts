import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { PlayerPage } from '../pages/player-page/player-page';
import { DeckPage } from '../pages/deck-page/deck-page';
import { GamePage } from '../pages/game-page/game-page';
import { CardCollection } from '../components/card-collection/card-collection'
import { PlayerComponent } from '../components/player/player'

@NgModule({
  declarations: [
    MyApp,
    PlayerPage,
    DeckPage,
    GamePage,
    CardCollection,
    PlayerComponent,
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
