import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home/home.component';
import { LobbyComponent } from './lobby/lobby/lobby.component';
import { LeaderboardComponent } from './leaderboard/leaderboard/leaderboard.component';
import { GameComponent } from './game/game/game.component';

import { GameParamsService } from './core/services/game-params.service';
import { ModalComponent } from './modal/modal.component';
import { GameRoundTextComponent } from './game/game-round-text/game-round-text.component';
import { HttpClientModule } from '@angular/common/http';
import { GameRoundScoreComponent } from './game/game-round-score/game-round-score.component';
import { GameTimerComponent } from './game/game-timer/game-timer.component';
import { GameChatComponent } from './game/game-chat/game-chat.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LobbyComponent,
    LeaderboardComponent,
    GameComponent,
    ModalComponent,
    GameRoundTextComponent,
    GameRoundScoreComponent,
    GameTimerComponent,
    GameChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [GameParamsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
