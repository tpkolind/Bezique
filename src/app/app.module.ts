import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { PlayerPage } from '../pages/player/player';
import { DeckPage } from '../pages/deck/deck';
import { GamePage } from '../pages/game/game';
import { TablePage } from '../pages/table/table';
import { CardCollection } from '../components/card-collection/card-collection'
import { PlayerComponent } from '../components/player/player'

@NgModule({
  declarations: [
    MyApp,
    PlayerPage,
    DeckPage,
    TablePage,
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
    TablePage,
    GamePage,
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
