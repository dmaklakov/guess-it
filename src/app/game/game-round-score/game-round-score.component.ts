import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Player } from 'src/app/shared/models/player';
import { WebsocketService } from '../../core/services/websocket.service';
import { GameParamsService } from '../../core/services/game-params.service';
import { Command } from '../../shared/models/command.enum';

// Class for the panel with score after every round
@Component({
  selector: 'app-game-round-score',
  templateUrl: './game-round-score.component.html',
  styleUrls: ['./game-round-score.component.scss']
})
export class GameRoundScoreComponent implements OnInit, OnDestroy {
  
  solution: string;
  players: Player[];
  wsSubscription: Subscription;
  constructor(public ws: WebsocketService, public game: GameParamsService) { }

  ngOnInit(): void {
    this.wsSubscription = this.ws.received.subscribe((message) => {
      if (message.cmd === Command.WORD_SOLUTION) {
        this.solution = message.parameters.solution;
        this.players = this.game.getPlayersOrderedByPointsGain();
      }
    })
  }

  ngOnDestroy(): void {
    this.wsSubscription.unsubscribe();
  }

}
