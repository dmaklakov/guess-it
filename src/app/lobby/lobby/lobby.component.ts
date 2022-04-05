import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from '../../core/services/websocket.service';
import { GameParamsService } from '../../core/services/game-params.service';
import { Command } from '../../shared/models/command.enum';
import { Message } from '../../shared/models/message';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Player } from 'src/app/shared/models/player';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  isStartButton = true;

  constructor(
    private ws: WebsocketService,
    public game: GameParamsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.game.gamecode == '') {
      this.router.navigate(['']);
    }
	
	// Sending message on server
    if (this.game.creates) {
      this.ws.create(this.game.gamecode);
    } else {
      this.ws.join(this.game.gamecode);
    }
	
	// Work with messages of different types (message.cmd) from server
    this.subscription = this.ws.received.subscribe((message) => {
      if (message.cmd === Command.ASSIGN_PLAYER) {		// Information about your player
        this.game.player = { ...message.parameters.you, prevPoints: 0};
        this.game.players.push(this.game.player);
      }
      if (message.cmd === Command.CURRENT_PLAYERS) {	// Information about all players
		let players = message.parameters.players as Array<any>;
		players.push(this.game.player);
		this.game.players = players;
        if (this.game.players.length == 1) {
          this.game.host_player = true;
          this.game.hostId = this.game.player.id;
        } else {
          this.game.hostId = this.game.players[0].id;
        }
      }
      if (message.cmd === Command.PLAYER_JOINED) {		// New player has joined the game
        this.game.players.push(message.parameters.player);
      }
      if (message.cmd === Command.PLAYER_LEFT) {		// Player has left the game
        this.game.deletePlayerArray(message.parameters.playerId);
        if (
          this.game.players.length > 0 &&
          this.game.players[0].name == this.game.player.name
        ) {
          this.game.host_player = true;
          this.game.hostId = this.game.player.id;
        }
      }
      if (message.cmd === Command.TOTAL_ROUNDS) {		// Information about total number of rounds
        this.game.totalRounds = message.parameters.rounds;
      }
      if (message.cmd === Command.NEXT_ROUND) {			// Information about new round - there about the first with redirect to the game page
        this.game.firstMessage = message;
        this.subscription.unsubscribe();
        this.router.navigate(['game']);
      }
    });
  }

  // For host: click to start a game
  start(): void {
    let msg: Message = new Message();
    msg.cmd = Command.START_GAME;
    this.ws.send(msg);
    this.isStartButton = false;
  }

  ifThisHost(playerId: string): boolean {
    return playerId == this.game.hostId;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
