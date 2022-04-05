import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game/game.component';
import { HomeComponent } from './home/home/home.component';
import { LeaderboardComponent } from './leaderboard/leaderboard/leaderboard.component';
import { LobbyComponent } from './lobby/lobby/lobby.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'lobby', component: LobbyComponent},
  {path: 'leaderboard', component: LeaderboardComponent},
  {path: 'game', component: GameComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
