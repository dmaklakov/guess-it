import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { WebsocketService } from '../../core/services/websocket.service';
import { Command } from '../../shared/models/command.enum';
import { Message } from '../../shared/models/message';
import { GameParamsService } from '../../core/services/game-params.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MediaType } from 'src/app/shared/models/media-type.enum';

// Class for a game component
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('inputVal') inputVal: ElementRef;

  subscription: Subscription;
  roundImage: boolean;
  time: Number;
  currMediaType: string;
  mediaType = MediaType;
  rounds = 0;
  wrongGuess = false;
  showScore = false;
  url: string = '';

  private url_for: string = 'https://guessit-backend.1up.kiwi/'; 	// Url of Backend server with all media

  constructor(
    public readonly ws: WebsocketService,
    public game: GameParamsService,
    private router: Router
  ) {
    if (this.game.gamecode == '') {
      this.router.navigate(['']);
    }
    console.log(this.game);
  }

  ngOnInit(): void {
    this.currMediaType = this.game.firstMessage.parameters.type;
    this.url = this.url_for + this.game.firstMessage.parameters.url;
    this.rounds = this.game.firstMessage.parameters.round;
    this.time = Math.round(this.game.firstMessage.parameters.timer / 1000);
    
	// Subscription on all messages from server - game updates
    this.subscription = this.ws.received.subscribe((message) => {
      if (message.cmd === Command.PLAYER_JOINED) {			// Some player has joined the game (possible now too)
        this.game.players.push(message.parameters.player);
      }
      if (message.cmd === Command.PLAYER_LEFT) {			// Some player has left the game
        this.game.deletePlayerArray(message.parameters.playerId);
      }

      if (message.cmd === Command.NEXT_ROUND) {				// Information for next round
        this.showScore = false;
        this.rounds = message.parameters.round;
        this.game.clearAfterRound();
        this.currMediaType = message.parameters.type;
      }
      if (
        message.cmd === Command.NEXT_ROUND ||				// Updating of timer
        message.cmd === Command.NEXT_LEVEL ||
        message.cmd === Command.WORD_SOLUTION
      ) {
        this.time = new Number(Math.round(message.parameters.timer / 1000));
        if (
          message.cmd === Command.NEXT_ROUND ||				// Updating of url (different for each level and round)
          message.cmd === Command.NEXT_LEVEL
        ) {
          this.url = this.url_for + message.parameters.url;
        }

        this.game.players.sort((n1, n2) => n2.points - n1.points);
      }
      if (message.cmd === Command.GUESSED_CORRECT) {		// Case you guessed wrong -> update points
        this.game.setGuessCorrectOnId(message.parameters.playerId);
       
        this.game.setPointsOnId(
          message.parameters.playerId,
          message.parameters.points
        );
      }
      if (
		message.cmd === Command.GUESSED_WRONG &&			// Case you guessed wrong -> animation
		this.game.isYou(message.parameters.playerId)
	  ) {
          this.wrongGuess = true;   
      }
      if (message.cmd === Command.WORD_SOLUTION) {			// Message with the right answer, 
        this.showScore = true;
		if (this.currMediaType === MediaType.AUDIO) {
			this.url = "";
		}
      }
      if (message.cmd === Command.GAME_END) {				// Message after the last roung of the game								
        this.game.players = this.game.players.slice(0, 3);
        this.router.navigate(['leaderboard']);
      }
    
    });
  }

  // Send a players suggestion on server
  public sendGuess(guess: string) {
    this.inputVal.nativeElement.value = '';
    this.wrongGuess = false;
    let msg: Message = new Message();
    msg.cmd = Command.I_GUESS;
    msg.parameters = { guess: guess };
    this.ws.send(msg);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
