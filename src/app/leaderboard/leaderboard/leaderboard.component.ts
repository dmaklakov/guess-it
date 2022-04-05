import { Component, OnInit } from '@angular/core';
import { GameParamsService } from '../../core/services/game-params.service';
import { Router } from '@angular/router';
import { WebsocketService } from '../../core/services/websocket.service';

// Page with results after the game (only 3 first places)
@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  constructor(
    private ws: WebsocketService,
    public game: GameParamsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.game.gamecode == '') {
      this.router.navigate(['']);
    }
  }

  public leave(): void {
    this.game.clear();
    this.ws.disconnect();
    this.router.navigate(['']);
  }
}
